"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ManageSubscriptionButton({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      const result = (await apiFetch("/api/payment/portal", {
        method: "POST",
      })) as { data?: { portalUrl?: string } };

      const url = result?.data?.portalUrl;
      if (!url) throw new Error("Could not open the billing portal.");

      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open the billing portal.",
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
        "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/40 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {loading ? "Opening portal..." : "Manage subscription"}
    </button>
  );
}
