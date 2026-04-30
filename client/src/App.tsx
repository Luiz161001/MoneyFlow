import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";
import { initAuth, getAccessToken, apiClient } from "./lib/api";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    initAuth()
      .then(async () => {
        if (!getAccessToken()) return;
        const res = await apiClient.get('/users/me');
        setUser(res.data.data);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, [setInitializing, setUser]);

  return <RouterProvider router={router} />;
}

export default App;
