import type { UserRole } from "@/types";

export const CATEGORIES = [
  { label: "Classic Pizzas", short: "Classic", slug: "classic" },
  { label: "Vegetarian Pizzas", short: "Vegetarian", slug: "vegetarian" },
  { label: "Meat Lovers", short: "Meat Lovers", slug: "meat-lovers" },
  {
    label: "Specialty / Gourmet Pizzas",
    short: "Gourmet",
    slug: "specialty",
  },
  { label: "Sides & Appetizers", short: "Sides", slug: "sides" },
  { label: "Beverages & Desserts", short: "Drinks", slug: "drinks" },
];

export const getCategoryLabel = (slug: string) =>
  CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;

const IMAGE_EXT = "svg";

export const getCategoryImage = (slug: string) =>
  `/categories/${slug}.${IMAGE_EXT}`;

export const getDashboardPath = (role?: string | null) => {
  switch (role as UserRole) {
    case "vendor":
      return "/dashboard/vendor";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/dashboard/customer";
  }
};

export const PREMIUM_PLAN = {
  price: "$9.99",
  interval: "month",
};
