"use client";

import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string; count: number };

export default function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
            value === o.value
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-card hover:border-brand/50",
          )}
        >
          {o.label} <span className="ml-1 opacity-70">{o.count}</span>
        </button>
      ))}
    </div>
  );
}
