import { createBrowserRouter } from "react-router-dom";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { LandingPage } from "../pages/LandingPage";
import { DashBoard } from "../pages/DashBoard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute";
import { AppLayout } from "../components/AppLayout";
import { Transactions } from "../pages/Transactions";
import { Budget } from "../pages/Budget";
import { User } from "../pages/User";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        element: <PublicRoute />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: "/dashboard", element: <DashBoard /> },
                    { path: "/transactions", element: <Transactions /> },
                    { path: "/budget", element: <Budget /> },
                    { path: "/user", element: <User /> },
                ]
            }
        ]
    }
])