export type MenuItemStatus = "pending" | "approved" | "rejected";

export type MenuItem = {
  _id: string;
  vendorId: string;

  itemName: string;
  category: string;
  description?: string;
  price: number;
  location: string;
  images: string[];

  isAvailable: boolean;
  isFeatured: boolean;

  status: MenuItemStatus;

  vendor?: {
    name: string;
    isPremium: boolean;
  };

  createdAt: string;
  updatedAt?: string;
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Order {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;

  deliveryDate: string;
  deliveryAddress: string;
  message?: string;

  status: OrderStatus;
  createdAt: string;
}
