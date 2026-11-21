import Link from "next/link";
import { Pizza } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary/25 text-primary">
        <Pizza className="size-7" />
      </span>
      <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants(),
            "mt-6 h-10 rounded-full bg-brand px-6 font-semibold text-brand-foreground hover:bg-brand/90",
          )}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
