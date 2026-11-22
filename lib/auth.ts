import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "./mongodb";

const baseURL = (process.env.BETTER_AUTH_URL || "").replace(/\/+$/, "");

if (!baseURL) throw new Error("BETTER_AUTH_URL is missing");

const PUBLIC_ROLES = ["vendor", "customer"];

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],

  database: mongodbAdapter(db),

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },

      roleSelected: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },

      businessName: {
        type: "string",
        required: false,
        input: true,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },

      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = (user as { role?: string }).role;

          const validRole = PUBLIC_ROLES.includes(requestedRole ?? "");

          return {
            data: {
              ...user,

              role: validRole ? requestedRole : "customer",

              // Email signup-এ role দেওয়া থাকলে নির্বাচন সম্পন্ন।
              // Google signup-এ role না থাকলে পরে নির্বাচন করতে হবে।
              roleSelected: validRole,

              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "1h",
      },
    }),

    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
