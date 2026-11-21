"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { apiFetch } from "@/lib/api";

export default function CancelOrderDialog({
  orderId,
  onClose,
  onCancelled,
}: {
  orderId: string | null;
  onClose: () => void;
  onCancelled: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      await apiFetch(`/api/orders/${orderId}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled.");
      onCancelled(orderId);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not cancel the order.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!orderId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Cancel this order?"
      description="The restaurant will be notified and this cannot be undone."
      confirmLabel="Yes, cancel order"
      cancelLabel="Keep order"
      destructive
      loading={loading}
      onConfirm={handleConfirm}
    />
  );
}
