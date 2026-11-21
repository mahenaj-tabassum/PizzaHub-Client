import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryLabel } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

function PizzaPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="relative size-28 rounded-full bg-[#f3d9a0]"
    >
      <span className="absolute left-[26%] top-[24%] size-4 rounded-full bg-primary/80" />
      <span className="absolute right-[24%] top-[30%] size-5 rounded-full bg-primary/80" />
      <span className="absolute bottom-[24%] left-[42%] size-4 rounded-full bg-primary/80" />
    </span>
  );
}

export default function MenuCard({ item }: { item: MenuItem }) {
  const image = item.images?.[0];

  const vendorName =
    item.vendor?.businessName ?? item.vendor?.name ?? "Local restaurant";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex aspect-4/3 items-center justify-center bg-muted">
        {image ? (
          <Image
            src={image}
            alt={item.itemName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PizzaPlaceholder />
        )}

        {item.vendor?.isPremium && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            Premium
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground">
          {getCategoryLabel(item.category)}
        </p>

        <h3 className="mt-1 line-clamp-1 font-heading text-lg font-semibold leading-snug">
          {item.itemName}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {vendorName} · {item.location}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="font-heading text-lg font-bold text-primary">
            {formatPrice(item.price)}
          </span>

          <Link
            href={`/menu/${item._id}`}
            className={cn(
              buttonVariants(),
              "h-9 rounded-full px-4 text-sm font-semibold",
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
