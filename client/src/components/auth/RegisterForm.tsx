import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { apiClient, setAccessToken } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";


export function RegisterForm() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const [form, setForm] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...form, [name]: value };
        setForm(updated);

        if (name === "email") {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setErrors(prev => ({ ...prev, email: emailValid ? "" : "Please enter a valid email address." }));
        }

        if (name === "confirmPassword" || name === "password") {
            const password = name === "password" ? value : updated.password;
            const confirmPassword = name === "confirmPassword" ? value : updated.confirmPassword;
            const match = password === confirmPassword;
            setErrors(prev => ({ ...prev, confirmPassword: match ? "" : "Passwords do not match." }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (errors.email || errors.confirmPassword) return;

        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.post('/auth/register', form);
            const userData = res.data.data;
            setAccessToken(userData.accessToken);
            setUser(userData.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState({ email: "", confirmPassword: "" });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-fg">Create an account</h1>
                <p className="text-sm text-muted-fg mt-1">Start managing your finances with MoneyFlow</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-fg mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:border-border-strong"
                        name="name"
                        onChange={handleChange}
                    />
                </div>

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

                <div>
                    <label className="block text-sm font-medium text-fg mb-1">Confirm password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 bg-surface-2 border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:border-border-strong ${errors.confirmPassword ? "border-red-500" : "border-border"}`}
                        name="confirmPassword"
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    className="w-full mt-3 py-2.5 bg-brown hover:bg-brown-dark text-surface rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="text-center text-sm text-muted-fg mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-brown hover:text-brown-dark font-medium">Sign in</a>
            </p>
        </div>
    )
}
