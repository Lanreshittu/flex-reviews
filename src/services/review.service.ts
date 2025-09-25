// src/services/review.service.ts
import { initializeDataSource } from "../data-source";
import { Review } from "../entities/Review.entity";

export const ReviewService = {
  async search(params: {
    listingId?: string;
    channel?: string;
    approved?: boolean | null;
    q?: string | null;
    from?: Date | null;
    to?: Date | null;
    sort?: "date_desc" | "rating_desc" | "rating_asc";
    skip: number;
    take: number;
  }) {
    const ds = await initializeDataSource();
    const repo = ds.getRepository(Review);
    const qb = repo
      .createQueryBuilder("r")
      .innerJoinAndSelect("r.listing", "l");

    if (params.listingId) qb.andWhere("r.listing_id = :lid", { lid: params.listingId });
    if (params.channel) qb.andWhere("r.channel = :ch", { ch: params.channel });
    if (typeof params.approved === "boolean")
      qb.andWhere("r.approved = :ap", { ap: params.approved });
    if (params.q) qb.andWhere("r.comment ILIKE :q", { q: `%${params.q}%` });
    if (params.from) qb.andWhere("r.submitted_at >= :f", { f: params.from });
    if (params.to) qb.andWhere("r.submitted_at <= :t", { t: params.to });

    if (params.sort === "rating_desc") qb.orderBy("r.rating", "DESC");
    else if (params.sort === "rating_asc") qb.orderBy("r.rating", "ASC");
    else qb.orderBy("r.submitted_at", "DESC");

    qb.skip(params.skip).take(params.take);

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

  async setApproval(id: string, approved: boolean) {
    const ds = await initializeDataSource();
    const repo = ds.getRepository(Review);
    const review = await repo.findOne({ where: { id } });
    if (!review) throw new Error("review_not_found");
    review.approved = approved;
    await repo.save(review);
    return { id: review.id, approved: review.approved };
  },
};
