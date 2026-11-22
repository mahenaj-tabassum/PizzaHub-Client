import Image from "next/image";
import { Pizza } from "lucide-react";
import { getCategoryLabel } from "@/lib/constants";
import type { MenuItem } from "@/types";

export default function MenuItemCell({
  item,
}: {
  item: Pick<MenuItem, "itemName" | "category" | "images">;
}) {
  const image = item.images?.[0];

  return (
    <div className="flex min-w-48 items-center gap-3">
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
        <p className="truncate font-medium">{item.itemName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {getCategoryLabel(item.category)}
        </p>
      </div>
    </div>
  );
}
