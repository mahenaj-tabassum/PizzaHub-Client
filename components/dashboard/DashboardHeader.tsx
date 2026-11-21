"use client";

import { useState } from "react";
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
import { SidebarContent, type DashboardUser } from "./Sidebar";

export default function DashboardHeader({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
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

          <SheetContent side="left" className="w-70 bg-sidebar p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <SidebarContent user={user} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <h1 className="font-heading text-lg font-semibold capitalize">
          {user.role} Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="border-border text-foreground hover:border-border hover:bg-muted hover:text-foreground" />

        <div className="flex items-center gap-2.5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </span>
          )}
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-medium leading-tight">
              {user.name}
            </p>
            <p className="max-w-40 truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
