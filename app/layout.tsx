import { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "PizzaHub — Hot & Fresh Pizza Delivered",
  description:
    "Discover local pizza shops, browse menus, and place your order in a few taps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${fraunces.variable} ${dmSans.variable}`} lang="en">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
