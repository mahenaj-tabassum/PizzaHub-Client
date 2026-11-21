"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import OrderStepper from "@/components/menu/OrderStepper";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ErrorState from "@/components/shared/ErrorState";
import { apiFetch } from "@/lib/api";
import { cn, formatLongDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

function Timeline({ status }: { status: OrderStatus }) {
  const pending = status === "pending";
  const cancelled = status === "cancelled";

  const steps = [
    {
      title: "Order sent",
      text: "Your order reached the restaurant.",
      state: "done",
    },
    {
      title: "Restaurant review",
      text: pending
        ? "Waiting for the restaurant to accept or reject. Status: Pending."
        : cancelled
          ? "This order was cancelled before review."
          : "The restaurant has reviewed your order.",
      state: pending ? "active" : "done",
    },
    {
      title: cancelled ? "Order cancelled" : "Accepted or rejected",
      text: pending
        ? "The result will appear in My Orders."
        : cancelled
          ? "You cancelled this order."
          : `Your order was ${status}.`,
      state: pending ? "todo" : "done",
    },
  ] as const;

  return (
    <ol>
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-4 top-8 h-[calc(100%-1.5rem)] w-px bg-secondary"
            />
          )}
          <span
            className={cn(
              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
              step.state === "done" && "bg-accent text-accent-foreground",
              step.state === "active" &&
                "bg-secondary ring-4 ring-secondary/30",
              step.state === "todo" && "bg-secondary/30",
            )}
          >
            {step.state === "done" && <Check className="size-4" />}
            {step.state === "active" && (
              <span className="size-2 rounded-full bg-foreground" />
            )}
          </span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3.5 last:border-0 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium sm:max-w-[60%] sm:text-right">
        {value}
      </dd>
    </div>
  );
}

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
      await apiFetch(`/api/orders/${order._id}/cancel`, { method: "PATCH" });

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

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading order"
        className="mx-auto max-w-5xl px-4 pb-20 pt-32"
      >
        <div className="mx-auto h-9 w-72 animate-pulse rounded bg-muted" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          <div className="h-72 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  if (failed || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-32">
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
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Menu", href: "/menu" },
          { label: itemSnapshot.itemName, href: `/menu/${order.itemId}` },
          { label: "Order sent" },
        ]}
      />

      <div className="mt-6 flex justify-center">
        <OrderStepper current={4} />
      </div>

      <div className="mt-8 text-center">
        <span
          className={cn(
            "mx-auto flex size-24 items-center justify-center rounded-full",
            cancelled
              ? "bg-muted text-muted-foreground"
              : "bg-accent/15 text-accent",
          )}
        >
          <Check className="size-10" strokeWidth={2.5} />
        </span>

        <h1 className="mt-6 font-heading text-4xl font-bold md:text-5xl">
          {cancelled ? "Order cancelled" : "Your order is sent!"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {cancelled
            ? "This order has been cancelled. You can place a new order any time."
            : `${vendorName} will review it shortly. We will show the update in My Orders.`}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Order details */}
        <section className="rounded-3xl bg-card p-6 shadow-xl shadow-black/5 ring-1 ring-foreground/10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Order details</h2>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-secondary/10 p-4">
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
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-lg font-bold">
                {itemSnapshot.itemName}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {vendorName} · {itemSnapshot.location}
              </p>
            </div>
            <p className="font-heading text-xl font-bold text-brand">
              {formatPrice(itemSnapshot.price)}
            </p>
          </div>

          <dl className="mt-3">
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

        {/* What happens next */}
        <section className="rounded-3xl bg-card p-6 shadow-xl shadow-black/5 ring-1 ring-foreground/10">
          <h2 className="font-heading text-2xl font-bold">What happens next</h2>

          <div className="mt-6">
            <Timeline status={order.status} />
          </div>

          {order.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="mt-8 h-12 w-full cursor-pointer rounded-full border border-brand text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                Cancel order
              </button>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                You can cancel while your order is Pending.
              </p>
            </>
          )}
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/customer/orders"
          className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
        >
          View my orders
        </Link>
        <Link
          href="/menu"
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-7 text-sm font-medium transition-colors hover:bg-muted"
        >
          Browse more pizza
        </Link>
      </div>

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
