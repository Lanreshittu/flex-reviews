// src/entity/Listing.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./Review";

@Entity({ name: "listings" })
export class Listing {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  external_ref!: string | null;

  @Column({ type: "jsonb", nullable: true })
  channel_keys!: Record<string, any> | null;

  @OneToMany(() => Review, (r) => r.listing)
  reviews!: Review[];

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
