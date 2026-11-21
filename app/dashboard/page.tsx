import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getDashboardPath } from "@/lib/constants";

export default async function DashboardIndex() {
  const user = await requireUser();
  redirect(getDashboardPath(user.role));
}
