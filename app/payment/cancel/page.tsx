import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";

import UpgradeButton from "@/components/dashboard/UpgradeButton";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment cancelled" };

export default async function PaymentCancelPage() {
  await requireRole("vendor");

  return (
    <div className="w-full max-w-lg rounded-3xl bg-card p-8 text-center shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:p-10">
      <span className="mx-auto flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <X className="size-10" strokeWidth={2.5} />
      </span>

      <h1 className="mt-6 font-heading text-4xl font-bold">
        Payment cancelled
      </h1>
      <p className="mt-3 text-muted-foreground">
        No charge was made and your plan has not changed. You can upgrade to
        Premium whenever you are ready.
      </p>

      <div className="mt-8 space-y-3">
        <UpgradeButton className="h-14">Try again</UpgradeButton>
        <Link
          href="/dashboard/vendor"
          className="flex h-14 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
