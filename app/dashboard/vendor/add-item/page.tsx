import AddItemContent from "@/components/dashboard/AddItemContent";
import { requireRole } from "@/lib/session";

export default async function AddItemPage() {
  const user = await requireRole("vendor");

  return (
    <AddItemContent
      plan={user.subscriptionPlan === "premium" ? "premium" : "free"}
    />
  );
}
