import { Bolt } from "lucide-react";
import { Logout } from "../auth/Logout";
import { Link } from "react-router-dom";

export function UserMenu() {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
            <ul className="py-1">
                <li>
                    <Link to="/user">
                        <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-muted-fg hover:bg-surface-2 hover:text-brown transition-colors cursor-pointer">
                            <Bolt size={15} />
                            Config
                        </button>
                    </Link>
                </li>
                <li className="border-t border-border mx-3 my-1" />
                <li className="px-3 pb-2">
                    <Logout />
                </li>
            </ul>
        </div>
    );
}