// src/routes/google.routes.ts
import { Router } from "express";
import { GoogleController } from "../controllers/google.controller";

const router = Router();

/**
 * Seed mock Google reviews for development
 */
router.post("/seed", GoogleController.seed);

/**
 * Fetch reviews from Google Places API
 */
router.get("/places/:placeId", GoogleController.fetch);

export default router;
