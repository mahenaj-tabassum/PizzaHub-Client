import Link from "next/link";
import { FREE_ACTIVE_LIMIT } from "@/lib/item-utils";

export default function PlanNotice({
  plan,
  activeCount,
  note,
}: {
  plan: "free" | "premium";
  activeCount: number;
  note?: string;
}) {
  if (plan === "premium") return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/25 px-5 py-4">
      <p className="text-sm">
        Free plan: {activeCount} of {FREE_ACTIVE_LIMIT} active items used.
        {note ? ` ${note}` : ""}
      </p>
      <Link
        href="/dashboard/vendor/subscription"
        className="inline-flex h-10 items-center rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
}
