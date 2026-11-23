import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/* ---------- Environment ---------- */

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.DB_NAME?.trim();
const baseURL = (process.env.BETTER_AUTH_URL || "").trim().replace(/\/+$/, "");
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!uri) throw new Error("MONGODB_URI is missing");
if (!dbName) throw new Error("DB_NAME is missing");
if (!baseURL) throw new Error("BETTER_AUTH_URL is missing");
if (!authSecret) throw new Error("BETTER_AUTH_SECRET is missing");
if (!googleClientId || !googleClientSecret) {
  throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET is missing");
}

/* ---------- MongoDB ---------- */

const client = new MongoClient(uri, { maxPoolSize: 10 });
const db = client.db(dbName);

/* ---------- Better Auth ---------- */

const PUBLIC_ROLES = ["vendor", "customer"];

// এই ফিল্ডগুলো ক্লায়েন্ট কখনোই /update-user দিয়ে বদলাতে পারবে না
const PROTECTED_FIELDS = [
  "role",
  "roleSelected",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  baseURL,
  secret: authSecret,
  trustedOrigins: [baseURL],

  database: mongodbAdapter(db),

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true, // সাইন-আপে role পাঠানো যায়; create hook এটা যাচাই করে
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
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = (ctx.body ?? {}) as Record<string, unknown>;

      // 1. সার্ভার-সাইডে পাসওয়ার্ড নিয়ম (uppercase + lowercase)
      if (ctx.path === "/sign-up/email") {
        const password = typeof body.password === "string" ? body.password : "";

        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must contain at least one uppercase and one lowercase letter.",
          });
        }
      }

      // 2. role/plan/block ফিল্ড ক্লায়েন্ট থেকে বদলানো বন্ধ (privilege escalation রোধ)
      if (ctx.path === "/update-user") {
        const touchesProtected = PROTECTED_FIELDS.some((key) => key in body);

        if (touchesProtected) {
          throw new APIError("FORBIDDEN", {
            message: "You are not allowed to change this field.",
          });
        }
      }
    }),
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
