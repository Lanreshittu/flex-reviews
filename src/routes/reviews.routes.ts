// src/routes/reviews.routes.ts
import { Router } from "express";
import { ReviewsController } from "../controllers/reviews.controller";
const router = Router();

router.get("/", ReviewsController.list);
export default router;
