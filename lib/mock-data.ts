import type { MenuItem } from "@/types";

const base = {
  status: "approved" as const,
  isAvailable: true,
  createdAt: "2026-11-20T10:00:00.000Z",
};

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    ...base,
    _id: "mock-1",
    vendorId: "vendor-1",
    itemName: "Margherita Classica",
    category: "classic",
    description:
      "Traditional Italian pizza topped with fresh mozzarella, basil, and homemade tomato sauce.",
    price: 12.5,
    location: "Agrabad, Chattogram",
    images: [],
    vendorInfo: {
      name: "Nonna's Kitchen",
      businessName: "Nonna's Kitchen",
      image: null,
      isPremium: true,
    },
  },
  {
    ...base,
    _id: "mock-2",
    vendorId: "vendor-2",
    itemName: "Garden Fresh Veggie",
    category: "vegetarian",
    description:
      "A delicious vegetarian pizza with bell peppers, mushrooms, onions, olives, and mozzarella.",
    price: 14.99,
    location: "GEC Circle, Chattogram",
    images: [],
    vendorInfo: {
      name: "Sarah Ahmed",
      businessName: "Green Oven Pizza",
      image: null,
      isPremium: false,
    },
  },
  {
    ...base,
    _id: "mock-3",
    vendorId: "vendor-3",
    itemName: "Ultimate Meat Lovers",
    category: "meat-lovers",
    description:
      "Loaded with pepperoni, beef sausage, grilled chicken, bacon, and extra mozzarella cheese.",
    price: 18.5,
    location: "Khulshi, Chattogram",
    images: [],
    vendorInfo: {
      name: "Michael Rahman",
      businessName: "The Meat House",
      image: null,
      isPremium: true,
    },
  },
  {
    ...base,
    _id: "mock-4",
    vendorId: "vendor-4",
    itemName: "BBQ Chicken Supreme",
    category: "specialty",
    description:
      "Smoky BBQ chicken pizza with red onions, mozzarella, fresh cilantro, and BBQ sauce.",
    price: 17.99,
    location: "Nasirabad, Chattogram",
    images: [],
    vendorInfo: {
      name: "David Chowdhury",
      businessName: "Fire Crust Pizza",
      image: null,
      isPremium: true,
    },
  },
  {
    ...base,
    _id: "mock-5",
    vendorId: "vendor-5",
    itemName: "Garlic Cheese Bread",
    category: "sides",
    description:
      "Freshly baked garlic bread topped with melted mozzarella, parmesan, and Italian herbs.",
    price: 6.5,
    location: "Panchlaish, Chattogram",
    images: [],
    vendorInfo: {
      name: "Emma's Kitchen",
      businessName: "Emma's Kitchen",
      image: null,
      isPremium: false,
    },
  },
  {
    ...base,
    _id: "mock-6",
    vendorId: "vendor-6",
    itemName: "Classic Chocolate Milkshake",
    category: "drinks",
    description:
      "A rich and creamy chocolate milkshake made with premium chocolate and fresh milk.",
    price: 5.99,
    location: "Halishahar, Chattogram",
    images: [],
    vendorInfo: {
      name: "Oliver's Cafe",
      businessName: "Oliver's Cafe",
      image: null,
      isPremium: false,
    },
  },
];
