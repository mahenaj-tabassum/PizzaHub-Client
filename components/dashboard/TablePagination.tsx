"use client";

import { cn } from "@/lib/utils";

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
  summary,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  summary: string;
}) {
  const nav =
    "h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
      <p className="text-sm text-muted-foreground">{summary}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={nav}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "size-10 cursor-pointer rounded-full text-sm font-medium",
              p === page
                ? "bg-brand text-brand-foreground"
                : "border border-border hover:bg-muted",
            )}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={nav}
        >
          Next
        </button>
      </div>
    </div>
  );
}
