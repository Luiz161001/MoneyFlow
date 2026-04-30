import { CircleUserRound } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

type Props = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};

export function UserButton({ isOpen, setIsOpen }: Props) {
    const user = useAuthStore((s) => s.user);

    return (
        <button
            className="flex gap-2 items-center px-3 py-2 rounded-lg text-muted-fg transition-colors duration-200 hover:bg-surface-2 hover:text-brown cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            {user?.name} <CircleUserRound size={20} />
        </button>
    );
}