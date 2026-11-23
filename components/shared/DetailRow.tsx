export default function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border py-3.5 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>

      <dd className="min-w-0 break-words text-sm font-medium sm:max-w-[60%] sm:text-right">
        {value}
      </dd>
    </div>
  );
}
