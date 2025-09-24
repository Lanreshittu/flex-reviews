import "reflect-metadata";
import { DataSource } from "typeorm";
import { Listing } from "./entity/Listing";
import { Review } from "./entity/Review";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DATABASE || "flex",
  synchronize: true,
  logging: false, // Disable SQL query logging
  entities: [__dirname + "/entity/*.{js,ts}"],
  migrations: ["dist/migration/*.js"],
  // SSL configuration for Render databases
  ssl: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION" ? {
    rejectUnauthorized: false
  } : false,
  extra: {
    ssl: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION" ? {
      rejectUnauthorized: false
    } : undefined,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20,
    min: 5,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
});
