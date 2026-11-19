"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ProfileDropdown from "./ProfileDropdown";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  // Get the current authentication session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;

  // Handle navbar background on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Check active navigation link
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Prepare user data for navigation components
  const navUser = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role ?? "customer",
      }
    : null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-primary/90 shadow-lg shadow-black/10 backdrop-blur-md"
          : "border-transparent bg-primary",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:grid md:grid-cols-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-white",
                isActive(link.href)
                  ? "font-semibold text-white"
                  : "text-white/80",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {isPending ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
            ) : navUser ? (
              <ProfileDropdown user={navUser} />
            ) : (
              <>
                {/* Sign In */}
                <Link
                  href="/signin"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/60 px-6 text-sm font-medium text-white transition hover:bg-white hover:text-primary"
                >
                  Sign In
                </Link>

                {/* Sign Up */}
                <Link
                  href="/signup"
                  className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
                >
                  Sign Up
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav links={navLinks} user={navUser} isPending={isPending} />
        </div>
      </div>
    </header>
  );
}
