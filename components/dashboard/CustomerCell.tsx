import type { CustomerInfo } from "@/types";

export default function CustomerCell({ info }: { info?: CustomerInfo | null }) {
  const name = info?.name || "Unknown customer";
  const email = info?.email || "No email available";

  return (
    <div className="flex min-w-52 items-center gap-3">
      {info?.image ? (
        <img
          src={info.image}
          alt=""
          className="size-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/30 font-medium">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
