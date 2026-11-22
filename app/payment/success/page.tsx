import type { Metadata } from "next";

import PaymentSuccess from "@/components/payment/PaymentSuccess";
import ErrorState from "@/components/shared/ErrorState";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment received" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await requireRole("vendor");

  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="w-full max-w-lg">
        <ErrorState
          title="Payment session not found"
          description="This page needs a valid payment session. Please start from the Subscription page."
          retryHref="/dashboard/vendor/subscription"
          retryLabel="Go to Subscription"
        />
      </div>
    );
  }

  return <PaymentSuccess sessionId={session_id} />;
}
