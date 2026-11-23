import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient, type Db } from "mongodb";

/* ---------- MongoDB সংযোগ (আগের lib/mongodb.ts এর কাজ এখানে) ---------- */

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.DB_NAME?.trim();

if (!uri) throw new Error("MONGODB_URI is missing");
if (!dbName) throw new Error("DB_NAME is missing");

type MongoGlobal = typeof globalThis & {
  __pizzahubMongoClient?: MongoClient;
};

const globalMongo = globalThis as MongoGlobal;

// একই runtime-এ একটিমাত্র MongoClient পুনরায় ব্যবহার হবে
// (dev hot-reload ও serverless warm instance-এ বাড়তি কানেকশন এড়াতে)।
const client =
  globalMongo.__pizzahubMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60_000,
    serverSelectionTimeoutMS: 15_000,
    connectTimeoutMS: 15_000,
    socketTimeoutMS: 45_000,
    retryWrites: true,
  });

if (!globalMongo.__pizzahubMongoClient) {
  globalMongo.__pizzahubMongoClient = client;
}

const db: Db = client.db(dbName);

/* ---------- Better Auth ---------- */

const baseURL = (process.env.BETTER_AUTH_URL || "").trim().replace(/\/+$/, "");

if (!baseURL) throw new Error("BETTER_AUTH_URL is missing");

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
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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

              // admin কখনোই পাবলিক সাইন-আপে তৈরি হবে না
              role: validRole ? requestedRole : "customer",

              // Email signup-এ role দেওয়া থাকলে নির্বাচন সম্পন্ন।
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
