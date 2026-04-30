import { create } from 'zustand';

// Matches exactly what the backend returns inside `data.user` on login/register
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  // --- State ---

  // True while the app is checking whether the user already has a valid session
  // on mount (via /auth/token). Stays true until that check resolves either way.
  isInitializing: boolean;

  // True while a login or logout request is in flight. Use this to show
  // button spinners and disable form inputs.
  isLoading: boolean;

  // The logged-in user, or null if not authenticated.
  user: User | null;

  // --- Actions ---

  // Called once the initial session check finishes (success or failure).
  setInitializing: (value: boolean) => void;

  // Called before and after login/logout requests.
  setLoading: (value: boolean) => void;

  // Called after a successful login, register, or session restore.
  // Call with null to clear the user on logout.
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // --- Initial state ---
  isInitializing: true,  // assume we need to check until proven otherwise
  isLoading: false,
  user: null,

  // --- Action implementations ---
  setInitializing: (value) => set({ isInitializing: value }),
  setLoading: (value) => set({ isLoading: value }),
  setUser: (user) => set({ user }),
}));
