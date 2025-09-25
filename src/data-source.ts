import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";
import * as dotenv from "dotenv";
import { Listing } from "./entities/Listing.entity";
import { Review } from "./entities/Review.entity";

dotenv.config();

// Environment variables
const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
const POSTGRES_PORT = process.env.POSTGRES_PORT || "5432";
const POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "flex";
const DATABASE_URL = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",

  // ✅ Explicit entity imports for production compatibility
  entities: [Listing, Review],
  migrations: [join(__dirname, "**/*.migration.{js,ts}")],
  subscribers: [join(__dirname, "**/*.subscriber.{js,ts}")],

  // ✅ SSL required on Vercel/Render
  ssl:
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "PRODUCTION"
      ? { rejectUnauthorized: false }
      : false,

  // ✅ Use DATABASE_URL if provided (Render/Vercel)
  ...(DATABASE_URL && { url: DATABASE_URL }),
});

// ✅ Helper to prevent multiple initializations in serverless
export const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};


