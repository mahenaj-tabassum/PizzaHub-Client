import type { Metadata } from "next";
import { redirect } from "next/navigation";

import OrderSent from "@/components/menu/OrderSent";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Order sent" };

export default async function OrderSentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  await requireRole("customer");

  const { orderId } = await searchParams;
  if (!orderId) redirect("/dashboard/customer/orders");

  return <OrderSent orderId={orderId} />;
}
