// src/controllers/admin.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";

export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.header("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  next();
}

export const AdminController = {
  approve: async (req: Request, res: Response) => {
    const { approved } = req.body as { approved: boolean };
    const reviewId = req.params.id;
    if (!reviewId) {
      return res.status(400).json({ ok: false, error: "Review ID is required" });
    }
    const result = await ReviewService.setApproval(reviewId, !!approved);
    res.json({ ok: true, ...result });
  },
};
