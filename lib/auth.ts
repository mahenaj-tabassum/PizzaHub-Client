import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

const client = new MongoClient(mongoUri);

const db = client.db(process.env.DB_NAME || "PizzaHub-FullStack");

export const auth = betterAuth({
  appName: "PizzaHub",

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],

  database: mongodbAdapter(db, { client }),

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.BETTER_AUTH_URL,
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        required: false,
        defaultValue: "customer",
        input: false,
      },

      requestedRole: {
        type: ["customer", "vendor"],
        required: false,
        input: true,
        returned: false,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },

      subscriptionPlan: {
        type: ["free", "premium"],
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.requestedRole === "vendor" ? "vendor" : "customer";

          return {
            data: {
              ...user,
              role,
              requestedRole: undefined,
            },
          };
        },
      },
    },
  },
});
