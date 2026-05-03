import { StatBoard } from "../components/reusable/StatBoard";
import { PageHeading } from "../components/reusable/PageHeading";

export function Dashboard() {
    return (
        <div className="p-6 md:pl-0 md:mt-1">
            {/* <div>
                
            </div> */}
            <PageHeading title="Dashboard" subtitle="Here's your financial overview" classModifier="mb-6"/>
            <StatBoard />

            {/* move this whole component into /dashboard folder later */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <div className="flex-1 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Spending Overview</span>
                    <div className="flex-1 min-h-64 rounded-xl bg-background border border-border flex items-center justify-center">
                        <span className="text-muted text-sm">Chart coming soon</span>
                    </div>
                </div>

                <div className="w-full lg:w-80 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Last Transactions</span>
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-foreground">Transaction name</span>
                                    <span className="text-xs text-muted">Apr 29, 2026</span>
                                </div>
                                <span className="text-sm font-semibold text-red">-$0.00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
