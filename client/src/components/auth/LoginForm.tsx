import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, setAccessToken } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

export function LoginForm() {

    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...form, [name]: value };
        setForm(updated);

        if (name === "email") {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setErrors(prev => ({ ...prev, email: emailValid ? "" : "Please enter a valid email address." }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (errors.email) return;

        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.post('/auth/login', form);
            console.log(res);
            const userData = res.data.data;
            setAccessToken(userData.accessToken);
            setUser(userData.user);
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState({ email: "" });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-fg">Welcome back</h1>
                <p className="text-sm text-muted-fg mt-1">Sign in to your MoneyFlow account</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-fg mb-1">Email</label>
                    <input
                        type="text"
                        placeholder="you@example.com"
                        className={`w-full px-3 py-2 bg-surface-2 border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:border-border-strong ${errors.email ? "border-red-500" : "border-border"}`}
                        name="email"
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-fg mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:border-border-strong"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    className="w-full mt-3 py-2.5 bg-brown hover:bg-brown-dark text-surface rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Singin in..." : "Sign in"}
                </button>
            </form>

            <p className="text-center text-sm text-muted-fg mt-4">
                Don't have an account?{" "}
                <a href="/register" className="text-brown hover:text-brown-dark font-medium">Create one</a>
            </p>
        </div>
    )
}