"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CreditCard,
  UserRound,
  Users,
  UtensilsCrossed,
  Store,
} from "lucide-react";

import AdminItemActions from "@/components/dashboard/AdminItemActions";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import ItemViewDialog from "@/components/dashboard/ItemViewDialog";
import MenuItemCell from "@/components/dashboard/MenuItemCell";
import OrdersChart from "@/components/dashboard/OrdersChart";
import StatCard from "@/components/dashboard/StatCard";
import StatusDonut from "@/components/dashboard/StatusDonut";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useAdminList } from "@/hooks/useAdminList";
import { useAdminStats } from "@/hooks/useAdminStats";
import { formatPrice, formatShortDate } from "@/lib/utils";
import type { AdminItem } from "@/types";

const vendorName = (i: AdminItem) =>
  i.vendorInfo?.businessName || i.vendorInfo?.name || "—";

export default function AdminOverview() {
  const { stats, loading, error, reload } = useAdminStats();
  const pending = useAdminList<AdminItem>("/api/admin/items", {
    status: "pending",
    page: 1,
    limit: 5,
  });
  const [viewItem, setViewItem] = useState<AdminItem | null>(null);

  const heading = (
    <DashboardPageHeader
      title="Platform overview"
      description="A quick look at users, menu items, and subscription payments."
    />
  );

  if (error) {
    return (
      <>
        {heading}
        <ErrorState
          title="Could not load the overview"
          description={error}
          onRetry={reload}
        />
      </>
    );
  }

  if (loading || !stats) {
    return (
      <div role="status" aria-label="Loading overview">
        {heading}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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

  const columns: Column<AdminItem>[] = [
    { key: "item", header: "Item", cell: (i) => <MenuItemCell item={i} /> },
    { key: "vendor", header: "Restaurant", cell: vendorName },
    {
      key: "price",
      header: "Price",
      cell: (i) => formatPrice(i.price),
      className: "whitespace-nowrap",
    },
    {
      key: "submitted",
      header: "Submitted",
      cell: (i) => formatShortDate(i.createdAt),
      className: "whitespace-nowrap",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (i) => (
        <AdminItemActions
          item={i}
          reviewOnly
          onView={() => setViewItem(i)}
          onChanged={(id) => {
            pending.setItems((prev) => prev.filter((x) => x._id !== id));
            reload();
          }}
        />
      ),
    },
  ];

  return (
    <>
      {heading}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
        <StatCard
          label="Total vendors"
          value={stats.totalVendors}
          icon={Store}
        />
        <StatCard
          label="Total customers"
          value={stats.totalCustomers}
          icon={UserRound}
        />
        <StatCard
          label="Total menu items"
          value={stats.totalMenuItems}
          icon={UtensilsCrossed}
        />
        <StatCard
          label="Pending menu items"
          value={stats.pendingMenuItems}
          icon={Clock}
        />
        <StatCard
          label="Total transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="min-w-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">Revenue by month</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Completed Premium payments, USD
          </p>
          <OrdersChart
            name="Revenue"
            data={stats.revenueByMonth.map((m) => ({
              label: m.month,
              value: m.revenue,
            }))}
            format={(v) => `$${v}`}
          />
        </section>

        <section className="min-w-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">
            Menu items by status
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            All submitted items
          </p>
          <StatusDonut
            data={[
              {
                name: "Pending",
                value: stats.itemsByStatus.pending,
                color: "var(--chart-2)",
              },
              {
                name: "Approved",
                value: stats.itemsByStatus.approved,
                color: "var(--chart-3)",
              },
              {
                name: "Rejected",
                value: stats.itemsByStatus.rejected,
                color: "var(--chart-1)",
              },
              {
                name: "Inactive",
                value: stats.itemsByStatus.inactive,
                color: "var(--chart-5)",
              },
            ]}
          />
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-bold">Waiting for review</h2>
          <Link
            href="/dashboard/admin/items"
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Manage menu items
          </Link>
        </div>

        {pending.error ? (
          <ErrorState
            title="Could not load pending items"
            description={pending.error}
            onRetry={pending.reload}
          />
        ) : pending.loading && pending.items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : pending.items.length === 0 ? (
          <EmptyState
            title="All caught up"
            description="No menu items are waiting for review."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={pending.items}
            getRowKey={(i) => i._id}
            minWidth="820px"
          />
        )}
      </section>

      <ItemViewDialog
        item={viewItem}
        vendorName={viewItem ? vendorName(viewItem) : undefined}
        onClose={() => setViewItem(null)}
      />
    </>
  );
}
