import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/constants";
import type { UserRole } from "@/types";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function requireUser() {
  const session = await getSession();

  if (!session) redirect("/signin");
  if (session.user.isBlocked) redirect("/blocked");

  return session.user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (user.role !== role) redirect(getDashboardPath(user.role));

  return user;
}
