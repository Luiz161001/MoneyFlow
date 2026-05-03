import { ChevronDown } from "lucide-react";

interface DropDownProps {
    name: string;
    items: any[];
}

export function DropDown({ name, items }: DropDownProps) {
    return (
        <div className="relative border border-border rounded-lg">
            {/* dropdown titlee */}
            <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-surface-2 hover:text-brown cursor-pointer">
                <p>{name}</p>
                <ChevronDown />
            </div>

            {/* we are amking it, menu itemss */}
            {/* <div className="absolute z-10 mt-1 w-56 origin-top-right rounded-lg bg-surface shadow-lg border border-border">
                <div className="mt-3">
                    {items.map(val => {
                        return <div className="transition-colors duration-200 hover:bg-surface-2 hover:text-brown cursor-pointer p-2 text-center ">{val}</div>;
                    })}
                </div>
            </div> */}
        </div>
    );
}