import type { MenuItem } from "@/types";

export const FREE_ACTIVE_LIMIT = 3;

export const isActiveItem = (item: MenuItem) =>
  (item.status === "approved" || item.status === "pending") &&
  item.isAvailable !== false;

export const countActive = (items: MenuItem[]) =>
  items.filter(isActiveItem).length;
