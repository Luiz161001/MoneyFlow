import { Link } from "react-router-dom";
export function SideBarMenu(){
    return (
        <ul className="flex flex-col gap-1">
            <Link to="/dashboard"><li className="px-2 py-2 rounded-lg cursor-pointer text-muted-fg font-medium transition-colors duration-200 hover:bg-surface-2 hover:text-brown">Dashboard</li></Link>
            <Link to="/transactions"><li className="px-2 py-2 rounded-lg cursor-pointer text-muted-fg font-medium transition-colors duration-200 hover:bg-surface-2 hover:text-brown">Transactions</li></Link>
            <Link to="/budget"><li className="px-2 py-2 rounded-lg cursor-pointer text-muted-fg font-medium transition-colors duration-200 hover:bg-surface-2 hover:text-brown">Budget</li></Link>
        </ul>
    );
}