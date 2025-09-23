// src/lib/filters.ts
export type ReviewQuery = {
    listing?: string;      // listing name
    listingId?: string;    // listing uuid
    approved?: string;     // "true" | "false"
    channel?: string;
    q?: string;            // search in comment
    from?: string;         // ISO date
    to?: string;           // ISO date
    minRating?: string;    // number
    sort?: "date_desc" | "rating_desc" | "rating_asc";
    page?: string;
    pageSize?: string;
  };
  
  export function parsePagination(q: ReviewQuery) {
    const page = Math.max(parseInt(q.page || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(q.pageSize || "50", 10), 1), 200);
    const skip = (page - 1) * pageSize;
    return { page, pageSize, skip };
  }
