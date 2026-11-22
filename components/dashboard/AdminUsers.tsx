"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import FilterSelect from "@/components/dashboard/FilterSelect";
import Pill from "@/components/dashboard/Pill";
import SearchInput from "@/components/dashboard/SearchInput";
import TablePagination from "@/components/dashboard/TablePagination";
import UserViewDialog from "@/components/dashboard/UserViewDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useAdminList } from "@/hooks/useAdminList";
import { useDebounce } from "@/hooks/useDebounce";
import { blockUser, unblockUser } from "@/lib/admin-api";
import { cn, formatShortDate } from "@/lib/utils";
import type { AdminUser } from "@/types";

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" },
];

const ROLE_TONE = {
  customer: "muted",
  vendor: "success",
  admin: "honey",
} as const;

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim(), 400);
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [q, role]);

  const { items, setItems, pageInfo, loading, error, reload } =
    useAdminList<AdminUser>("/api/admin/users", { q, role, page, limit: 10 });

  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  const handleToggleBlock = async () => {
    if (!target) return;
    const blocking = !target.isBlocked;

    try {
      setBusy(true);
      await (blocking ? blockUser(target._id) : unblockUser(target._id));

      setItems((prev) =>
        prev.map((u) =>
          u._id === target._id ? { ...u, isBlocked: blocking } : u,
        ),
      );
      toast.success(blocking ? "User blocked." : "User unblocked.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the user.",
      );
    } finally {
      setBusy(false);
      setTarget(null);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => (
        <div className="flex min-w-52 items-center gap-3">
          {u.image ? (
            <img
              src={u.image}
              alt=""
              className="size-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/30 font-medium">
              {u.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => <Pill tone={ROLE_TONE[u.role]}>{u.role}</Pill>,
    },
    { key: "business", header: "Business", cell: (u) => u.businessName || "—" },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Pill tone={u.isBlocked ? "danger" : "success"}>
          {u.isBlocked ? "Blocked" : "Active"}
        </Pill>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      cell: (u) => formatShortDate(u.createdAt),
      className: "whitespace-nowrap",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (u) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewUser(u)}
            className="h-10 cursor-pointer rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View
          </button>
          {u.role !== "admin" && (
            <button
              type="button"
              onClick={() => setTarget(u)}
              className={cn(
                "h-10 cursor-pointer rounded-full px-5 text-sm font-semibold transition",
                u.isBlocked
                  ? "bg-brand text-brand-foreground hover:bg-brand/90"
                  : "border border-brand text-brand hover:bg-brand/10",
              )}
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ),
    },
  ];

  const hasFilter = !!q || !!role;

  return (
    <>
      <DashboardPageHeader
        title="Manage Users"
        description="View vendors and customers, and block or unblock accounts."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email"
          label="Search users"
        />
        <div className="sm:w-48">
          <FilterSelect
            value={role}
            onChange={setRole}
            options={ROLE_OPTIONS}
            label="Filter by role"
          />
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Could not load users"
          description={error}
          onRetry={reload}
        />
      ) : loading && items.length === 0 ? (
        <div
          role="status"
          aria-label="Loading users"
          className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={hasFilter ? "No users match your search" : "No users yet"}
          description={
            hasFilter ? "Try a different name, email, or role." : undefined
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
            getRowKey={(u) => u._id}
            minWidth="900px"
          />
          <TablePagination
            page={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={setPage}
            summary={`Showing ${items.length} of ${pageInfo.total} users`}
          />
        </div>
      )}

      <UserViewDialog user={viewUser} onClose={() => setViewUser(null)} />

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && !busy && setTarget(null)}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={
          target?.isBlocked
            ? `${target.name} will be able to use the platform again.`
            : `${target?.name ?? "This user"} will not be able to use protected features until unblocked.`
        }
        confirmLabel={target?.isBlocked ? "Yes, unblock" : "Yes, block"}
        cancelLabel="Go back"
        destructive={!target?.isBlocked}
        loading={busy}
        onConfirm={handleToggleBlock}
      />
    </>
  );
}
