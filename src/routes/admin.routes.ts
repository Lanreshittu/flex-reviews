// src/routes/admin.routes.ts
import { Router } from "express";
import { AdminController, requireAdminKey } from "../controllers/admin.controller";
const router = Router();

router.use(requireAdminKey);
router.patch("/reviews/:id/approve", AdminController.approve);

export default router;
