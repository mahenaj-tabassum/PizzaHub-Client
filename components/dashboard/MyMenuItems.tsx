"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import FilterPills from "@/components/dashboard/FilterPills";
import ItemStatusBadge from "@/components/dashboard/ItemStatusBadge";
import ItemViewDialog from "@/components/dashboard/ItemViewDialog";
import MenuItemCell from "@/components/dashboard/MenuItemCell";
import PlanNotice from "@/components/dashboard/PlanNotice";
import TablePagination from "@/components/dashboard/TablePagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useVendorItems } from "@/hooks/useVendorItems";
import { apiFetch } from "@/lib/api";
import { countActive } from "@/lib/item-utils";
import { cn, formatPrice, formatShortDate } from "@/lib/utils";
import type { MenuItem } from "@/types";

const PAGE_SIZE = 8;
type Filter = "all" | "approved" | "pending" | "rejected";

function AvailabilityCell({
  item,
  busy,
  onToggle,
}: {
  item: MenuItem;
  busy: boolean;
  onToggle: () => void;
}) {
  if (item.status === "pending")
    return (
      <span className="text-sm text-muted-foreground">After approval</span>
    );
  if (item.status === "rejected")
    return <span className="text-sm text-muted-foreground">Not available</span>;
  if (item.status === "inactive")
    return <span className="text-sm text-muted-foreground">Inactive</span>;

  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <button
        type="button"
        role="switch"
        aria-checked={item.isAvailable}
        aria-label={`Toggle availability of ${item.itemName}`}
        disabled={busy}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-wait disabled:opacity-60",
          item.isAvailable ? "bg-accent" : "bg-secondary/60",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            item.isAvailable ? "left-5.5" : "left-0.5",
          )}
        />
      </button>
      <span className="text-sm">
        {item.isAvailable ? "Available" : "Hidden"}
      </span>
    </div>
  );
}

export default function MyMenuItems({ plan }: { plan: "free" | "premium" }) {
  const { items, setItems, loading, error, reload } = useVendorItems();

  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: items.length,
      approved: items.filter((i) => i.status === "approved").length,
      pending: items.filter((i) => i.status === "pending").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    }),
    [items],
  );

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const patchItem = (id: string, changes: Partial<MenuItem>) =>
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, ...changes } : i)),
    );

  const handleToggle = async (item: MenuItem) => {
    const next = !item.isAvailable;

    setBusyId(item._id);
    patchItem(item._id, { isAvailable: next }); // optimistic

    try {
      await apiFetch(`/api/vendor/items/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: next }),
      });
      toast.success(
        next ? "Item is now available." : "Item is hidden from customers.",
      );
    } catch (e) {
      patchItem(item._id, { isAvailable: !next }); // revert
      toast.error(
        e instanceof Error ? e.message : "Could not update availability.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/vendor/items/${deleteItem._id}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((i) => i._id !== deleteItem._id));
      toast.success("Menu item deleted.");
      setDeleteItem(null);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not delete the item.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<MenuItem>[] = [
    { key: "item", header: "Item", cell: (i) => <MenuItemCell item={i} /> },
    {
      key: "price",
      header: "Price",
      cell: (i) => formatPrice(i.price),
      className: "whitespace-nowrap",
    },
    {
      key: "location",
      header: "Location",
      cell: (i) => <span className="line-clamp-2 min-w-32">{i.location}</span>,
    },
    {
      key: "approval",
      header: "Approval",
      cell: (i) => <ItemStatusBadge status={i.status} />,
    },
    {
      key: "availability",
      header: "Availability",
      cell: (i) => (
        <AvailabilityCell
          item={i}
          busy={busyId === i._id}
          onToggle={() => handleToggle(i)}
        />
      ),
    },
    {
      key: "added",
      header: "Added",
      cell: (i) => formatShortDate(i.createdAt),
      className: "whitespace-nowrap",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (i) => (
        <div className="flex items-center gap-4 whitespace-nowrap text-sm font-medium">
          <button
            type="button"
            onClick={() => setViewItem(i)}
            className="cursor-pointer text-brand hover:underline"
          >
            View
          </button>
          <Link
            href={`/dashboard/vendor/items/${i._id}/edit`}
            className="text-brand hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteItem(i)}
            className="cursor-pointer text-destructive hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardPageHeader
        title="My Menu Items"
        description="Manage your pizzas, sides, and drinks. Customers only see items that are Approved and Available."
      />

      <Link
        href="/dashboard/vendor/add-item"
        className="mb-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
      >
        <Plus className="size-4" />
        Add Menu Item
      </Link>

      {!loading && !error && (
        <PlanNotice
          plan={plan}
          activeCount={countActive(items)}
          note="Pending items count too."
        />
      )}

      <div className="mb-6">
        <FilterPills<Filter>
          value={filter}
          onChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All", count: counts.all },
            { value: "approved", label: "Approved", count: counts.approved },
            { value: "pending", label: "Pending", count: counts.pending },
            { value: "rejected", label: "Rejected", count: counts.rejected },
          ]}
        />
      </div>

      {error ? (
        <ErrorState
          title="Could not load your menu items"
          description={error}
          onRetry={reload}
        />
      ) : loading ? (
        <div
          role="status"
          aria-label="Loading menu items"
          className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No menu items yet"
          description="Add your first pizza to start receiving orders."
          actionLabel="Add Menu Item"
          actionHref="/dashboard/vendor/add-item"
        />
      ) : filtered.length === 0 ? (
        <EmptyState title={`No ${filter} items`} />
      ) : (
        <div className="rounded-2xl bg-card p-2 ring-1 ring-foreground/10 sm:p-4">
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(i) => i._id}
            minWidth="1000px"
          />
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            summary={`Showing ${rows.length} of ${filtered.length} items`}
          />
        </div>
      )}

      <ItemViewDialog item={viewItem} onClose={() => setViewItem(null)} />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Delete this menu item?"
        description={`"${deleteItem?.itemName ?? ""}" will be removed from your menu. This cannot be undone.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep item"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
