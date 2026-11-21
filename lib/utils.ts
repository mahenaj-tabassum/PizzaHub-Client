import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MenuItem } from "@/types"

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
