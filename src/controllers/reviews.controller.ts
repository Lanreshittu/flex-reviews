// src/controllers/reviews.controller.ts
import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { parsePagination } from "../lib/filters";

export const ReviewsController = {
  list: async (req: Request, res: Response) => {
    const { page, pageSize, skip } = parsePagination(req.query as any);
    const channel = (req.query.channel as string) || undefined;
    const approved =
      typeof req.query.approved === "string"
        ? req.query.approved === "true"
        : undefined;
    const listingId = (req.query.listingId as string) || undefined;
    const q = (req.query.q as string) || undefined;
    const sort = (req.query.sort as any) || "date_desc";
    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;

    const { total, items } = await ReviewService.search({
      listingId,
      channel,
      approved: typeof approved === "boolean" ? approved : null,
      q: q || null,
      from: from || null,
      to: to || null,
      sort,
      skip,
      take: pageSize,
    });

    res.json({ ok: true, page, pageSize, total, items });
  },
};
