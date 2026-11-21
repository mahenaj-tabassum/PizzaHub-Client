"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, X } from "lucide-react";
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

const SUBTITLE: Record<UserRole, string> = {
  customer: "Customer dashboard",
  vendor: "Restaurant dashboard",
  admin: "Admin dashboard",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
    <div className="relative flex h-full flex-col bg-primary text-white">
      {onNavigate && (
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Close menu"
          className="absolute right-3 top-4 cursor-pointer rounded-full p-1.5 text-white/80 hover:bg-white/10"
        >
          <X className="size-5" />
        </button>
      )}

      <div className="px-5 pb-5 pt-6">
        <Logo />
        <p className="mt-1 pl-10 text-xs font-medium text-secondary">
          {SUBTITLE[user.role]}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-brand-foreground"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <LogOut className="size-5" />
          )}
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </nav>

      <div className="mx-3 flex items-center gap-3 border-t border-white/10 px-2 py-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
            {initialsOf(user.name)}
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-white/70">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ user }: { user: DashboardUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
      <SidebarContent user={user} />
    </aside>
  );
}
