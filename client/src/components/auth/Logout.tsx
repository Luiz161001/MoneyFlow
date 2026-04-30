import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient, clearAccessToken } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

export function Logout() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const handleLogout = async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (err) {
            console.log(err);
        } finally {
            clearAccessToken();
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red bg-red-light hover:bg-red hover:text-surface transition-colors cursor-pointer"
            onClick={handleLogout}
        >
            <LogOut size={16} />
            Logout
        </button>
    );
}