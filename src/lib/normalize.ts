// src/lib/normalize.ts
export type ReviewCategoryKey =
  | "cleanliness"
  | "communication"
  | "location"
  | "value"
  | "respect_house_rules"
  | "accuracy"
  | "checkin"
  | "other";

const categoryMap: Record<string, ReviewCategoryKey> = {
  cleanliness: "cleanliness",
  communication: "communication",
  respect_house_rules: "respect_house_rules",
  location: "location",
  value: "value",
  accuracy: "accuracy",
  checkin: "checkin",
};

export const toFiveScale = (raw: number) =>
  Math.round(((raw / 10) * 5)) // 1–10 → 1–5 (nearest 0.5)

export function normalizeHostawayItem(r: any) {
  const categories: Record<string, number> = {};
  if (Array.isArray(r.reviewCategory)) {
    for (const c of r.reviewCategory) {
      const key = categoryMap[c.category] ?? "other";
      categories[key] = toFiveScale(c.rating);
    }
  }
  return {
    // id and listingName are completed in the service (needs listing uuid)
    channel: "hostaway" as const,
    type: (r.type === "host-to-guest" ? "host-to-guest" : "public") as "host-to-guest" | "public",
    status: (r.status ?? "published") as "published" | "hidden" | "pending",
    rating: r.rating == null ? null : toFiveScale(r.rating),
    rating_raw: r.rating ?? null,
    categories: Object.keys(categories).length ? categories : null,
    title: null as string | null,
    comment: r.publicReview ?? "",
    author_name: r.guestName ?? null,
    submitted_at: new Date(r.submittedAt.replace(" ", "T") + "Z"),
    source_meta: { raw: r },
  };
}

export function normalizeGoogleReview(r: any) {
  return {
    channel: "google" as const,
    type: "public" as const,
    status: "published" as const,
    rating: r.rating || null,
    rating_raw: r.rating || null,
    categories: null,
    title: null as string | null,
    comment: r.text || "",
    author_name: r.author_name || null,
    submitted_at: new Date(r.time * 1000),
    source_meta: { raw: r },
  };
}
