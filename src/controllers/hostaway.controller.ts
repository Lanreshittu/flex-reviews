// src/controllers/hostaway.controller.ts
import { Request, Response } from "express";
import { HostawayService } from "../services/hostaway.service";
import { parsePagination } from "../lib/filters";

export const HostawayController = {
  get: async (req: Request, res: Response) => {
    // 1) idempotent seed from mock on first call
    await HostawayService.seedFromMock();

    // 2) parse filters
    const { page, pageSize, skip } = parsePagination(req.query);
    const listing = (req.query.listing as string) || undefined;
    const listingId = (req.query.listingId as string) || undefined;
    const approved =
      typeof req.query.approved === "string"
        ? req.query.approved === "true"
        : undefined;
    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;

    // 3) query normalized data
    const { total, items } = await HostawayService.query({
      listing: listing || undefined,
      listingId: listingId || undefined,
      approved: typeof approved === "boolean" ? approved : null,
      from: from || null,
      to: to || null,
      minRating: typeof minRating === "number" ? minRating : null,
      skip,
      take: pageSize,
    });

    // 4) response
    res.json({ ok: true, page, pageSize, total, items });
  },
};
