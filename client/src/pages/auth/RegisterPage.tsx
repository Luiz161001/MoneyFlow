import logo from "../../assets/logo.png";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { Link } from "react-router-dom";
 
export function RegisterPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Link to="/">
                    <div className="flex justify-center mb-2 mt-2">
                        <img src={logo} alt="MoneyFlow logo" className="w-32 h-auto" />
                    </div>
                </Link>
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}