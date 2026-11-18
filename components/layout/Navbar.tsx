"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { ArrowRight } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();


// Scroll Detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-primary/90 shadow-lg shadow-black/10 backdrop-blur-md backdrop-saturate-150"
          : "border-transparent bg-primary",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:grid md:grid-cols-3 md:px-6">
        {/* Left */}
        <div className="flex items-center justify-start">
          <Logo />
        </div>

        {/* Center (desktop only) */}
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm transition-colors hover:text-white",
                isActive(l.href) ? "font-medium text-white" : "text-white/80",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center justify-end gap-3">
          {/* Desktop buttons */}
          <div className="hidden items-center gap-3 md:flex">
			<ThemeToggle />
            <Link
              href="/signin"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/60 px-6 text-sm font-medium text-white transition-all duration-200 hover:border-cream hover:bg-cream hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="group inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-secondary px-6 text-sm font-semibold text-secondary-foreground shadow-md shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-lg hover:shadow-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0 active:scale-95"
            >
              Sign Up
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
