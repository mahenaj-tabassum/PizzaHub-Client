"use client";

import { apiFetch } from "@/lib/api";

const patch = (path: string, body?: unknown) =>
  apiFetch(path, {
    method: "PATCH",
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

export const approveItem = (id: string) =>
  patch(`/api/admin/items/${id}/approve`);
export const rejectItem = (id: string) =>
  patch(`/api/admin/items/${id}/reject`);
export const setItemStatus = (id: string, status: "approved" | "inactive") =>
  patch(`/api/admin/items/${id}/status`, { status });
export const deleteItem = (id: string) =>
  apiFetch(`/api/admin/items/${id}`, { method: "DELETE" });

export const blockUser = (id: string) => patch(`/api/admin/users/${id}/block`);
export const unblockUser = (id: string) =>
  patch(`/api/admin/users/${id}/unblock`);
