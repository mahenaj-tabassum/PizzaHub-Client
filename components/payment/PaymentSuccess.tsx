"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { unwrapData } from "@/lib/api-utils";
import { authClient } from "@/lib/auth-client";
import { cn, formatAmount } from "@/lib/utils";

type StatusData = {
  paymentStatus: string;
  subscriptionPlan: string;
  isPremiumActive: boolean;
  subscriptionExpiresAt?: string | null;
  // সার্ভারে যোগ করলে দেখাবে
  amount?: number;
  currency?: string;
};

type Phase = "checking" | "active" | "timeout" | "failed" | "error";

const POLL_MS = 2000;
const MAX_ATTEMPTS = 15;

const cardClass =
  "w-full max-w-lg rounded-3xl bg-card p-8 shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:p-10";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold">{children}</dd>
    </div>
  );
}

export default function PaymentSuccess({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const [data, setData] = useState<StatusData | null>(null);
  const [phase, setPhase] = useState<Phase>("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;

    setPhase("checking");

    const check = async () => {
      attempts += 1;

      try {
        const result = await apiFetch(
          `/api/payment/status?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (cancelled) return;

        const status = unwrapData<StatusData>(result);

        if (status) {
          setData(status);

          if (status.isPremiumActive) {
            setPhase("active");
            // navbar, sidebar ও session এর plan নতুন করে লোড
            authClient.$store.notify("$sessionSignal");
            router.refresh();
            return;
          }

          if (["failed", "expired"].includes(status.paymentStatus)) {
            setPhase("failed");
            return;
          }
        }

        if (attempts >= MAX_ATTEMPTS) {
          setPhase("timeout");
          return;
        }

        timer = setTimeout(check, POLL_MS);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not verify the payment.",
        );
        setPhase("error");
      }
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, runKey, router]);

  /* ---------- Error ---------- */
  if (phase === "error") {
    return (
      <div className={cn(cardClass, "text-center")}>
        <span className="mx-auto flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <X className="size-10" strokeWidth={2.5} />
        </span>
        <h1 className="mt-6 font-heading text-4xl font-bold">
          We could not verify this payment
        </h1>
        <p className="mt-3 text-muted-foreground">{errorMessage}</p>
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => setRunKey((k) => k + 1)}
            className="h-12 w-full cursor-pointer rounded-full bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
          >
            Try again
          </button>
          <Link
            href="/dashboard/vendor/subscription"
            className="flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
          >
            Go to Subscription
          </Link>
        </div>
      </div>
    );
  }

  const paid = data && ["paid", "completed"].includes(data.paymentStatus);
  const paymentFailed = phase === "failed";

  const title =
    phase === "active"
      ? "Premium is active!"
      : paymentFailed
        ? "Payment was not completed"
        : "Payment received";

  const text =
    phase === "active"
      ? "Thank you! Your Premium plan is now on. You can publish unlimited items."
      : paymentFailed
        ? "Stripe did not confirm this payment, so your plan has not changed."
        : "Thank you! We are confirming your payment with Stripe and turning on your Premium plan.";

  return (
    <div className={cn(cardClass, "text-center")}>
      <span
        className={cn(
          "mx-auto flex size-24 items-center justify-center rounded-full",
          paymentFailed
            ? "bg-destructive/10 text-destructive"
            : "bg-accent/15 text-accent",
        )}
      >
        {paymentFailed ? (
          <X className="size-10" strokeWidth={2.5} />
        ) : (
          <Check className="size-10" strokeWidth={2.5} />
        )}
      </span>

      <h1 className="mt-6 font-heading text-4xl font-bold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{text}</p>

      <dl className="mt-8 rounded-2xl border border-border px-5 text-left">
        <Row label="Plan">Premium</Row>

        {data?.amount != null && (
          <Row label="Amount">
            {formatAmount(data.amount, data.currency ?? "usd")}
          </Row>
        )}

        <Row label="Payment">
          {paymentFailed ? (
            <span className="text-destructive">Failed</span>
          ) : paid ? (
            <span className="text-accent">Received</span>
          ) : (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Checking
            </span>
          )}
        </Row>

        <Row label="Premium status">
          {phase === "active" ? (
            <span className="text-accent">Active</span>
          ) : paymentFailed ? (
            <span className="text-destructive">Not active</span>
          ) : phase === "timeout" ? (
            <span className="text-muted-foreground">Still processing</span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-brand" />
              Activating
            </span>
          )}
        </Row>
      </dl>

      {phase === "timeout" && (
        <p className="mt-4 text-sm text-muted-foreground">
          This is taking longer than usual. Premium turns on as soon as Stripe
          confirms your payment, so you will not be charged twice.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {phase === "timeout" && (
          <button
            type="button"
            onClick={() => setRunKey((k) => k + 1)}
            className="h-12 w-full cursor-pointer rounded-full border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            Check again
          </button>
        )}
        <Link
          href="/dashboard/vendor/subscription"
          className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
        >
          Go to Subscription
        </Link>
      </div>
    </div>
  );
}
