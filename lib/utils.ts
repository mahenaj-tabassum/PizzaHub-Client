import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MenuItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Transaction amount: smallest unit (cents) → readable currency
export function formatAmount(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getVendorName(item: Pick<MenuItem, "vendorInfo">) {
  return (
    item.vendorInfo?.businessName || item.vendorInfo?.name || "Local restaurant"
  );
}

// "2026-11-24" → "Tue, 24 Nov 2026" (date-only স্ট্রিং লোকাল সময়ে পড়া হয়, তাই দিন সরে যায় না)
export function formatLongDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// "2026-11-24" → "24 Nov 2026"
export function formatShortDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getSnapshotVendorName(v?: {
  name?: string;
  businessName?: string;
}) {
  return v?.businessName || v?.name || "Restaurant";
}
