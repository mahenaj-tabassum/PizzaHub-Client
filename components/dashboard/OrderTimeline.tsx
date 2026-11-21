import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const pending = status === "pending";
  const cancelled = status === "cancelled";

  const steps = [
    {
      title: "Order sent",
      text: "Your order reached the restaurant.",
      state: "done",
    },
    {
      title: "Restaurant review",
      text: pending
        ? "Waiting for the restaurant to accept or reject. Status: Pending."
        : cancelled
          ? "This order was cancelled before review."
          : "The restaurant has reviewed your order.",
      state: pending ? "active" : "done",
    },
    {
      title: cancelled ? "Order cancelled" : "Accepted or rejected",
      text: pending
        ? "The result will appear in My Orders."
        : cancelled
          ? "You cancelled this order."
          : `Your order was ${status}.`,
      state: pending ? "todo" : "done",
    },
  ] as const;

  return (
    <ol>
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-4 top-8 h-[calc(100%-1.5rem)] w-px bg-secondary"
            />
          )}
          <span
            className={cn(
              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
              step.state === "done" && "bg-accent text-accent-foreground",
              step.state === "active" &&
                "bg-secondary ring-4 ring-secondary/30",
              step.state === "todo" && "bg-secondary/30",
            )}
          >
            {step.state === "done" && <Check className="size-4" />}
            {step.state === "active" && (
              <span className="size-2 rounded-full bg-foreground" />
            )}
          </span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
