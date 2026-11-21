import MenuGrid from "@/components/menu/MenuGrid";
import MenuPagination from "@/components/menu/MenuPagination";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { getMenuItems, type MenuFilters } from "@/lib/api-server";

export default async function MenuResults({
  filters,
}: {
  filters: MenuFilters;
}) {
  let result;

  try {
    result = await getMenuItems(filters);
  } catch {
    return (
      <div className="mt-8">
        <ErrorState
          title="Could not load the menu"
          description="Please check your connection and try again."
          retryHref="/menu"
        />
      </div>
    );
  }

  const { data: items, pagination } = result;

  if (items.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No items found"
          description="Try a different search or clear your filters."
          actionLabel="Clear filters"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <>
      <p className="mb-5 mt-6 text-sm text-muted-foreground">
        {pagination.totalItems} {pagination.totalItems === 1 ? "item" : "items"}{" "}
        found
      </p>

      <MenuGrid items={items} />
      <MenuPagination pagination={pagination} searchParams={filters} />
    </>
  );
}
