import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

// Axios request configs do not include our custom "_retry" flag by default,
// so we extend the type to track whether a failed request has already been retried once.
type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// This matches the backend refresh-token response we expect:
// { data: { accessToken: "..." } }
// Making the shape explicit helps TypeScript catch mistakes when the backend changes.
type RefreshTokenResponse = {
  data?: {
    accessToken?: string;
  };
};

// When multiple requests fail with 401 at the same time, only one refresh call should run.
// The other requests wait in this queue until the refresh finishes.
type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

// ─── Configuration ────────────────────────────────────────────────────────────

// Vite exposes frontend environment variables through import.meta.env.
// We use this value as the base URL for every API request.
const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Fail fast during app startup if the API URL was not configured.
// Without this, requests would fail later in a less obvious way.
if (!baseUrl) {
  throw new Error('Missing VITE_BACKEND_URL in the client environment.');
}

// ─── In-memory state ──────────────────────────────────────────────────────────

// Keep the access token in memory so a page refresh clears it automatically.
let accessToken: string | null = null;

// This flag prevents multiple refresh calls from running at once.
let isRefreshing = false;

// Requests that hit 401 while a refresh is already in progress wait here.
let pendingRequests: PendingRequest[] = [];

// ─── Token management ─────────────────────────────────────────────────────────

// Save the latest access token after login, register, or refresh.
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Small getter in case other parts of the app need to inspect the current token.
export const getAccessToken = () => accessToken;

// Clear the in-memory token when the user logs out or refresh fails.
export const clearAccessToken = () => {
  accessToken = null;
};

// Axios headers can arrive in different formats.
// This helper normalizes them and adds the Authorization header safely.
const setAuthorizationHeader = (headers: AxiosRequestConfig['headers'], token: string) => {
  const normalizedHeaders = headers instanceof AxiosHeaders ? headers : new AxiosHeaders(headers as Record<string, string> | undefined);

  normalizedHeaders.set('Authorization', `Bearer ${token}`);
  return normalizedHeaders;
};

// After a refresh attempt finishes, release all waiting requests.
// If refresh failed, reject them all.
// If refresh succeeded, resolve each one with the new token so it can retry.
const flushPendingRequests = (error: unknown, token: string | null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error ?? new Error('Unable to refresh access token.'));
      return;
    }

    resolve(token);
  });

  pendingRequests = [];
};

// ─── Token refresh ────────────────────────────────────────────────────────────

// Ask the backend for a brand-new access token using the refresh-token cookie.
// We use plain axios here instead of apiClient so we do not accidentally trigger
// the same response interceptor and create a refresh loop.
export const requestNewAccessToken = async () => {
  const response = await axios.post<RefreshTokenResponse>(
    `${baseUrl}/auth/token`,
    {},
    { withCredentials: true }
  );

  // Read the token from the response in a defensive way.
  const newToken = response.data.data?.accessToken;

  // If the backend did not send a token, treat that as a real failure.
  if (!newToken) {
    throw new Error('Refresh endpoint did not return an access token.');
  }

  return newToken;
};

// ─── Axios client ─────────────────────────────────────────────────────────────

// Shared Axios instance for the whole app.
// All requests automatically use the backend base URL and include cookies.
export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Before every request, attach the latest access token if we have one.
apiClient.interceptors.request.use((config) => {
  // Public routes may not need a token, so we simply return the config unchanged.
  if (!accessToken) {
    return config;
  }

  config.headers = setAuthorizationHeader(config.headers, accessToken);
  return config;
});

// After each response:
// - successful responses pass through untouched
// - 401 errors trigger the refresh-and-retry flow below
apiClient.interceptors.response.use((response) => response,
  async (error: AxiosError) => {
    // Axios includes the original request config on the error object.
    // We cast it to our extended type so we can track "_retry".
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Stop here if:
    // - there is no request to retry
    // - the error is not a 401 Unauthorized
    // - this request was already retried once
    // This avoids infinite loops.
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request so we only retry it once.
    originalRequest._retry = true;

    // If another request already started the refresh flow,
    // wait for it to finish and then retry with the new token.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = setAuthorizationHeader(originalRequest.headers, token);
        return apiClient(originalRequest);
      });
    }

    // This request becomes responsible for refreshing the token.
    isRefreshing = true;

    try {
      // Ask the backend for a new access token.
      const newToken = await requestNewAccessToken();

      // Save it for future requests.
      setAccessToken(newToken);

      // Wake up every request that was waiting for refresh to finish.
      flushPendingRequests(null, newToken);

      // Retry the original failed request with the fresh token.
      originalRequest.headers = setAuthorizationHeader(originalRequest.headers, newToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh fails, the session is effectively dead.
      // Clear the token and reject all waiting requests.
      clearAccessToken();
      flushPendingRequests(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      // No matter what happened, refresh is no longer in progress.
      isRefreshing = false;
    }
  }
);

// ─── Session initialization ───────────────────────────────────────────────────

// Holds the in-flight or completed init promise so the refresh call only ever
// runs once — even if initAuth is called multiple times (e.g. React StrictMode).
let authInitPromise: Promise<void> | null = null;

// Called once on app startup. Tries to restore the session from the refresh-token
// cookie. Silently does nothing if the cookie is missing or expired.
export const initAuth = (): Promise<void> => {
  if (authInitPromise) return authInitPromise;

  authInitPromise = (async () => {
    try {
      const token = await requestNewAccessToken();
      setAccessToken(token);
    } catch {
      // No valid session — user must log in
    }
  })();

  return authInitPromise;
};
