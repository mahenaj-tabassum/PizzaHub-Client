"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/menu?${qs}` : "/menu");
  };

  return (
    <div className="w-full max-w-[600px]">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lg shadow-black/20"
      >
        <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pizza, e.g. Margherita"
          aria-label="Search pizza"
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="h-10 shrink-0 cursor-pointer rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Search
        </button>
      </form>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={category === ""} onClick={() => setCategory("")}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.slug}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
          >
            {c.short}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-secondary bg-secondary text-secondary-foreground"
          : "border-white/40 text-white hover:border-white hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}
