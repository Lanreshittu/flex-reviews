import { Router } from "express";
import { PropertyController } from "../controllers/property.controller";

const router = Router();

/**
 * Get all properties with summary stats
 */
router.get("/", PropertyController.list);

/**
 * Get detailed performance metrics for a property
 */
router.get("/:id/performance", PropertyController.getPerformance);

/**
 * Get trend analysis for a property
 */
router.get("/:id/trends", PropertyController.getTrends);

export default router;
