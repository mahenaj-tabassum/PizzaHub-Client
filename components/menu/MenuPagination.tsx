import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Pagination } from "@/types";

type Props = {
  pagination: Pagination;
  searchParams: Record<string, string | undefined>;
};

function getPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");

  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function MenuPagination({ pagination, searchParams }: Props) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const href = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/menu?${qs}` : "/menu";
  };

  const base =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors";
  const idle = "border-border bg-card hover:border-brand/50";
  const disabled = "pointer-events-none border-border bg-card opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={href(currentPage - 1)}
        aria-disabled={!hasPrevPage}
        tabIndex={hasPrevPage ? undefined : -1}
        className={cn(base, hasPrevPage ? idle : disabled)}
      >
        Prev
      </Link>

      {getPages(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              base,
              p === currentPage
                ? "border-brand bg-brand text-brand-foreground"
                : idle,
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={href(currentPage + 1)}
        aria-disabled={!hasNextPage}
        tabIndex={hasNextPage ? undefined : -1}
        className={cn(base, hasNextPage ? idle : disabled)}
      >
        Next
      </Link>
    </nav>
  );
}
