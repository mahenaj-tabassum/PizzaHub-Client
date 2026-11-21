"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ClipboardList, Clock, X } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import OrderItemCell from "@/components/dashboard/OrderItemCell";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import OrdersChart from "@/components/dashboard/OrdersChart";
import StatCard from "@/components/dashboard/StatCard";
import StatusDonut from "@/components/dashboard/StatusDonut";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useMyOrders } from "@/hooks/useMyOrders";
import {
  countByStatus,
  findNextDelivery,
  lastSixMonths,
} from "@/lib/order-utils";
import { formatShortDate, getSnapshotVendorName } from "@/lib/utils";
import type { Order } from "@/types";

const recentColumns: Column<Order>[] = [
  { key: "item", header: "Item", cell: (o) => <OrderItemCell order={o} /> },
  {
    key: "restaurant",
    header: "Restaurant",
    cell: (o) => getSnapshotVendorName(o.vendorSnapshot),
  },
  {
    key: "date",
    header: "Delivery date",
    cell: (o) => formatShortDate(o.deliveryDate),
    className: "whitespace-nowrap",
  },
  {
    key: "status",
    header: "Status",
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
];

export default function CustomerOverview({ firstName }: { firstName: string }) {
  const { orders, loading, error, reload } = useMyOrders();

  const counts = useMemo(() => countByStatus(orders), [orders]);
  const months = useMemo(() => lastSixMonths(orders), [orders]);
  const next = useMemo(() => findNextDelivery(orders), [orders]);

  const heading = (
    <DashboardPageHeader
      title={`Welcome back, ${firstName}`}
      description="Track your pizza orders and find your next favorite."
    />
  );

  if (error) {
    return (
      <>
        {heading}
        <ErrorState
          title="Could not load your dashboard"
          description={error}
          onRetry={reload}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div role="status" aria-label="Loading dashboard">
        {heading}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-80 animate-pulse rounded-2xl bg-muted" />
          <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const nextImage = next?.itemSnapshot.images?.[0];

  return (
    <>
      {heading}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={counts.total}
          icon={ClipboardList}
        />
        <StatCard label="Pending orders" value={counts.pending} icon={Clock} />
        <StatCard
          label="Accepted orders"
          value={counts.accepted}
          icon={Check}
        />
        <StatCard label="Rejected orders" value={counts.rejected} icon={X} />
      </div>

      {next && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-primary p-5 text-white sm:flex-nowrap">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
            {nextImage && (
              <Image
                src={nextImage}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-secondary">Your next delivery</p>
            <p className="truncate font-heading text-2xl font-bold">
              {next.itemSnapshot.itemName}
            </p>
            <p className="truncate text-sm text-white/80">
              {getSnapshotVendorName(next.vendorSnapshot)} ·{" "}
              {formatShortDate(next.deliveryDate)} · Accepted
            </p>
          </div>
          <Link
            href={`/dashboard/customer/orders/${next._id}`}
            className="inline-flex h-11 items-center rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
          >
            View order
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="min-w-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">Orders per month</h2>
          <p className="mb-4 text-sm text-muted-foreground">Last 6 months</p>
          <OrdersChart data={months} />
        </section>

        <section className="min-w-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">Orders by status</h2>
          <p className="mb-6 text-sm text-muted-foreground">All time</p>
          <StatusDonut
            data={[
              {
                name: "Pending",
                value: counts.pending,
                color: "var(--chart-2)",
              },
              {
                name: "Accepted",
                value: counts.accepted,
                color: "var(--chart-3)",
              },
              {
                name: "Rejected",
                value: counts.rejected,
                color: "var(--chart-1)",
              },
              {
                name: "Cancelled",
                value: counts.cancelled,
                color: "var(--chart-5)",
              },
            ]}
          />
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Recent orders</h2>
          <Link
            href="/dashboard/customer/orders"
            className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Find a pizza you love and place your first order."
            actionLabel="Browse menu"
            actionHref="/menu"
          />
        ) : (
          <DataTable
            columns={recentColumns}
            rows={orders.slice(0, 4)}
            getRowKey={(o) => o._id}
            minWidth="620px"
          />
        )}
      </section>
    </>
  );
}
