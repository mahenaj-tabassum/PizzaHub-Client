"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "react-toastify";

import Logo from "@/components/layout/Logo";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { NAV_BY_ROLE } from "./nav-config";

export type DashboardUser = {
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
};

export function SidebarContent({
  user,
  onNavigate,
}: {
  user: DashboardUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const items = NAV_BY_ROLE[user.role];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message);

      toast.success("Signed out successfully.");
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo light={false} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
        >
          ← Back to website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="size-4.5 animate-spin" />
          ) : (
            <LogOut className="size-4.5" />
          )}
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ user }: { user: DashboardUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-65 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <SidebarContent user={user} />
    </aside>
  );
}
