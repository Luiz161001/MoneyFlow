interface StatCardProps {
  label: string;
  value: string | number;
  type: 'income' | 'expense' | 'balance';
}

export function StatCard({ label, value, type }: StatCardProps) {
  const colorMap = {
    income: 'text-green',
    expense: 'text-red',
    balance: 'text-brown',
  };

  return (
    <div className="flex flex-col gap-1 bg-surface border border-border rounded-2xl p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className={`text-2xl font-semibold ${colorMap[type]}`}>${value}</span>
    </div>
  );
}