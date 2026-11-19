"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Menu,
  LayoutDashboard,
  LogOut,
  UserRound,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

interface MobileNavProps {
  links: NavLink[];
  isPending: boolean;

  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  } | null;
}

// Get dashboard based on user role
function getDashboard(role: string) {
  if (role === "vendor") return "/dashboard/vendor";
  if (role === "admin") return "/dashboard/admin";

  return "/dashboard/customer";
}

export default function MobileNav({ links, user, isPending }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  // Close mobile menu
  const close = () => setOpen(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message);
      }

      close();

      toast.success("Signed out successfully.");

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Menu Trigger */}
        <SheetTrigger
          aria-label="Open menu"
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "icon",
            }),
            "text-white hover:bg-white/10 hover:text-white",
          )}
        >
          <Menu className="size-5" />
        </SheetTrigger>

        {/* Mobile Sidebar */}
        <SheetContent
          side="right"
          className="w-[300px] border-[#ead7c1] bg-[#fbf4eb]"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          <nav className="mt-10 flex flex-col gap-5 px-4">
            {/* Navigation Links */}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-base font-medium text-[#321d17] transition hover:text-[#981e24]"
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication Section */}
            <div className="border-t border-[#e7d4bd] pt-5">
              {/* Loading State */}
              {isPending ? (
                <div className="space-y-3">
                  <div className="h-11 animate-pulse rounded-xl bg-[#ead7c1]" />
                  <div className="h-11 animate-pulse rounded-xl bg-[#ead7c1]" />
                </div>
              ) : user ? (
                <>
                  {/* Authenticated User */}
                  <div className="mb-5 flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="size-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#981e24] font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#301c17]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[#80665b]">
                        {user.email}
                      </p>

                      <span className="text-xs capitalize text-[#981e24]">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link
                    href={getDashboard(user.role)}
                    onClick={close}
                    className="flex items-center gap-3 py-3 text-sm font-medium text-[#301c17] transition hover:text-[#981e24]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  {/* Profile Settings */}
                  <Link
                    href={`${getDashboard(user.role)}/profile`}
                    onClick={close}
                    className="flex items-center gap-3 py-3 text-sm font-medium text-[#301c17] transition hover:text-[#981e24]"
                  >
                    <UserRound size={18} />
                    Profile Settings
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 py-3 text-left text-sm font-medium text-[#981e24] transition hover:text-[#7f171d] disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <LogOut size={18} />
                    )}

                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </>
              ) : (
                /* Logged Out User */
                <div className="flex flex-col gap-3">
                  <Link
                    href="/signin"
                    onClick={close}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "rounded-full border-[#d9bea0] text-[#301c17] hover:bg-[#f4e5d3]",
                    )}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={close}
                    className={cn(
                      buttonVariants(),
                      "rounded-full bg-[#981e24] text-white hover:bg-[#7f171d]",
                    )}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle variant="row" />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
