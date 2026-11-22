"use client";

import { useEffect, useState } from "react";

import AdminItemActions from "@/components/dashboard/AdminItemActions";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import FilterPills from "@/components/dashboard/FilterPills";
import ItemStatusBadge from "@/components/dashboard/ItemStatusBadge";
import ItemViewDialog from "@/components/dashboard/ItemViewDialog";
import MenuItemCell from "@/components/dashboard/MenuItemCell";
import SearchInput from "@/components/dashboard/SearchInput";
import TablePagination from "@/components/dashboard/TablePagination";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useAdminList } from "@/hooks/useAdminList";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatPrice, formatShortDate } from "@/lib/utils";
import type { AdminItem } from "@/types";

type Filter = "" | "pending" | "approved" | "rejected" | "inactive";

const vendorName = (i: AdminItem) =>
  i.vendorInfo?.businessName || i.vendorInfo?.name || "—";

export default function AdminItems() {
  const { stats, reload: reloadStats } = useAdminStats();

  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim(), 400);
  const [status, setStatus] = useState<Filter>("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [q, status]);

  const { items, setItems, pageInfo, loading, error, reload } =
    useAdminList<AdminItem>("/api/admin/items", { q, status, page, limit: 10 });

  const [viewItem, setViewItem] = useState<AdminItem | null>(null);

  const by = stats?.itemsByStatus;

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
      key: "location",
      header: "Location",
      cell: (i) => <span className="line-clamp-2 min-w-24">{i.location}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => <ItemStatusBadge status={i.status} />,
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
          onView={() => setViewItem(i)}
          onChanged={(id, change) => {
            if ("deleted" in change) {
              setItems((prev) => prev.filter((x) => x._id !== id));
            } else if (status && change.status !== status) {
              // বর্তমান ফিল্টারে আর মেলে না, তাই সরিয়ে দেওয়া
              setItems((prev) => prev.filter((x) => x._id !== id));
            } else {
              setItems((prev) =>
                prev.map((x) =>
                  x._id === id ? { ...x, status: change.status } : x,
                ),
              );
            }
            reloadStats();
          }}
        />
      ),
    },
  ];

  const hasFilter = !!q || !!status;

  return (
    <>
      <DashboardPageHeader
        title="Manage Menu Items"
        description="Review new items, change the status of published items, and delete anything inappropriate. Only Approved items show on Browse Menu."
      />

      <div className="mb-4">
        <FilterPills<Filter>
          value={status}
          onChange={setStatus}
          options={[
            { value: "", label: "All", count: stats?.totalMenuItems ?? 0 },
            { value: "pending", label: "Pending", count: by?.pending ?? 0 },
            { value: "approved", label: "Approved", count: by?.approved ?? 0 },
            { value: "rejected", label: "Rejected", count: by?.rejected ?? 0 },
            { value: "inactive", label: "Inactive", count: by?.inactive ?? 0 },
          ]}
        />
      </div>

      <div className="mb-6 flex">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search item name, category, or location"
          label="Search menu items"
        />
      </div>

      {error ? (
        <ErrorState
          title="Could not load menu items"
          description={error}
          onRetry={reload}
        />
      ) : loading && items.length === 0 ? (
        <div
          role="status"
          aria-label="Loading menu items"
          className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={
            hasFilter ? "No items match your filters" : "No menu items yet"
          }
          description={
            hasFilter ? "Try a different search or status." : undefined
          }
        />
      ) : (
        <div
          className={cn(
            "rounded-2xl bg-card p-2 ring-1 ring-foreground/10 transition-opacity sm:p-4",
            loading && "opacity-60",
          )}
        >
          <DataTable
            columns={columns}
            rows={items}
            getRowKey={(i) => i._id}
            minWidth="1120px"
          />
          <TablePagination
            page={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={setPage}
            summary={`Showing ${items.length} of ${pageInfo.total} items`}
          />
        </div>
      )}

      <ItemViewDialog
        item={viewItem}
        vendorName={viewItem ? vendorName(viewItem) : undefined}
        onClose={() => setViewItem(null)}
      />
    </>
  );
}
