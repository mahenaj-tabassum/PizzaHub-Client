"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import CustomerCell from "@/components/dashboard/CustomerCell";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import FilterPills from "@/components/dashboard/FilterPills";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import TablePagination from "@/components/dashboard/TablePagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { apiFetch } from "@/lib/api";
import { countByStatus } from "@/lib/order-utils";
import { formatShortDate } from "@/lib/utils";
import type { OrderStatus, VendorOrder } from "@/types";

const PAGE_SIZE = 8;
type Filter = "all" | OrderStatus;
type Decision = { order: VendorOrder; action: "accepted" | "rejected" };

export default function VendorOrders() {
  const { orders, setOrders, loading, error, reload } = useVendorOrders();

  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const counts = useMemo(() => countByStatus(orders), [orders]);

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

  const handleDecision = async () => {
    if (!decision) return;
    const { order, action } = decision;

    try {
      setSubmitting(true);

      await apiFetch(`/api/vendor/orders/${order._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: action }),
      });

      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: action } : o)),
      );
      toast.success(`Order ${action}.`);
      setDecision(null);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the order.",
      );
      setDecision(null);
      reload(); // 409 হলে সর্বশেষ অবস্থা দেখানো
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<VendorOrder>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (o) => <CustomerCell info={o.customerInfo} />,
    },
    {
      key: "item",
      header: "Item",
      cell: (o) => (
        <span className="line-clamp-2 min-w-32 font-medium">
          {o.itemSnapshot?.itemName ?? "Menu item"}
        </span>
      ),
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
        <div className="min-w-52 max-w-72">
          <p>{o.deliveryAddress}</p>
          {o.message && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              Note: {o.message}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (o) => {
        if (o.status === "pending") {
          return (
            <div className="flex gap-2 whitespace-nowrap">
              <button
                type="button"
                onClick={() => setDecision({ order: o, action: "accepted" })}
                className="h-10 cursor-pointer rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setDecision({ order: o, action: "rejected" })}
                className="h-10 cursor-pointer rounded-full border border-brand px-5 text-sm font-semibold text-brand transition hover:bg-brand/10"
              >
                Reject
              </button>
            </div>
          );
        }

        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {o.status === "cancelled" ? "Cancelled by customer" : "Answered"}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <DashboardPageHeader
        title="Customer Orders"
        description="Accept or reject orders while they are Pending. Each order can be answered only once."
      />

      <div className="mb-6">
        <FilterPills<Filter>
          value={filter}
          onChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All", count: counts.total },
            { value: "pending", label: "Pending", count: counts.pending },
            { value: "accepted", label: "Accepted", count: counts.accepted },
            { value: "rejected", label: "Rejected", count: counts.rejected },
            { value: "cancelled", label: "Cancelled", count: counts.cancelled },
          ]}
        />
      </div>

      {error ? (
        <ErrorState
          title="Could not load customer orders"
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
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When customers order your items, they will show up here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title={`No ${filter} orders`} />
      ) : (
        <div className="rounded-2xl bg-card p-2 ring-1 ring-foreground/10 sm:p-4">
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(o) => o._id}
            minWidth="1060px"
          />
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            summary={`Showing ${rows.length} of ${filtered.length} orders`}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!decision}
        onOpenChange={(open) => !open && !submitting && setDecision(null)}
        title={
          decision?.action === "accepted"
            ? "Accept this order?"
            : "Reject this order?"
        }
        description={
          decision
            ? `${decision.order.customerInfo?.name ?? "The customer"} will see the result in their orders. You cannot change it later.`
            : ""
        }
        confirmLabel={
          decision?.action === "accepted" ? "Yes, accept" : "Yes, reject"
        }
        cancelLabel="Go back"
        destructive={decision?.action === "rejected"}
        loading={submitting}
        onConfirm={handleDecision}
      />
    </>
  );
}
