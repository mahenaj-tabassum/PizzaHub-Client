import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { requireUser } from "@/lib/session";
import type { SubscriptionPlan, UserRole } from "@/types";

export default async function ProfilePageContent() {
  const user = await requireUser();
  const role = user.role as UserRole;

  return (
    <>
      <DashboardPageHeader
        title="Profile Settings"
        description={
          role === "vendor"
            ? "Update your name, photo, and restaurant details. Your role and plan can not be changed here."
            : "Update your name and photo. Your role can not be changed here."
        }
      />

      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role,
          businessName: user.businessName ?? "",
          subscriptionPlan: (user.subscriptionPlan ??
            "free") as SubscriptionPlan,
          createdAt: new Date(user.createdAt).toISOString(),
        }}
      />
    </>
  );
}
