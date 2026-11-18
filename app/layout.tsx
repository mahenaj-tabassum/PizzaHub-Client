import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Providers from "@/components/shared/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PizzaHub — Hot & Fresh Pizza Delivered to Your Door",
    template: "%s | PizzaHub",
  },
  description:
    "Discover local pizza shops, browse their menus, and place your order in a few taps.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
