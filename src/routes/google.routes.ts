import { Router } from "express";
import { GoogleController } from "../controllers/google.controller";

const router = Router();

// Google Reviews routes
router.get("/reviews", GoogleController.getReviews);
router.post("/sync", GoogleController.syncReviews);
router.get("/test", GoogleController.testConnection);

export default router;