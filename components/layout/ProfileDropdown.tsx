"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
}

function getDashboard(role: string) {
  if (role === "vendor") return "/dashboard/vendor";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/customer";
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("You have signed out successfully.");

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-white/20 p-1.5 pr-3 text-white transition hover:bg-white/10"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-[#f2d39c] text-sm font-bold text-[#8e1b20]">
            {initials}
          </span>
        )}

        <span className="hidden max-w-28 truncate text-sm font-medium lg:block">
          {user.name}
        </span>

        <ChevronDown size={16} />
      </button>

      {open && (
        <>
          <button
            aria-label="Close profile menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-[#ead7c1] bg-white p-3 text-[#301c17] shadow-xl">
            <div className="border-b border-[#f0e5d9] px-3 py-3">
              <p className="truncate text-sm font-semibold">{user.name}</p>

              <p className="truncate text-xs text-[#80665b]">{user.email}</p>

              <span className="mt-2 inline-block rounded-full bg-[#f8e9d8] px-3 py-1 text-xs font-medium capitalize text-[#981e24]">
                {user.role}
              </span>
            </div>

            <div className="space-y-1 pt-2">
              <Link
                href={getDashboard(user.role)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[#fbf2e9]"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                href={`${getDashboard(user.role)}/profile`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[#fbf2e9]"
              >
                <UserRound size={18} />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#981e24] transition hover:bg-[#fbf0ed] disabled:opacity-50"
              >
                {loading ? (
                  <Settings size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}

                {loading ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
