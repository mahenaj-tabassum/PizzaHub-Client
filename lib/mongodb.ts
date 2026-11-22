// lib/mongodb.ts
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) throw new Error("MONGODB_URI is missing");
if (!dbName) throw new Error("DB_NAME is missing");

type MongoGlobal = typeof globalThis & {
  __pizzahubMongoClient?: MongoClient;
};

const g = globalThis as MongoGlobal;

function createClient(): MongoClient {
  const client = new MongoClient(uri as string, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 15_000,
    connectTimeoutMS: 15_000,
    socketTimeoutMS: 45_000,
    retryWrites: true,
  });

  // Driver বন্ধ হয়ে গেলে cache মুছে দিই, যাতে পরের কলে নতুন client হয়।
  client.on("topologyClosed", () => {
    if (g.__pizzahubMongoClient === client) {
      g.__pizzahubMongoClient = undefined;
    }
  });

  return client;
}

export function getClient(): MongoClient {
  if (!g.__pizzahubMongoClient) {
    g.__pizzahubMongoClient = createClient();
  }
  return g.__pizzahubMongoClient;
}

export function getDb(): Db {
  return getClient().db(dbName);
}

// Better Auth-কে এই Db দিতে হবে। প্রতিটি কলে সচল client ব্যবহার হয়।
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(real)
      : value;
  },
});
