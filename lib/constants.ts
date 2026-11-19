export const CATEGORIES = [
  { label: "Classic Pizzas", short: "Classic", slug: "classic" },
  { label: "Vegetarian Pizzas", short: "Vegetarian", slug: "vegetarian" },
  { label: "Meat Lovers", short: "Meat Lovers", slug: "meat-lovers" },
  { label: "Sides & Appetizers", short: "Sides", slug: "sides" },
  { label: "Beverages & Desserts", short: "Drinks", slug: "drinks" },
];

const IMAGE_EXT = "jpg";

export const getCategoryImage = (slug: string) =>
  `/images/categories/${slug}.${IMAGE_EXT}`;
