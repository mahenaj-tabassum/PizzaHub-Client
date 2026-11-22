import type { AdminPartyInfo } from "@/types";

export default function VendorCell({ info }: { info?: AdminPartyInfo | null }) {
  const name = info?.businessName || info?.name || "Unknown vendor";

  return (
    <div className="flex min-w-48 items-center gap-3">
      {info?.image ? (
        <img
          src={info.image}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/30 font-medium">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        {info?.email && (
          <p className="truncate text-xs text-muted-foreground">{info.email}</p>
        )}
      </div>
    </div>
  );
}
