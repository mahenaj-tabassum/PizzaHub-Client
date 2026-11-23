"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CheckCheck,
  ClipboardList,
  Clock,
  CreditCard,
  LayoutGrid,
  UtensilsCrossed,
} from "lucide-react";

import CustomerCell from "@/components/dashboard/CustomerCell";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import OrdersChart from "@/components/dashboard/OrdersChart";
import StatCard from "@/components/dashboard/StatCard";
import StatusDonut from "@/components/dashboard/StatusDonut";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useVendorItems } from "@/hooks/useVendorItems";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { useVendorStats } from "@/hooks/useVendorStats";
import { countActive, FREE_ACTIVE_LIMIT } from "@/lib/item-utils";
import { countByStatus, thisWeekByDay } from "@/lib/order-utils";
import { cn, formatShortDate } from "@/lib/utils";
import type { VendorOrder } from "@/types";

const recentColumns: Column<VendorOrder>[] = [
  {
    key: "customer",
    header: "Customer",
    cell: (o) => <CustomerCell info={o.customerInfo} />,
  },
  {
    key: "item",
    header: "Item",
    cell: (o) => o.itemSnapshot?.itemName ?? "Menu item",
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

export default function VendorOverview({
  displayName,
}: {
  displayName: string;
}) {
  const orders = useVendorOrders();
  const items = useVendorItems();
  const stats = useVendorStats();

  const loading = orders.loading || items.loading || stats.loading;
  const error = orders.error || items.error || stats.error;

  const reloadAll = () => {
    orders.reload();
    items.reload();
    stats.reload();
  };

  const counts = useMemo(() => countByStatus(orders.orders), [orders.orders]);
  const week = useMemo(() => thisWeekByDay(orders.orders), [orders.orders]);

  const heading = (
    <DashboardPageHeader
      title={`Welcome back, ${displayName}`}
      description="Here is how your restaurant is doing."
    />
  );

  if (error) {
    return (
      <>
        {heading}
        <ErrorState
          title="Could not load your dashboard"
          description={error}
          onRetry={reloadAll}
        />
      </>
    );
  }

  if (loading || !stats.stats) {
    return (
      <div role="status" aria-label="Loading dashboard">
        {heading}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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

  const s = stats.stats;
  const premium = s.subscriptionPlan === "premium";
  const slotsUsed = countActive(items.items);
  const progress = Math.min(100, (slotsUsed / FREE_ACTIVE_LIMIT) * 100);
  const pendingItems = items.items.filter((i) => i.status === "pending").length;

  return (
    <>
      {heading}

      {/* Row 1: Total items, Active items, Current plan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total menu items"
          value={s.totalItems}
          icon={UtensilsCrossed}
        />
        <StatCard
          label="Active menu items"
          value={s.activeItems}
          icon={LayoutGrid}
        />

        {/* Current plan */}
        <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:col-span-2 lg:col-span-1">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/25 text-brand">
            <CreditCard className="size-5" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 font-heading text-4xl font-bold capitalize">
            {s.subscriptionPlan}
          </p>

          {premium ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {s.subscriptionExpiresAt
                ? `Active until ${formatShortDate(s.subscriptionExpiresAt)}`
                : "Unlimited active items"}
            </p>
          ) : (
            <>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={FREE_ACTIVE_LIMIT}
                aria-valuenow={Math.min(slotsUsed, FREE_ACTIVE_LIMIT)}
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/40"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    slotsUsed >= FREE_ACTIVE_LIMIT
                      ? "bg-destructive"
                      : "bg-brand",
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {slotsUsed} of {FREE_ACTIVE_LIMIT} active items used
              </p>
              <Link
                href="/dashboard/vendor/subscription"
                className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
              >
                Upgrade to Premium
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Pending items, Pending orders, Accepted orders */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending menu items"
          value={pendingItems}
          icon={Clock}
        />
        <StatCard
          label="Pending orders"
          value={s.pendingOrders}
          icon={ClipboardList}
        />
        <StatCard
          label="Accepted orders"
          value={s.acceptedOrders}
          icon={CheckCheck}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="min-w-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">Orders this week</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            New customer orders per day
          </p>
          <OrdersChart data={week} />
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
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-bold">Recent orders</h2>
          <Link
            href="/dashboard/vendor/orders"
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all
          </Link>
        </div>

        {orders.orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When customers order your items, they will show up here."
          />
        ) : (
          <DataTable
            columns={recentColumns}
            rows={orders.orders.slice(0, 4)}
            getRowKey={(o) => o._id}
            minWidth="640px"
          />
        )}
      </section>
    </>
  );
}
