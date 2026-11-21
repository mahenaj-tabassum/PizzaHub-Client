import CustomerOverview from "@/components/dashboard/CustomerOverview";
import { requireRole } from "@/lib/session";

export default async function CustomerDashboard() {
  const user = await requireRole("customer");
  return <CustomerOverview firstName={user.name.split(" ")[0]} />;
}
