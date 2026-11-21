export const CATEGORIES = [
  {
    label: "Classic Pizzas",
    short: "Classic",
    slug: "classic",
    value: "Classic Pizzas",
  },
  {
    label: "Vegetarian Pizzas",
    short: "Vegetarian",
    slug: "vegetarian",
    value: "Vegetarian Pizzas",
  },
  {
    label: "Meat Lovers",
    short: "Meat Lovers",
    slug: "meat-lovers",
    value: "Meat Lovers",
  },
  {
    label: "Gourmet Pizzas",
    short: "Gourmet",
    slug: "specialty",
    value: "Specialty / Gourmet Pizzas",
  },
  {
    label: "Sides & Appetizers",
    short: "Sides",
    slug: "sides",
    value: "Sides & Appetizers",
  },
  {
    label: "Beverages & Desserts",
    short: "Drinks",
    slug: "drinks",
    value: "Beverages & Desserts",
  },
];

// সার্ভারে সেভ হওয়া category (value) থেকে label বের করে
export const getCategoryLabel = (value: string) =>
  CATEGORIES.find((c) => c.value === value || c.slug === value)?.label ?? value;

const IMAGE_EXT = "svg";

export const getCategoryImage = (slug: string) =>
  `/categories/${slug}.${IMAGE_EXT}`;
