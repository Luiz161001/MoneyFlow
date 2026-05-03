import { StatCard } from "../reusable/StatCard";

export function StatBoard(){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Income" value={10} type="income" />
            <StatCard label="Total Expenses" value={9} type="expense" />
            <StatCard label="Balance" value={1} type="balance" />
        </div>
    );
}