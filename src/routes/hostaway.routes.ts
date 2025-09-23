// src/routes/hostaway.routes.ts
import { Router } from "express";
import { HostawayController } from "../controllers/hostaway.controller";
const router = Router();

/**
 * REQUIRED BY THE ASSESSMENT:
 * GET /api/reviews/hostaway → returns normalized, filterable Hostaway reviews.
 */
router.get("/", HostawayController.get);

export default router;
