"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  approveItem,
  deleteItem,
  rejectItem,
  setItemStatus,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import type { AdminItem, MenuItemStatus } from "@/types";

export type ItemChange = { status: MenuItemStatus } | { deleted: true };

type Props = {
  item: AdminItem;
  onChanged: (id: string, change: ItemChange) => void;
  onView?: () => void;
  /** Overview এ শুধু View, Approve, Reject */
  reviewOnly?: boolean;
};

const base =
  "h-10 cursor-pointer whitespace-nowrap rounded-full px-5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60";
const outline = `${base} border border-border bg-card hover:bg-muted`;
const danger = `${base} border border-brand text-brand hover:bg-brand/10`;
const solid = `${base} bg-accent text-accent-foreground hover:bg-accent/90`;

export default function AdminItemActions({
  item,
  onChanged,
  onView,
  reviewOnly,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<"reject" | "delete" | null>(null);

  const run = async (
    request: () => Promise<unknown>,
    message: string,
    change: ItemChange,
  ) => {
    try {
      setBusy(true);
      await request();
      toast.success(message);
      onChanged(item._id, change);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {onView && (
          <button type="button" onClick={onView} className={outline}>
            View
          </button>
        )}

        {item.status === "pending" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() => approveItem(item._id), "Item approved.", {
                  status: "approved",
                })
              }
              className={solid}
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirm("reject")}
              className={danger}
            >
              Reject
            </button>
          </>
        )}

        {!reviewOnly && item.status === "approved" && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                () => setItemStatus(item._id, "inactive"),
                "Item deactivated.",
                {
                  status: "inactive",
                },
              )
            }
            className={outline}
          >
            Deactivate
          </button>
        )}

        {!reviewOnly && item.status === "inactive" && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                () => setItemStatus(item._id, "approved"),
                "Item activated.",
                {
                  status: "approved",
                },
              )
            }
            className={outline}
          >
            Activate
          </button>
        )}

        {!reviewOnly && item.status === "rejected" && (
          <span className="px-1 text-sm text-muted-foreground">Rejected</span>
        )}

        {!reviewOnly && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirm("delete")}
            className={cn(danger)}
          >
            Delete
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirm === "reject"}
        onOpenChange={(open) => !open && !busy && setConfirm(null)}
        title="Reject this item?"
        description={`"${item.itemName}" will be rejected and hidden from customers.`}
        confirmLabel="Yes, reject"
        cancelLabel="Go back"
        destructive
        loading={busy}
        onConfirm={() =>
          run(() => rejectItem(item._id), "Item rejected.", {
            status: "rejected",
          })
        }
      />

      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={(open) => !open && !busy && setConfirm(null)}
        title="Delete this item?"
        description={`"${item.itemName}" will be removed from the platform. This cannot be undone.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep item"
        destructive
        loading={busy}
        onConfirm={() =>
          run(() => deleteItem(item._id), "Item deleted.", { deleted: true })
        }
      />
    </>
  );
}
