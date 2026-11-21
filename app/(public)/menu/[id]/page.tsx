import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import ImageGallery from "@/components/menu/ImageGallery";
import ItemNotFound from "@/components/menu/ItemNotFound";
import VendorCard from "@/components/menu/VendorCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { getMenuItem } from "@/lib/api-server";
import { getCategoryLabel } from "@/lib/constants";
import { requireUser } from "@/lib/session";
import { cn, formatPrice } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const item = await getMenuItem(id);

    return { title: item?.itemName ?? "Item not found" };
  } catch {
    return { title: "Menu item" };
  }
}

export default async function ItemDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await requireUser();

  let item = null;

  try {
    item = await getMenuItem(id);
  } catch {
    return (
      <ItemNotFound
        title="Could not load this item"
        description="Please check your connection and try again."
      />
    );
  }

  if (!item) return <ItemNotFound />;

  if (item.status !== "approved" || !item.isAvailable) {
    return (
      <ItemNotFound
        title="Currently unavailable"
        description="This item is not available to order right now."
      />
    );
  }

  // Prevent vendors and admins from placing customer orders.
  let notice: string | null = null;

  if (user.role === "vendor") {
    notice =
      user.id === item.vendorId
        ? "This is your own menu item, so you cannot order it."
        : "Restaurant accounts cannot place orders. Please use a customer account.";
  } else if (user.role === "admin") {
    notice = "Admin accounts cannot place customer orders.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Menu", href: "/menu" },
          { label: item.itemName },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ImageGallery images={item.images} alt={item.itemName} />

        <div>
          <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
            {getCategoryLabel(item.category)}
          </span>

          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">
            {item.itemName}
          </h1>

          <p className="mt-2 font-heading text-3xl font-bold text-brand">
            {formatPrice(item.price)}
          </p>

          {item.description && (
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}

          <div className="mt-6">
            <VendorCard item={item} subtitle={item.location} />
          </div>

          <div className="mt-6 rounded-2xl bg-card p-6 shadow-lg shadow-black/5 ring-1 ring-foreground/10">
            <h2 className="font-heading text-xl font-bold">Order this item</h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              From {item.location}
            </p>

            {notice ? (
              <p
                role="status"
                className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground"
              >
                {notice}
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  You will choose the delivery date and address on the next
                  page.
                </p>

                <Link
                  href={`/menu/${item._id}/order`}
                  className={cn(
                    buttonVariants(),
                    "mt-5 h-12 w-full rounded-full bg-brand text-base font-semibold text-brand-foreground hover:bg-brand/90",
                  )}
                >
                  Order Now
                </Link>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  No online payment is needed. You can cancel while your order
                  is pending.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
