import { StatBoard } from "../components/reusable/StatBoard";
import { TransactionFilterBar } from "../components/transactions/TransactionFilterBar";
import { TransactionHeader } from "../components/transactions/TransactionHeader";

export function Transactions(){

    return (
        <div className="p-6 md:pl-0 md:mt-1"> 
            <TransactionHeader />
            <TransactionFilterBar />

            {/* main */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
                {/* left */}
                <div className="flex-1 flex flex-col gap-4">
                    <StatBoard/>

                    {/* Transactions history */}
                    <div className="bg-surface border border-border rounded-2xl p-6 flex-1">
                    a
                    </div>
                </div>

                {/* right */}
                <div className="w-[300px]">

                </div>
            </div>
        </div>
    )
}