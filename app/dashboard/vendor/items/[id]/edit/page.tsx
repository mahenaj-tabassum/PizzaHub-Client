import EditItemContent from "@/components/dashboard/EditItemContent";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditItemContent itemId={id} />;
}
