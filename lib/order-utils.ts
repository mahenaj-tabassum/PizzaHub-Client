import { todayString } from "@/lib/validations";
import type { Order } from "@/types";

export function countByStatus(orders: Order[]) {
  const counts = {
    total: orders.length,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  };
  orders.forEach((o) => {
    counts[o.status] += 1;
  });
  return counts;
}

export function lastSixMonths(orders: Order[]) {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      value: 0,
    };
  });

  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const month = months.find(
      (m) => m.key === `${d.getFullYear()}-${d.getMonth()}`,
    );
    if (month) month.value += 1;
  });

  return months.map(({ label, value }) => ({ label, value }));
}

/** আজ বা পরের তারিখের সবচেয়ে কাছের Accepted অর্ডার */
export function findNextDelivery(orders: Order[]) {
  const today = todayString();

  return (
    orders
      .filter(
        (o) => o.status === "accepted" && o.deliveryDate.slice(0, 10) >= today,
      )
      .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))[0] ?? null
  );
}
