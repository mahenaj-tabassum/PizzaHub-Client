// lib/mongodb.ts

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) throw new Error("MONGODB_URI is missing");
if (!dbName) throw new Error("DB_NAME is missing");

type MongoGlobal = typeof globalThis & {
  __pizzahubMongoClient?: MongoClient;
};

const globalMongo = globalThis as MongoGlobal;

const client =
  globalMongo.__pizzahubMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    retryWrites: true,
  });

globalMongo.__pizzahubMongoClient = client;

export const db = client.db(dbName);

export default db;
