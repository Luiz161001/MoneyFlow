import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function PublicRoute() {
    const isInitializing = useAuthStore((s) => s.isInitializing);
    const user = useAuthStore((s) => s.user);

    if (isInitializing) return null;

    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
