import logo from "../../assets/logo.png";
import { LoginForm } from "../../components/auth/LoginForm";
import { Link } from "react-router-dom";

export function LoginPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Link to="/">
                    <div className="flex justify-center mb-2 mt-2">
                        <img src={logo} alt="MoneyFlow logo" className="w-32 h-auto" />
                    </div>
                </Link>
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}