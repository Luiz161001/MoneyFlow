import { ChevronDown, Calendar } from "lucide-react";
import { SearchBar } from "../reusable/SearchBar";
import { DropDown } from "../reusable/DropDown";

export function TransactionFilterBar() {
    let test = [1,2,3];
    return (
        <div className="flex items-center gap-3 shadow-l bg-surface rounded-xl px-3 py-2 border border-border">
            <SearchBar name="filter-search-bar" placeHolder="Search Transactions..." />

            <DropDown name="All Categories" items={test} />
            <DropDown name="All Types" items={test} />

            <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-border">
                Coming soon <Calendar />
            </div>
        </div>
    );
}