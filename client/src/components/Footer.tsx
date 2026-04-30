export function Footer() {
    return (
        <footer className="border-t border-border bg-surface text-center text-xs text-muted py-5">
            © {new Date().getFullYear()} MoneyFlow. All rights reserved.
        </footer>
    );
}