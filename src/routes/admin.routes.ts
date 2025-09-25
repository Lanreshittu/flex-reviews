// src/routes/admin.routes.ts
import { Router } from "express";
import { AdminController, requireAdminKey } from "../controllers/admin.controller";
const router = Router();

// Authentication endpoint (no middleware required)
router.post("/authenticate", AdminController.authenticate);

// Protected routes (require admin key)
router.use(requireAdminKey);
router.patch("/reviews/:id/approve", AdminController.approve);

export default router;
