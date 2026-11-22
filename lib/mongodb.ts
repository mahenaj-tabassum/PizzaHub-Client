import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

if (!dbName) {
  throw new Error("DB_NAME is missing");
}

type MongoGlobal = typeof globalThis & {
  __pizzahubMongoClient?: MongoClient;
  __pizzahubMongoDb?: Db;
};

const globalMongo = globalThis as MongoGlobal;

// একই server runtime-এ একটি MongoClient পুনরায় ব্যবহার হবে।
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

// Proxy নয়, সরাসরি আসল Db instance।
export const db = globalMongo.__pizzahubMongoDb ?? client.db(dbName);

if (!globalMongo.__pizzahubMongoDb) {
  globalMongo.__pizzahubMongoDb = db;
}

export default db;
