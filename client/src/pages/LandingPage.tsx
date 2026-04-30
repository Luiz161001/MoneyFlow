import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Footer } from "../components/Footer";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* Navbar */}
            <header className="w-full border-b border-border bg-surface px-6 py-4 flex items-center justify-between">
                <img src={logo} alt="MoneyFlow" className="h-10 w-auto" />
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-muted-fg hover:text-fg transition-colors px-4 py-2 rounded-lg hover:bg-surface-2"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-semibold text-surface bg-brown hover:bg-brown-dark transition-colors px-4 py-2 rounded-lg"
                    >
                        Get started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24 gap-8">
                <h1 className="text-5xl sm:text-6xl font-bold text-fg leading-tight max-w-2xl">
                    Take control of your{" "}
                    <span className="text-brown">money flow</span>
                </h1>

                <p className="text-muted-fg text-lg max-w-xl leading-relaxed">
                    Track income, expenses, and savings in one clean dashboard. Know
                    exactly where your money goes every single month.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/register"
                        className="px-6 py-3 rounded-xl bg-brown hover:bg-brown-dark text-surface font-semibold text-sm transition-colors shadow-sm"
                    >
                        Start for free
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-3 rounded-xl bg-surface-2 hover:bg-border text-fg font-semibold text-sm transition-colors border border-border"
                    >
                        Sign in to your account
                    </Link>
                </div>
            </main>

            {/* Feature cards */}
            <section className="w-full max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FeatureCard
                    icon="📊"
                    title="Visual summaries"
                    description="See your spending by category with clean, easy-to-read charts."
                />
                <FeatureCard
                    icon="🏦"
                    title="Multiple accounts"
                    description="Connect bank, credit, and cash accounts in one place."
                />
                <FeatureCard
                    icon="🎯"
                    title="Budget goals"
                    description="Set monthly limits and get notified before you overspend."
                />
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-fg text-sm">{title}</h3>
            <p className="text-muted-fg text-sm leading-relaxed">{description}</p>
        </div>
    );
}
