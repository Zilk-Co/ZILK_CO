import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  category: text("category").notNull(),
  content: jsonb("content").$type<string[]>().notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Post = typeof postsTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
