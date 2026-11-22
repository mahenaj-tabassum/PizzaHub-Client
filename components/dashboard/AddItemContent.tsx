"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ItemForm from "@/components/dashboard/ItemForm";
import PlanNotice from "@/components/dashboard/PlanNotice";
import { useVendorItems } from "@/hooks/useVendorItems";
import { countActive, FREE_ACTIVE_LIMIT } from "@/lib/item-utils";

export default function AddItemContent({ plan }: { plan: "free" | "premium" }) {
  const { items, loading } = useVendorItems();

  const activeCount = countActive(items);
  const limitReached =
    plan === "free" && !loading && activeCount >= FREE_ACTIVE_LIMIT;

  return (
    <>
      <DashboardPageHeader
        title="Add Menu Item"
        description="Publish a new pizza, side, or drink. New items stay Pending until an admin approves them."
      />

      {!loading && <PlanNotice plan={plan} activeCount={activeCount} />}

      <ItemForm mode="create" limitReached={limitReached} />
    </>
  );
}
