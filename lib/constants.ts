export const CATEGORIES = [
  { label: "Classic Pizzas", short: "Classic", slug: "classic" },
  { label: "Vegetarian Pizzas", short: "Vegetarian", slug: "vegetarian" },
  { label: "Meat Lovers", short: "Meat Lovers", slug: "meat-lovers" },
  { label: "Gourmet Pizzas", short: "Gourmet", slug: "specialty" },
  { label: "Sides & Appetizers", short: "Sides", slug: "sides" },
  { label: "Beverages & Desserts", short: "Drinks", slug: "drinks" },
];

export const getCategoryLabel = (slug: string) =>
  CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;

const IMAGE_EXT = "svg";

export const getCategoryImage = (slug: string) =>
  `/categories/${slug}.${IMAGE_EXT}`;
