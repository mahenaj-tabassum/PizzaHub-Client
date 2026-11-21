export type UserRole = "customer" | "vendor" | "admin";

export type SubscriptionPlan = "free" | "premium";

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive";

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type TransactionStatus = "pending" | "completed" | "failed" | "expired";

/* ---------- Users ---------- */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  subscriptionStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ---------- Menu items ---------- */
export type MenuItemVendor = {
  name: string;
  businessName?: string;
  image?: string | null;
  isPremium: boolean;
};

export type MenuItem = {
  _id: string;
  vendorId: string;

  itemName: string;
  category: string; // সার্ভারে label হিসেবে সেভ হয়, যেমন "Meat Lovers"
  description?: string;
  price: number;
  location: string;
  images: string[];

  status: MenuItemStatus;
  isAvailable: boolean;

  // API response দেখে চূড়ান্ত করা হবে
  vendor?: MenuItemVendor;

  createdAt: string;
  updatedAt?: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ---------- Orders ---------- */
export type ItemSnapshot = {
  itemName: string;
  category: string;
  price: number;
  images: string[];
  location: string;
};

export type VendorSnapshot = {
  name: string;
  businessName?: string;
  image?: string | null;
};

export interface Order {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;

  itemSnapshot: ItemSnapshot;
  vendorSnapshot: VendorSnapshot;

  deliveryDate: string;
  deliveryAddress: string;
  message?: string;

  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

/* ---------- Transactions ---------- */
export interface Transaction {
  _id: string;
  vendorId: string;
  plan: "premium";
  amount: number; // সবচেয়ে ছোট একক (cents/poisha), দেখানোর সময় ÷ 100
  currency: string;
  stripeSessionId: string;
  status: TransactionStatus;
  createdAt: string;
}
