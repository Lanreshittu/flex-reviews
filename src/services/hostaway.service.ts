// src/services/hostaway.service.ts
import { AppDataSource } from "../data-source";
import { Listing } from "../entities/Listing.entity";
import { Review } from "../entities/Review.entity";
import { normalizeHostawayItem } from "../lib/normalize";
import fs from "node:fs";
import path from "node:path";

interface SeedOptions {
  mockPath?: string;
}

export const HostawayService = {
  /**
   * Upserts the provided Hostaway mock into DB (idempotent).
   * Call once (lazy) from GET /api/reviews/hostaway before querying.
   */
  async seedFromMock(opts: SeedOptions = {}) {
    // Handle both development and production paths
    let mockPath = opts.mockPath;
    if (!mockPath) {
      // Try production path first (compiled dist), then development path
      const prodPath = path.join(process.cwd(), "dist", "src", "hostaway.mock.json");
      const devPath = path.join(process.cwd(), "src", "hostaway.mock.json");
      
      console.log(`🔍 Looking for mock file in: ${prodPath}`);
      console.log(`🔍 Looking for mock file in: ${devPath}`);
      
      if (fs.existsSync(prodPath)) {
        mockPath = prodPath;
        console.log(`✅ Found mock file at: ${prodPath}`);
      } else if (fs.existsSync(devPath)) {
        mockPath = devPath;
        console.log(`✅ Found mock file at: ${devPath}`);
      } else {
        console.log("❌ No mock data file found in any location");
        console.log(`📁 Current working directory: ${process.cwd()}`);
        return;
      }
    }
    
    const raw = JSON.parse(fs.readFileSync(mockPath, "utf-8"));

    if (!raw?.result || !Array.isArray(raw.result)) {
      console.log("📝 No mock data found to seed");
      return;
    }
    
    if (raw.result.length === 0) {
      console.log("📝 Mock data is empty, skipping seed");
      return;
    }

    console.log(`🔄 Seeding ${raw.result.length} Hostaway reviews...`);

    const listingRepo = AppDataSource.getRepository(Listing);
    const reviewRepo = AppDataSource.getRepository(Review);

    for (const item of raw.result) {
      const listingName = item.listingName || "Unknown Listing";
      // 1) ensure listing exists
      let listing = await listingRepo.findOne({ where: { name: listingName } });
      if (!listing) {
        listing = listingRepo.create({ name: listingName, external_ref: listingName });
        listing = await listingRepo.save(listing);
      }

      // 2) normalize
      const n = normalizeHostawayItem(item);
      const id = `hostaway:${item.id}`;

      // 3) upsert by stable id
      const existing = await reviewRepo.findOne({ where: { id } });
      if (existing) {
        Object.assign(existing, {
          listing_id: listing.id,
          ...n,
        });
        await reviewRepo.save(existing);
      } else {
        const toCreate = reviewRepo.create({
          id,
          listing_id: listing.id,
          ...n,
        } as any);
        await reviewRepo.save(toCreate);
      }
    }
    
    console.log("✅ Hostaway reviews seeded successfully");
  },

  /**
   * Query normalized Hostaway reviews with filters + pagination.
   */
  async query(params: {
    listing?: string | undefined;
    listingId?: string | undefined;
    approved?: boolean | null;
    from?: Date | null;
    to?: Date | null;
    minRating?: number | null;
    skip: number;
    take: number;
  }) {
    const reviewRepo = AppDataSource.getRepository(Review);
    const qb = reviewRepo
      .createQueryBuilder("r")
      .innerJoinAndSelect("r.listing", "l")
      .where("r.channel = :ch", { ch: "hostaway" });

    if (params.listing) qb.andWhere("l.name = :ln", { ln: params.listing });
    if (params.listingId) qb.andWhere("r.listing_id = :lid", { lid: params.listingId });
    if (typeof params.approved === "boolean")
      qb.andWhere("r.approved = :ap", { ap: params.approved });
    if (params.from) qb.andWhere("r.submitted_at >= :f", { f: params.from });
    if (params.to) qb.andWhere("r.submitted_at <= :t", { t: params.to });
    if (typeof params.minRating === "number")
      qb.andWhere("r.rating >= :mr", { mr: params.minRating });

    qb.orderBy("r.submitted_at", "DESC").skip(params.skip).take(params.take);

    const [items, total] = await qb.getManyAndCount();

    return {
      total,
      items: items.map((r) => ({
        id: r.id,
        listingId: r.listing_id,
        listingName: r.listing?.name ?? "",
        channel: r.channel,
        type: r.type,
        status: r.status,
        rating: r.rating,
        ratingRaw: r.rating_raw,
        categories: r.categories,
        title: r.title,
        comment: r.comment,
        authorName: r.author_name,
        submittedAt: r.submitted_at.toISOString(),
        approved: r.approved,
      })),
    };
  },
};
