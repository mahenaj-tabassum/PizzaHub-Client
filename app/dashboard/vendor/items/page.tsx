import MyMenuItems from "@/components/dashboard/MyMenuItems";
import { requireRole } from "@/lib/session";

export default async function VendorItemsPage() {
  const user = await requireRole("vendor");

  return (
    <MyMenuItems
      plan={user.subscriptionPlan === "premium" ? "premium" : "free"}
    />
  );
}
