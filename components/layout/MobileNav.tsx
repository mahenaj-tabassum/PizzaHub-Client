"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Open menu"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "cursor-pointer",
            "text-white hover:bg-white/10 hover:text-white",
          )}
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="right" className="w-64">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="mt-10 flex flex-col gap-4 px-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="text-base font-medium"
              >
                {l.label}
              </Link>
            ))}

            <ThemeToggle variant="row" />

            <Link
              href="/signin"
              onClick={close}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full",
              )}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={close}
              className={cn(buttonVariants(), "rounded-full")}
            >
              Sign Up
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
