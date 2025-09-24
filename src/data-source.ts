import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";
import * as dotenv from "dotenv";
dotenv.config();

// Environment variables
const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
const POSTGRES_PORT = process.env.POSTGRES_PORT || "5432";
const POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "flex";
const DATABASE_URL = process.env.DATABASE_URL;

// Modern TypeORM configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  // SSL configuration for production (Render, Heroku, etc.)
  ssl: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION" ? {
    rejectUnauthorized: false
  } : false,
});

// Legacy configuration (commented out)
/*
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DATABASE || "flex",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entities/*.{js,ts}"],
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
*/