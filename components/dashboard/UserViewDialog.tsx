"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import Pill from "@/components/dashboard/Pill";
import DetailRow from "@/components/shared/DetailRow";
import { formatShortDate } from "@/lib/utils";
import type { AdminUser } from "@/types";

export default function UserViewDialog({
  user,
  onClose,
}: {
  user: AdminUser | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={!!user} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-popover p-6 text-popover-foreground shadow-xl transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          {user && (
            <>
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="font-heading text-2xl font-bold">
                  User details
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="cursor-pointer rounded-full p-1.5 hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              <Dialog.Description className="sr-only">
                Details of {user.name}
              </Dialog.Description>

              <div className="mt-5 flex items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-bold text-secondary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-heading text-xl font-bold">
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="mt-4">
                <div className="flex items-center justify-between border-b border-border py-3.5">
                  <dt className="text-sm text-muted-foreground">Role</dt>
                  <dd className="text-sm font-medium capitalize">
                    {user.role}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3.5">
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>
                    <Pill tone={user.isBlocked ? "danger" : "success"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Pill>
                  </dd>
                </div>
                {user.role === "vendor" && (
                  <>
                    <DetailRow
                      label="Business name"
                      value={user.businessName || "—"}
                    />
                    <DetailRow
                      label="Plan"
                      value={user.subscriptionPlan ?? "free"}
                    />
                    {user.subscriptionPlan === "premium" &&
                      user.subscriptionExpiresAt && (
                        <DetailRow
                          label="Premium until"
                          value={formatShortDate(user.subscriptionExpiresAt)}
                        />
                      )}
                  </>
                )}
                <DetailRow
                  label="Joined"
                  value={formatShortDate(user.createdAt)}
                />
              </dl>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
