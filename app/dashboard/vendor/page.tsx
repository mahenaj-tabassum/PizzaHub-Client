import VendorOverview from "@/components/dashboard/VendorOverview";
import { requireRole } from "@/lib/session";

export default async function VendorDashboard() {
  const user = await requireRole("vendor");

  return (
    <VendorOverview
      displayName={user.businessName?.trim() || user.name.split(" ")[0]}
    />
  );
}