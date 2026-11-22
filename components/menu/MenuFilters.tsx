"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "", label: "Sort: Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const selectClass =
  "h-12 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20";

function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function CategoryChips({
  active,
  onSelect,
  className,
}: {
  active: string;
  onSelect: (slug: string) => void;
  className?: string;
}) {
  const chip = (isActive: boolean) =>
    cn(
      "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "border-brand bg-brand text-brand-foreground"
        : "border-border bg-card text-foreground hover:border-brand/50",
    );

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        type="button"
        aria-pressed={active === ""}
        onClick={() => onSelect("")}
        className={chip(active === "")}
      >
        All
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.slug}
          type="button"
          aria-pressed={active === c.slug}
          onClick={() => onSelect(c.slug)}
          className={chip(active === c.slug)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default function MenuFilters({ locations }: { locations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 400);

  const update = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      // শুধু স্পেস থাকলে সেটাকে খালি ধরা হয়, তাই URL এ কখনো q=%20 যাবে না
      const clean = value.trim();
      if (clean) params.set(key, clean);
      else params.delete(key);
    });

    // ফিল্টার বদলালে সবসময় প্রথম পেজে ফিরবে
    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  // Search এ debounce (trim করা মান দিয়ে তুলনা ও আপডেট)
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if ((searchParams.get("q") ?? "") !== trimmed) {
      update({ q: trimmed });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const activeCount = [category, location, sort].filter(Boolean).length;

  const locationSelect = (
    <Select
      label="Filter by location"
      value={location}
      onChange={(value) => update({ location: value })}
    >
      <option value="">All locations</option>
      {locations.map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </Select>
  );

  const sortSelect = (
    <Select
      label="Sort items"
      value={sort}
      onChange={(value) => update({ sort: value })}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );

  const searchBox = (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pizza by name"
        aria-label="Search menu"
        maxLength={100}
        className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </div>
  );

  return (
    <div aria-busy={isPending}>
      {/* Filter card */}
      <div className="rounded-2xl bg-card p-3 shadow-xl shadow-black/10 ring-1 ring-foreground/5 sm:p-4">
        {/* Desktop / tablet */}
        <div className="hidden gap-3 md:grid md:grid-cols-[1fr_260px_220px]">
          {searchBox}
          {locationSelect}
          {sortSelect}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {searchBox}

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              aria-label="Open filters"
              className="relative inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-input bg-card px-4 text-sm font-medium"
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-foreground">
                  {activeCount}
                </span>
              )}
            </SheetTrigger>

            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="max-h-[85vh] rounded-t-2xl"
            >
              <SheetHeader className="flex-row items-center justify-between border-b border-border p-4">
                <SheetTitle className="text-lg">Filters</SheetTitle>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="cursor-pointer rounded-full p-1.5 hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </SheetHeader>

              <div className="space-y-5 overflow-y-auto px-4 pb-2">
                <div>
                  <p className="mb-2 text-sm font-medium">Category</p>
                  <CategoryChips
                    active={category}
                    onSelect={(slug) => update({ category: slug })}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Location</p>
                  {locationSelect}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Sort by</p>
                  {sortSelect}
                </div>
              </div>

              <div className="flex gap-3 border-t border-border p-4">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    update({ q: "", category: "", location: "", sort: "" });
                    setDrawerOpen(false);
                  }}
                  className="h-11 flex-1 cursor-pointer rounded-full border border-border text-sm font-medium"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="h-11 flex-1 cursor-pointer rounded-full bg-brand text-sm font-semibold text-brand-foreground"
                >
                  Show results
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category chips: শুধু ডেস্কটপ/ট্যাবলেটে */}
      <CategoryChips
        active={category}
        onSelect={(slug) => update({ category: slug })}
        className="mt-5 hidden md:flex"
      />
    </div>
  );
}
