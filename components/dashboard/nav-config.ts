import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  Plus,
  Receipt,
  ShoppingBag,
  UserRound,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  vendor: [
    {
      label: "Overview",
      href: "/dashboard/vendor",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Menu Items",
      href: "/dashboard/vendor/items",
      icon: UtensilsCrossed,
    },
    { label: "Add Menu Item", href: "/dashboard/vendor/add-item", icon: Plus },
    {
      label: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: ClipboardList,
    },
    {
      label: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: Crown,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/vendor/profile",
      icon: UserRound,
    },
  ],
  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Menu Items",
      href: "/dashboard/admin/items",
      icon: UtensilsCrossed,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};
