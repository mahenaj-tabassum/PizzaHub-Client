"use client";

import { useMemo, useState } from "react";
import { Check, Clock, CreditCard, Lock } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import FilterSelect from "@/components/dashboard/FilterSelect";
import Pill, { type PillTone } from "@/components/dashboard/Pill";
import StatCard from "@/components/dashboard/StatCard";
import TablePagination from "@/components/dashboard/TablePagination";
import VendorCell from "@/components/dashboard/VendorCell";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { formatAmount, formatShortDate } from "@/lib/utils";
import type { AdminTransaction, TransactionStatus } from "@/types";

const PAGE_SIZE = 8;

const STATUS_TONE: Record<TransactionStatus, PillTone> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  expired: "muted",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "expired", label: "Expired" },
];

const columns: Column<AdminTransaction>[] = [
  {
    key: "vendor",
    header: "Vendor",
    cell: (t) => <VendorCell info={t.vendorInfo} />,
  },
  {
    key: "plan",
    header: "Plan",
    cell: () => <Pill tone="honey">Premium</Pill>,
  },
  {
    key: "amount",
    header: "Amount",
    cell: (t) => formatAmount(t.amount, t.currency),
    className: "whitespace-nowrap font-medium",
  },
  {
    key: "status",
    header: "Status",
    cell: (t) => <Pill tone={STATUS_TONE[t.status]}>{t.status}</Pill>,
  },
  {
    key: "date",
    header: "Date",
    cell: (t) => formatShortDate(t.createdAt),
    className: "whitespace-nowrap",
  },
  {
    key: "session",
    header: "Stripe session",
    cell: (t) => (
      <code
        title={t.stripeSessionId}
        className="whitespace-nowrap font-mono text-xs text-muted-foreground"
      >
        {t.stripeSessionId.slice(0, 18)}…
      </code>
    ),
  },
];

export default function AdminTransactions() {
  const { transactions, loading, error, reload } = useAdminTransactions();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const summary = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "completed");
    return {
      currency: transactions[0]?.currency ?? "usd",
      revenue: completed.reduce((sum, t) => sum + t.amount, 0),
      completed: completed.length,
      other: transactions.length - completed.length,
    };
  }, [transactions]);

  const filtered = useMemo(
    () =>
      status === "all"
        ? transactions
        : transactions.filter((t) => t.status === status),
    [transactions, status],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const heading = (
    <DashboardPageHeader
      title="Transactions"
      description="Premium subscription payments from vendors."
    />
  );

  if (error) {
    return (
      <>
        {heading}
        <ErrorState
          title="Could not load transactions"
          description={error}
          onRetry={reload}
        />
      </>
    );
  }

  return (
    <>
      {heading}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue (completed)"
          value={
            loading ? "—" : formatAmount(summary.revenue, summary.currency)
          }
          icon={CreditCard}
        />
        <StatCard
          label="Completed payments"
          value={loading ? "—" : summary.completed}
          icon={Check}
        />
        <StatCard
          label="Pending or failed"
          value={loading ? "—" : summary.other}
          icon={Clock}
        />
      </div>

      <p className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary/20 px-5 py-3.5 text-sm">
        <Lock className="size-4 shrink-0" />
        Payment records are read-only. Their status is updated only when Stripe
        confirms a payment.
      </p>

      <div className="mt-6 w-full sm:w-56">
        <FilterSelect
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          label="Filter by status"
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <div
            role="status"
            aria-label="Loading transactions"
            className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Premium subscription payments will appear here."
          />
        ) : filtered.length === 0 ? (
          <EmptyState title={`No ${status} transactions`} />
        ) : (
          <div className="rounded-2xl bg-card p-2 ring-1 ring-foreground/10 sm:p-4">
            <DataTable
              columns={columns}
              rows={rows}
              getRowKey={(t) => t._id}
              minWidth="900px"
            />
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              summary={`Showing ${rows.length} of ${filtered.length} transactions`}
            />
          </div>
        )}
      </div>
    </>
  );
}
