export type MenuItem = {
  _id: string;
  itemName: string;
  category: string; // slug of CATEGORIES
  description?: string;
  price: number;
  location: string;
  images: string[];
  vendor: {
    name: string;
    isPremium: boolean;
  };
};
