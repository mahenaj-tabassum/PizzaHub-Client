import PremiumBadge from "@/components/shared/PremiumBadge";
import { getVendorName } from "@/lib/utils";
import type { MenuItem } from "@/types";

export default function VendorCard({
  item,
  subtitle,
}: {
  item: Pick<MenuItem, "vendorInfo">;
  subtitle: string;
}) {
  const name = getVendorName(item);
  const vendor = item.vendorInfo;

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      {vendor?.image ? (
        <img
          src={vendor.image}
          alt={name}
          className="size-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
          {initials}
        </span>
      )}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{name}</p>
          {vendor?.isPremium && <PremiumBadge />}
        </div>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
