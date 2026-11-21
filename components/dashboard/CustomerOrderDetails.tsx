"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CancelOrderDialog from "@/components/dashboard/CancelOrderDialog";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import OrderTimeline from "@/components/dashboard/OrderTimeline";
import DetailRow from "@/components/shared/DetailRow";
import ErrorState from "@/components/shared/ErrorState";
import { apiFetch } from "@/lib/api";
import {
  formatLongDate,
  formatPrice,
  getSnapshotVendorName,
} from "@/lib/utils";
import type { Order } from "@/types";

export default function CustomerOrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch(`/api/orders/${orderId}`)
      .then((result) => active && setOrder(result.data))
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [orderId]);

  const back = (
    <Link
      href="/dashboard/customer/orders"
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
    >
      <ArrowLeft className="size-4" />
      Back to My Orders
    </Link>
  );

  if (loading) {
    return (
      <div role="status" aria-label="Loading order">
        {back}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (failed || !order) {
    return (
      <>
        {back}
        <ErrorState
          title="Order not found"
          description="This order does not exist, or it does not belong to your account."
          retryHref="/dashboard/customer/orders"
          retryLabel="Back to My Orders"
        />
      </>
    );
  }

  const { itemSnapshot, vendorSnapshot } = order;
  const image = itemSnapshot.images?.[0];

  return (
    <>
      {back}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold">Order details</h1>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-secondary/10 p-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              {image && (
                <Image
                  src={image}
                  alt=""
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
                {getSnapshotVendorName(vendorSnapshot)} ·{" "}
                {itemSnapshot.location}
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

        <section className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-2xl font-bold">Order status</h2>
          <div className="mt-6">
            <OrderTimeline status={order.status} />
          </div>

          {order.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => setCancelId(order._id)}
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

      <CancelOrderDialog
        orderId={cancelId}
        onClose={() => setCancelId(null)}
        onCancelled={() => setOrder({ ...order, status: "cancelled" })}
      />
    </>
  );
}
