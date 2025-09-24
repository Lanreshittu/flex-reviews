import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

/**
 * Get cross-property analytics overview
 */
router.get("/overview", AnalyticsController.getOverview);

/**
 * Get performance comparison between properties
 */
router.get("/comparison", AnalyticsController.getComparison);

/**
 * Get insights and recommendations
 */
router.get("/insights", AnalyticsController.getInsights);

export default router;
