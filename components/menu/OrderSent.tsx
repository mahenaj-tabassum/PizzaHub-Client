"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { toast } from "react-toastify";

import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import OrderTimeline from "@/components/dashboard/OrderTimeline";
import OrderStepper from "@/components/menu/OrderStepper";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DetailRow from "@/components/shared/DetailRow";
import ErrorState from "@/components/shared/ErrorState";

import { apiFetch } from "@/lib/api";
import { cn, formatLongDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderSent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch(`/api/orders/${orderId}`)
      .then((result) => {
        if (active) setOrder(result.data);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;

    try {
      setCancelling(true);

      await apiFetch(`/api/orders/${order._id}/cancel`, {
        method: "PATCH",
      });

      setOrder({ ...order, status: "cancelled" });
      setConfirmOpen(false);

      toast.success("Order cancelled.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not cancel the order.",
      );
    } finally {
      setCancelling(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading order"
        className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8"
      >
        <div className="mx-auto h-9 w-48 animate-pulse rounded bg-muted sm:w-72" />

        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-80 animate-pulse rounded-3xl bg-muted sm:h-96" />
          <div className="h-64 animate-pulse rounded-3xl bg-muted sm:h-72" />
        </div>
      </div>
    );
  }

  // Error state
  if (failed || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <ErrorState
          title="Order not found"
          description="We could not load this order. You can check all your orders from the dashboard."
          retryHref="/dashboard/customer/orders"
        />
      </div>
    );
  }

  const { itemSnapshot, vendorSnapshot } = order;

  const vendorName =
    vendorSnapshot.businessName || vendorSnapshot.name || "the restaurant";

  const image = itemSnapshot.images[0];
  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Menu", href: "/menu" },
          {
            label: itemSnapshot.itemName,
            href: `/menu/${order.itemId}`,
          },
          { label: "Order sent" },
        ]}
      />

      {/* Order Stepper */}
      <div className="mt-5 flex justify-center overflow-hidden sm:mt-6">
        <OrderStepper current={4} />
      </div>

      {/* Order Confirmation */}
      <div className="mx-auto mt-8 max-w-2xl text-center sm:mt-10">
        <span
          className={cn(
            "mx-auto flex size-16 items-center justify-center rounded-full sm:size-20 md:size-24",
            cancelled
              ? "bg-muted text-muted-foreground"
              : "bg-accent/15 text-accent",
          )}
        >
          <Check className="size-7 sm:size-9 md:size-10" strokeWidth={2.5} />
        </span>

        <h1 className="mt-5 font-heading text-2xl font-bold leading-tight sm:mt-6 sm:text-3xl md:text-5xl">
          {cancelled ? "Order cancelled" : "Your order is sent!"}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {cancelled
            ? "This order has been cancelled. You can place a new order any time."
            : `${vendorName} will review it shortly. We will show the update in My Orders.`}
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid min-w-0 grid-cols-1 items-start gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Order Details */}
        <section className="min-w-0 rounded-2xl bg-card p-4 shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:rounded-3xl sm:p-6">
          {/* Section Heading */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-bold sm:text-2xl">
              Order details
            </h2>

            <OrderStatusBadge status={order.status} />
          </div>

          {/* Ordered Item */}
          <div className="mt-5 flex min-w-0 flex-col gap-3 rounded-2xl bg-secondary/10 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            {/* Item Image */}
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              {image && (
                <Image
                  src={image}
                  alt={itemSnapshot.itemName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>

            {/* Item Information */}
            <div className="min-w-0 flex-1">
              <p className="break-words font-heading text-base font-bold sm:text-lg">
                {itemSnapshot.itemName}
              </p>

              <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">
                {vendorName} · {itemSnapshot.location}
              </p>
            </div>

            {/* Item Price */}
            <p className="shrink-0 font-heading text-lg font-bold text-brand sm:text-xl">
              {formatPrice(itemSnapshot.price)}
            </p>
          </div>

          {/* Order Information */}
          <dl className="mt-3 min-w-0">
            <DetailRow
              label="Order ID"
              value={`#${order._id.slice(-6).toUpperCase()}`}
            />

            <DetailRow
              label="Delivery date"
              value={formatLongDate(order.deliveryDate)}
            />

            <DetailRow label="Delivery address" value={order.deliveryAddress} />

            {order.message && (
              <DetailRow label="Message" value={order.message} />
            )}

            <DetailRow
              label="Requested on"
              value={formatLongDate(order.createdAt)}
            />
          </dl>
        </section>

        {/* What Happens Next */}
        <section className="min-w-0 rounded-2xl bg-card p-4 shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:rounded-3xl sm:p-6">
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            What happens next
          </h2>

          {/* Order Timeline */}
          <div className="mt-5 sm:mt-6">
            <OrderTimeline status={order.status} />
          </div>

          {/* Cancel Order */}
          {order.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="mt-7 h-11 w-full cursor-pointer rounded-full border border-brand px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 sm:mt-8 sm:h-12"
              >
                Cancel order
              </button>

              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
                You can cancel while your order is Pending.
              </p>
            </>
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
        <Link
          href="/dashboard/customer/orders"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90 sm:w-auto"
        >
          View my orders
        </Link>

        <Link
          href="/menu"
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
        >
          Browse more pizza
        </Link>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this order?"
        description="The restaurant will be notified and this cannot be undone."
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
