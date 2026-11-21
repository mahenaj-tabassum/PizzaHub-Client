"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import CancelOrderDialog from "@/components/dashboard/CancelOrderDialog";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import OrderItemCell from "@/components/dashboard/OrderItemCell";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useMyOrders } from "@/hooks/useMyOrders";
import { countByStatus } from "@/lib/order-utils";
import { cn, formatShortDate, getSnapshotVendorName } from "@/lib/utils";
import type { Order } from "@/types";

const PAGE_SIZE = 8;
const FILTERS = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
] as const;
type Filter = (typeof FILTERS)[number];

export default function MyOrders() {
  const { orders, setOrders, loading, error, reload } = useMyOrders();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = countByStatus(orders);
    return { all: c.total, ...c };
  }, [orders]);

  const filtered = useMemo(
    () =>
      filter === "all" ? orders : orders.filter((o) => o.status === filter),
    [orders, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const columns: Column<Order>[] = [
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
      key: "address",
      header: "Delivery address",
      cell: (o) => (
        <span className="line-clamp-2 min-w-40">{o.deliveryAddress}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "requested",
      header: "Requested",
      cell: (o) => formatShortDate(o.createdAt),
      className: "whitespace-nowrap",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (o) => (
        <div className="flex items-center gap-4 whitespace-nowrap">
          <Link
            href={`/dashboard/customer/orders/${o._id}`}
            className="font-medium text-brand hover:underline"
          >
            View
          </Link>
          {o.status === "pending" && (
            <button
              type="button"
              onClick={() => setCancelId(o._id)}
              className="cursor-pointer font-medium text-destructive hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardPageHeader
        title="My Orders"
        description="See every order you placed. You can cancel an order while it is Pending."
      />

      {/* Status filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={cn(
              "cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-card hover:border-brand/50",
            )}
          >
            {f} <span className="ml-1 opacity-70">{counts[f]}</span>
          </button>
        ))}
      </div>

      {error ? (
        <ErrorState
          title="Could not load your orders"
          description={error}
          onRetry={reload}
        />
      ) : loading ? (
        <div
          role="status"
          aria-label="Loading orders"
          className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will show up here."
          actionLabel="Browse menu"
          actionHref="/menu"
        />
      ) : filtered.length === 0 ? (
        <EmptyState title={`No ${filter} orders`} />
      ) : (
        <div className="rounded-2xl bg-card p-2 ring-1 ring-foreground/10 sm:p-4">
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(o) => o._id}
            minWidth="980px"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
            <p className="text-sm text-muted-foreground">
              Showing {rows.length} of {filtered.length} orders
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={cn(
                    "size-10 cursor-pointer rounded-full text-sm font-medium",
                    p === currentPage
                      ? "bg-brand text-brand-foreground"
                      : "border border-border hover:bg-muted",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <CancelOrderDialog
        orderId={cancelId}
        onClose={() => setCancelId(null)}
        onCancelled={(id) =>
          setOrders((prev) =>
            prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o)),
          )
        }
      />
    </>
  );
}
