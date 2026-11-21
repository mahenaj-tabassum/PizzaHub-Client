import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPrice, getVendorName } from "@/lib/utils";
import type { MenuItem } from "@/types";

type MenuCardProps = {
  item: MenuItem;
  className?: string;
};

export default function MenuCard({ item, className }: MenuCardProps) {
  const image = item.images?.[0] || "/images/pizza-placeholder.png";

  return (
    <Link href={`/menu/${item._id}`} className="block">
      <Card
        className={cn(
          "group relative h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg",
          className,
        )}
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={image}
            alt={item.itemName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {item.vendorInfo?.isPremium && (
            <Badge variant="secondary" className="absolute left-3 top-3">
              Premium
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-primary">
              {item.itemName}
            </h3>

            <span className="shrink-0 font-bold text-primary">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {getVendorName(item)} · {item.location}
          </p>

          {item.description && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
