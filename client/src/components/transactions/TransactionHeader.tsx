import { PageHeading } from "../reusable/PageHeading"
import { AddTransactionButton } from "../transactions/AddTransactionButton"

export function TransactionHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <PageHeading title="Transactions" subtitle="Track and manage your income and expenses" classModifier="" />
            <AddTransactionButton />
        </div>
    );
}