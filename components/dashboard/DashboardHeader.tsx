"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE } from "./nav-config";
import { SidebarContent, type DashboardUser } from "./Sidebar";

export default function DashboardHeader({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // সবচেয়ে লম্বা মিলে যাওয়া href কেই বর্তমান পেজ ধরা হয়
  const current = [...NAV_BY_ROLE[user.role]]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-8">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open sidebar"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "lg:hidden",
            )}
          >
            <Menu className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-72 max-w-[85vw] border-none bg-primary p-0"
          >
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <SidebarContent user={user} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <p className="font-heading text-xl font-bold">
          {current?.label ?? "Dashboard"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="border-border text-foreground hover:border-border hover:bg-muted hover:text-foreground" />

        <div className="flex items-center gap-2.5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {initials}
            </span>
          )}
          <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
}
