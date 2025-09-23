// src/entity/Review.ts
import { Entity, PrimaryColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Listing } from "./Listing";

@Entity({ name: "reviews" })
@Index(["listing_id", "approved", "channel"])
@Index(["submitted_at"])
export class Review {
  @PrimaryColumn({ type: "text" })
  id!: string; // e.g., "hostaway:7453"

  @Column({ type: "uuid" })
  listing_id!: string;

  @ManyToOne(() => Listing, (l: Listing) => l.reviews, { onDelete: "CASCADE" })
  @JoinColumn({ name: "listing_id" })
  listing!: Listing;

  @Column({ type: "text" })
  channel!: "hostaway" | "google";

  @Column({ type: "text" })
  type!: "host-to-guest" | "public";

  @Column({ type: "text" })
  status!: "published" | "hidden" | "pending";

  @Column({ type: "numeric", nullable: true })
  rating!: number | null;

  @Column({ type: "numeric", nullable: true })
  rating_raw!: number | null;

  @Column({ type: "jsonb", nullable: true })
  categories!: Record<string, number> | null;

  @Column({ type: "text", nullable: true })
  title!: string | null;

  @Column({ type: "text", default: "" })
  comment!: string;

  @Column({ type: "text", nullable: true })
  author_name!: string | null;

  @Column({ type: "timestamptz" })
  submitted_at!: Date;

  @Column({ type: "boolean", default: false })
  approved!: boolean;

  @Column({ type: "jsonb", nullable: true })
  source_meta!: Record<string, any> | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
