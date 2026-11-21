import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  // Better Auth runs inside this Next.js app, so the current origin is correct.
  // Only set baseURL when it is explicitly configured.
  ...(process.env.NEXT_PUBLIC_APP_URL && {
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
  }),

  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
