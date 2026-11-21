import Image from "next/image";
import { Pizza } from "lucide-react";
import { getCategoryLabel } from "@/lib/constants";
import type { Order } from "@/types";

export default function OrderItemCell({ order }: { order: Order }) {
  const { itemName, category, images } = order.itemSnapshot;
  const image = images?.[0];

  return (
    <div className="flex min-w-44 items-center gap-3">
      <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary/30">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          <Pizza className="size-5 text-brand/60" />
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium">{itemName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {getCategoryLabel(category)}
        </p>
      </div>
    </div>
  );
}
