import Image from "next/image";
import Link from "next/link";

import VendorCard from "@/components/menu/VendorCard";
import { getCategoryLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

const NOTES = [
  "The restaurant reviews your order. Status: Pending.",
  "They accept or reject it. You will see the update in My Orders.",
  "You can cancel while it is still Pending.",
];

export default function OrderSummary({ item }: { item: MenuItem }) {
  const image = item.images[0];

  return (
    <aside className="rounded-3xl bg-card p-6 shadow-xl shadow-black/5 ring-1 ring-foreground/10 lg:sticky lg:top-24">
      <h2 className="font-heading text-2xl font-bold">Order summary</h2>

      <div className="relative mt-5 aspect-16/8 overflow-hidden rounded-2xl bg-muted">
        {image && (
          <Image
            src={image}
            alt={item.itemName}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <span className="mt-4 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
        {getCategoryLabel(item.category)}
      </span>
      <h3 className="mt-2 font-heading text-2xl font-bold">{item.itemName}</h3>
      <p className="text-sm text-muted-foreground">{item.location}</p>

      <div className="mt-4">
        <VendorCard item={item} subtitle="Restaurant" />
      </div>

      <div className="mt-5 flex items-center justify-between border-y border-border py-4">
        <span className="text-sm">Item price</span>
        <span className="font-heading text-2xl font-bold text-brand">
          {formatPrice(item.price)}
        </span>
      </div>

      <ol className="mt-5 space-y-3">
        {NOTES.map((note, i) => (
          <li key={note} className="flex items-start gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-xs font-semibold text-brand">
              {i + 1}
            </span>
            {note}
          </li>
        ))}
      </ol>

      <Link
        href={`/menu/${item._id}`}
        className="mt-6 flex h-12 items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
      >
        Back to item
      </Link>
    </aside>
  );
}
