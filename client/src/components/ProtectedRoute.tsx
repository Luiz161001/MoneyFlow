import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function ProtectedRoute() {
  // Read a single value from the store — no Provider, no context, just the hook
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const user = useAuthStore((s) => s.user);

  // Wait for the session check to finish before deciding where to send the user
  if (isInitializing) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
