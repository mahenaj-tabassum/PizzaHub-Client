import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ItemNotFound from "@/components/menu/ItemNotFound";
import OrderForm from "@/components/menu/OrderForm";
import OrderStepper from "@/components/menu/OrderStepper";
import OrderSummary from "@/components/menu/OrderSummary";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { getMenuItem } from "@/lib/api-server";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Complete your order" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  // শুধু Customer অর্ডার করতে পারে
  if (user.role !== "customer") redirect(`/menu/${id}`);

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

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Browse Menu", href: "/menu" },
          { label: item.itemName, href: `/menu/${item._id}` },
          { label: "Order" },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
        <section>
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            Complete your order
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tell the restaurant where and when you want your pizza.
          </p>

          <div className="mt-6">
            <OrderStepper current={2} />
          </div>

          <div className="mt-8">
            <OrderForm
              itemId={item._id}
              user={{
                name: user.name,
                email: user.email,
                image: user.image ?? null,
              }}
            />
          </div>
        </section>

        <OrderSummary item={item} />
      </div>
    </div>
  );
}
