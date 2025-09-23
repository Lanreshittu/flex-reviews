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
  entities: [Listing, Review],
  migrations: ["dist/migration/*.js"],
  // Add connection options for better compatibility
  extra: {
    trustServerCertificate: true,
  },
});
