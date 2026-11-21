import { requireUser } from "@/lib/session";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import type { UserRole } from "@/types";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sessionUser = await requireUser();

  const user = {
    name: sessionUser.name,
    email: sessionUser.email,
    image: sessionUser.image ?? null,
    role: sessionUser.role as UserRole,
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
