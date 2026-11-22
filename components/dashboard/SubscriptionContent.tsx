"use client";

import { Check, ShieldCheck } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ManageSubscriptionButton from "@/components/dashboard/ManageSubscriptionButton";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import ErrorState from "@/components/shared/ErrorState";
import { useVendorStats } from "@/hooks/useVendorStats";
import { PREMIUM_PLAN } from "@/lib/constants";
import { formatShortDate } from "@/lib/utils";

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium badge on your restaurant",
  "Featured placement on the homepage",
  "Everything in Free",
];

export default function SubscriptionContent() {
  const { stats, loading, error, reload } = useVendorStats();

  if (error) {
    return (
      <>
        <DashboardPageHeader title="Subscription" />
        <ErrorState
          title="Could not load your subscription"
          description={error}
          onRetry={reload}
        />
      </>
    );
  }

  if (loading || !stats) {
    return (
      <div role="status" aria-label="Loading subscription">
        <DashboardPageHeader title="Subscription" />
        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  const expires = stats.subscriptionExpiresAt;
  const expired = !!expires && new Date(expires) <= new Date();
  const isPremium = stats.subscriptionPlan === "premium" && !expired;
  const wasPremium = stats.subscriptionPlan === "premium" && expired;

  const description = isPremium
    ? expires
      ? `Your Premium plan is active until ${formatShortDate(expires)}.`
      : "Your Premium plan is active."
    : wasPremium
      ? "Your Premium plan has expired. Upgrade again to publish unlimited items."
      : "Your current plan is Free. Upgrade to publish unlimited items and get promoted on the homepage.";

  return (
    <>
      <DashboardPageHeader title="Subscription" description={description} />

      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free */}
        <section className="flex flex-col rounded-3xl bg-card p-8 ring-1 ring-foreground/10">
          <h2 className="font-heading text-3xl font-bold">Free</h2>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="font-heading text-5xl font-bold">$0</span>
            <span className="text-muted-foreground">
              / {PREMIUM_PLAN.interval}
            </span>
          </p>
          <p className="mt-6 text-muted-foreground">
            Everything you need to start selling.
          </p>

          <ul className="mt-6 space-y-4">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <Check className="size-5 shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled
            className="mt-auto h-12 w-full cursor-not-allowed rounded-full bg-secondary/30 text-sm font-semibold"
            style={{ marginTop: "2.5rem" }}
          >
            {isPremium ? "Free plan" : "Current plan"}
          </button>
        </section>

        {/* Premium */}
        <section className="flex flex-col rounded-3xl bg-primary p-8 text-white">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-heading text-3xl font-bold">Premium</h2>
            <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
              {isPremium ? "Your plan" : "Recommended"}
            </span>
          </div>

          <p className="mt-6 flex items-baseline gap-2">
            <span className="font-heading text-5xl font-bold">
              {PREMIUM_PLAN.price}
            </span>
            <span className="text-white/70">/ {PREMIUM_PLAN.interval}</span>
          </p>
          <p className="mt-6 text-white/80">
            Grow faster with more items and more visibility.
          </p>

          <ul className="mt-6 space-y-4">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <Check className="size-5 shrink-0 text-secondary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-3">
            {isPremium ? (
              <>
                <button
                  type="button"
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-full bg-secondary text-sm font-semibold text-secondary-foreground opacity-90"
                >
                  Current plan
                </button>
                <ManageSubscriptionButton />
              </>
            ) : (
              <UpgradeButton className="bg-secondary text-secondary-foreground hover:bg-secondary/90" />
            )}
          </div>
        </section>
      </div>

      <p className="mt-6 flex max-w-4xl items-start gap-3 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
        Secure checkout by Stripe. Premium turns on only after your payment is
        confirmed.
      </p>
    </>
  );
}
