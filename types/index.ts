/* ---------- Common Types ---------- */

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

/* ---------- Menu Items ---------- */

export type VendorInfo = {
  name: string;
  businessName: string;
  image: string | null;
  isPremium: boolean;
};

export type MenuItem = {
  _id: string;
  vendorId: string;

  itemName: string;
  category: string;
  description?: string;

  price: number;
  location: string;
  images: string[];

  status: MenuItemStatus;
  isAvailable: boolean;

  vendorInfo?: VendorInfo | null;

  createdAt: string;
  updatedAt?: string;
};

/* ---------- Pagination ---------- */

export type Pagination = {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ---------- Menu API Response ---------- */

export interface MenuListResponse {
  success: boolean;
  message: string;
  data: MenuItem[];
  pagination: Pagination;
}

export interface SingleMenuItemResponse {
  success: boolean;
  message: string;
  data: MenuItem;
}

export interface FeaturedMenuResponse {
  success: boolean;
  message: string;
  data: MenuItem[];
}

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

  amount: number;
  currency: string;

  stripeSessionId: string;
  stripeSubscriptionId?: string;

  status: TransactionStatus;

  createdAt: string;
}

/* ---------- Vendor dashboard ---------- */

export type CustomerInfo = {
  name: string;
  email: string;
  image?: string | null;
};

export interface VendorOrder extends Order {
  // customer এর রেকর্ড না পেলে null
  customerInfo?: CustomerInfo | null;
}

export interface VendorStats {
  totalItems: number;
  activeItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
}

/* ---------- Admin dashboard ---------- */

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;

  usersByRole?: { vendors: number; customers: number; admins: number };
  itemsByStatus: {
    pending: number;
    approved: number;
    rejected: number;
    inactive: number;
  };
  ordersByStatus?: {
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
  };
  revenueByMonth: { month: string; revenue: number; payments: number }[];
  revenueLastMonths?: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
}

export type AdminPartyInfo = {
  name?: string;
  email?: string;
  businessName?: string;
  image?: string | null;
};

export type AdminItem = Omit<MenuItem, "vendorInfo" | "isAvailable"> & {
  isAvailable?: boolean;
  vendorInfo?: AdminPartyInfo | null;
};

export interface AdminTransaction {
  _id: string;
  vendorId: string;
  plan: "premium";
  amount: number; // cents
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  status: TransactionStatus;
  createdAt: string;
  vendorInfo?: AdminPartyInfo | null;
}
