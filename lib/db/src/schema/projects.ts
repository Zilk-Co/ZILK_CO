import { pgTable, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey(),
  index: integer("index").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  year: text("year").notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull(),
  overview: jsonb("overview").$type<[string, string]>().notNull(),
  challenge: text("challenge").notNull(),
  challengeQuote: text("challenge_quote").notNull(),
  solution: text("solution").notNull(),
  solutionPoints: jsonb("solution_points").$type<string[]>().notNull(),
  features: jsonb("features")
    .$type<{ number: string; title: string; description: string }[]>()
    .notNull(),
  tech: jsonb("tech").$type<string[]>().notNull(),
  status: text("status").notNull(),
  url: text("url").notNull(),
  image: text("image").notNull(),
  imagePosition: text("image_position").notNull(),
  featured: boolean("featured").notNull(),
  accentHue: integer("accent_hue").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
