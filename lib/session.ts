import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/constants";
import type { UserRole } from "@/types";

/**
 * Get the currently authenticated user session.
 *
 * This function must run in a request context because it reads
 * the incoming request headers.
 */
export const getSession = cache(async () => {
  const requestHeaders = await headers();

  return await auth.api.getSession({
    headers: requestHeaders,
  });
});

/**
 * Require an authenticated user.
 *
 * Redirects:
 * - Unauthenticated users → /signin
 * - Blocked users → /blocked
 * - Users who have not selected a role → /redirect
 */
export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  if (session.user.roleSelected === false) {
    redirect("/redirect");
  }

  return session.user;
}

/**
 * Require a specific user role.
 *
 * Users with a different role are redirected
 * to their appropriate dashboard.
 */
export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (user.role !== role) {
    redirect(getDashboardPath(user.role));
  }

  return user;
}
