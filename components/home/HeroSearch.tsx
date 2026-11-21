"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

export default function HeroSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (category) {
      params.set("category", category);
    }

    const queryString = params.toString();

    router.push(queryString ? `/menu?${queryString}` : "/menu");
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-3 rounded-2xl border bg-background p-3 shadow-lg sm:flex-row">
        <div className="flex flex-1 items-center gap-3 px-3">
          <Search className="size-5 shrink-0 text-muted-foreground" />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search your favorite pizza..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="size-4" />
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">Popular:</span>

        <Chip active={category === ""} onClick={() => setCategory("")}>
          All
        </Chip>

        {CATEGORIES.map((item) => (
          <Chip
            key={item.slug}
            active={category === item.slug}
            onClick={() => setCategory(item.slug)}
          >
            {item.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
