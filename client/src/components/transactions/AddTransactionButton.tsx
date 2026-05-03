import { Plus } from "lucide-react"

export function AddTransactionButton() {
    return (
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brown text-gold transition-colors duration-200 hover:bg-surface-2 hover:text-brown cursor-pointer">
            <Plus />
            Add Transaction
        </button>
    );
}