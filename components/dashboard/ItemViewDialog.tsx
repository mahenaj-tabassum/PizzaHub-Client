"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import ItemStatusBadge from "@/components/dashboard/ItemStatusBadge";
import DetailRow from "@/components/shared/DetailRow";
import { getCategoryLabel } from "@/lib/constants";
import { formatPrice, formatShortDate } from "@/lib/utils";
import type { MenuItem } from "@/types";
import DescriptionRenderer from "../menu/DescriptionRenderer";

type ViewableItem = Pick<
  MenuItem,
  | "itemName"
  | "images"
  | "category"
  | "price"
  | "location"
  | "status"
  | "createdAt"
  | "description"
> & { isAvailable?: boolean };

export default function ItemViewDialog({
  item,
  vendorName,
  onClose,
}: {
  item: ViewableItem | null;
  vendorName?: string;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-popover p-6 text-popover-foreground shadow-xl transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          {item && (
            <>
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="font-heading text-2xl font-bold">
                  {item.itemName}
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
                Details of {item.itemName}
              </Dialog.Description>

              <div className="relative mt-4 aspect-16/10 overflow-hidden rounded-xl bg-muted">
                {item.images?.[0] && (
                  <Image
                    src={item.images[0]}
                    alt={item.itemName}
                    fill
                    sizes="480px"
                    className="object-cover"
                  />
                )}
              </div>

              <dl className="mt-3">
                {vendorName && (
                  <DetailRow label="Restaurant" value={vendorName} />
                )}
                <DetailRow
                  label="Category"
                  value={getCategoryLabel(item.category)}
                />
                <DetailRow label="Price" value={formatPrice(item.price)} />
                <DetailRow label="Location" value={item.location} />
                <div className="flex items-center justify-between border-b border-border py-3.5">
                  <dt className="text-sm text-muted-foreground">Approval</dt>
                  <dd>
                    <ItemStatusBadge status={item.status} />
                  </dd>
                </div>
                {item.isAvailable !== undefined && (
                  <DetailRow
                    label="Availability"
                    value={item.isAvailable ? "Available" : "Hidden"}
                  />
                )}
                <DetailRow
                  label="Added"
                  value={formatShortDate(item.createdAt)}
                />
              </dl>

              {item.description && (
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <DescriptionRenderer description={item.description} />
                </div>
              )}

              {item.status === "rejected" && (
                <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  This item was rejected, so customers cannot see it.
                </p>
              )}
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
