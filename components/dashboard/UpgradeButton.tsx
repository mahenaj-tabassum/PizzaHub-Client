"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function UpgradeButton({
  className,
  children = "Upgrade to Premium",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      const result = (await apiFetch("/api/payment/checkout", {
        method: "POST",
      })) as { data?: { checkoutUrl?: string } };

      const url = result?.data?.checkoutUrl;
      if (!url) throw new Error("Could not start checkout. Please try again.");

      // Stripe এ redirect হচ্ছে, তাই loading চালু থাকবে
      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {loading ? "Redirecting to Stripe..." : children}
    </button>
  );
}
