import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-secondary/30 text-[#7a5200] dark:text-secondary",
  accepted: "bg-accent/15 text-accent",
  rejected: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

export default function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-3 text-xs font-medium capitalize",
        STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
