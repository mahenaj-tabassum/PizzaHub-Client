import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not configured");
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL is not configured");
}

// শেষের "/" বাদ দেওয়া হলো, যাতে সার্ভারের issuer/audience এর সাথে সবসময় মেলে
const authUrl = process.env.BETTER_AUTH_URL.replace(/\/+$/, "");

// Reuse one MongoClient across hot reloads and serverless invocations.
// Short timeouts make a failed connection fail fast instead of hanging 30s.
const globalForMongo = globalThis as unknown as {
  _pizzaHubMongo?: MongoClient;
};

const client =
  globalForMongo._pizzaHubMongo ??
  new MongoClient(mongoUri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxIdleTimeMS: 30000,
  });

globalForMongo._pizzaHubMongo = client;

const db = client.db(process.env.DB_NAME || "PizzaHub-FullStack");

// Production domain + local dev (duplicates and empty values removed)
const trustedOrigins = Array.from(
  new Set(
    [
      authUrl,
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, ""),
      "http://localhost:3000",
    ].filter((origin): origin is string => Boolean(origin)),
  ),
);

export const auth = betterAuth({
  appName: "PizzaHub",

  baseURL: authUrl,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  database: mongodbAdapter(db, { client }),

  plugins: [
    jwt({
      jwt: {
        issuer: authUrl,
        audience: authUrl,
        expirationTime: "15m",
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },

      // ইমেইল সাইন-আপে ফর্ম থেকে আসে। Google এ আসে না।
      requestedRole: {
        type: "string",
        required: false,
        input: true,
        returned: false,
      },

      // false = রোল এখনো বেছে নেওয়া হয়নি (নতুন Google ইউজার)
      // true/undefined = রোল ঠিক করা আছে
      roleSelected: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
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

      businessName: {
        type: "string",
        required: false,
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const password = String(ctx.body?.password ?? "");

      if (
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be at least 6 characters with one uppercase and one lowercase letter.",
        });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // requestedRole আলাদা করে ফেলা হলো, যাতে ডাটাবেসে null হয়ে সেভ না হয়
          const { requestedRole, ...rest } = user as typeof user & {
            requestedRole?: string;
          };

          // শুধু "vendor" বা "customer" গ্রহণযোগ্য। Admin এখানে কখনোই নয়।
          const choseRole =
            requestedRole === "vendor" || requestedRole === "customer";

          return {
            data: {
              ...rest,
              role: requestedRole === "vendor" ? "vendor" : "customer",
              // ইমেইল সাইন-আপ: রোল বাছাই হয়ে গেছে। Google: এখনো হয়নি।
              roleSelected: choseRole,
            },
          };
        },
      },
    },
  },
});