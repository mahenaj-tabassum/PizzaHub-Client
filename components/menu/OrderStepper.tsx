import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Choose item", "Delivery details", "Order sent"];

/** current: 1, 2 বা 3। 4 দিলে তিনটাই সম্পূর্ণ দেখায় */
export default function OrderStepper({ current }: { current: number }) {
  return (
    <ol
      aria-label="Order progress"
      className="flex flex-wrap items-center gap-x-3 gap-y-2"
    >
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;

        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-semibold",
                done && "bg-accent text-accent-foreground",
                active && "bg-brand text-brand-foreground",
                !done && !active && "bg-secondary/30 text-foreground",
              )}
            >
              {done ? <Check className="size-4" /> : n}
            </span>
            <span
              className={cn(
                "text-sm",
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
                !active && "hidden sm:inline",
              )}
            >
              {label}
            </span>
            {n < STEPS.length && (
              <span
                aria-hidden="true"
                className="h-px w-6 bg-secondary sm:w-12"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
