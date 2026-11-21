import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  retryHref?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

const actionClass = cn(
  buttonVariants(),
  "mt-6 h-10 cursor-pointer rounded-full bg-brand px-6 font-semibold text-brand-foreground hover:bg-brand/90",
);

export default function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  retryHref,
  retryLabel = "Try again",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-destructive/30 bg-card px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" />
      </span>
      <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {onRetry ? (
        <button type="button" onClick={onRetry} className={actionClass}>
          {retryLabel}
        </button>
      ) : retryHref ? (
        <Link href={retryHref} className={actionClass}>
          {retryLabel}
        </Link>
      ) : null}
    </div>
  );
}
