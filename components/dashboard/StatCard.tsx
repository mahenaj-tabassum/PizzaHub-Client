import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/25 text-brand">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-4xl font-bold">{value}</p>
    </div>
  );
}
