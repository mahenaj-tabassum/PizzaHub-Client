import { cn } from "@/lib/utils";
import type { MenuItemStatus } from "@/types";

const STYLES: Record<MenuItemStatus, string> = {
  pending: "bg-secondary/30 text-[#7a5200] dark:text-secondary",
  approved: "bg-accent/15 text-accent",
  rejected: "bg-destructive/10 text-destructive",
  inactive: "bg-muted text-muted-foreground",
};

export default function ItemStatusBadge({
  status,
  className,
}: {
  status: MenuItemStatus;
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
