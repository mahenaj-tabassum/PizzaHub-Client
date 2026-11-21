import CustomerOrderDetails from "@/components/dashboard/CustomerOrderDetails";

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerOrderDetails orderId={id} />;
}
