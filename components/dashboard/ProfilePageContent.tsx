import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { requireUser } from "@/lib/session";
import type { SubscriptionPlan, UserRole } from "@/types";

function toIsoDate(value: unknown) {
  const date = value ? new Date(value as string | number | Date) : null;

  return date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : new Date().toISOString();
}

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
          createdAt: toIsoDate(user.createdAt),
        }}
      />
    </>
  );
}
