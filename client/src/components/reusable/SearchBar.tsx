import { Search } from "lucide-react";

interface SearchBarProps {
    name: string;
    placeHolder: string;
}

export function SearchBar({name, placeHolder}: SearchBarProps) {
    return (
        <div className="flex items-center bg-surface px-3 py-2 rounded-lg gap-2 border border-border">
            <Search />
            <input type="text" name={name} id={name} placeholder={placeHolder} />
        </div>
    );
}