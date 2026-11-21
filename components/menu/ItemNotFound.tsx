import ErrorState from "@/components/shared/ErrorState";

export default function ItemNotFound({
  title = "Item not found",
  description = "This menu item does not exist, or it is no longer available.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-32">
      <ErrorState title={title} description={description} retryHref="/menu" />
    </div>
  );
}
