"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** "icon" = round button for the navbar, "row" = labeled row for the mobile sheet */
  variant?: "icon" | "row";
  className?: string;
};

export default function ThemeToggle({ variant = "icon", className }: Props) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle theme"
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-lg border border-border px-4 py-3 text-base font-medium transition-colors hover:bg-muted",
          className,
        )}
      >
        <span className="dark:hidden">Dark mode</span>
        <span className="hidden dark:inline">Light mode</span>
        <Moon className="size-5 dark:hidden" />
        <Sun className="hidden size-5 dark:block" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/60 text-white transition-all duration-200 hover:border-[#F8EFE4] hover:bg-[#F8EFE4] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:scale-95",
        className,
      )}
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </button>
  );
}
