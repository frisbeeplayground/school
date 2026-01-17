import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  primaryColor: text("primary_color").notNull().default("#1e40af"),
  secondaryColor: text("secondary_color").notNull().default("#3b82f6"),
});

export const schoolsRelations = relations(schools, ({ many }) => ({
  sections: many(pageSections),
  notices: many(notices),
}));

export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

// Page Sections table
export const pageSections = pgTable("page_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  pageSlug: text("page_slug").notNull().default("home"),
  type: text("type").notNull(),
  position: integer("position").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  props: jsonb("props").notNull().default({}),
  environment: text("environment").notNull().default("sandbox"),
  status: text("status").notNull().default("draft"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pageSectionsRelations = relations(pageSections, ({ one }) => ({
  school: one(schools, {
    fields: [pageSections.schoolId],
    references: [schools.id],
  }),
}));

export const insertPageSectionSchema = createInsertSchema(pageSections).omit({ id: true, updatedAt: true });
export type InsertPageSection = z.infer<typeof insertPageSectionSchema>;
export type PageSection = typeof pageSections.$inferSelect;

// Notices table
export const notices = pgTable("notices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url"),
  pinned: boolean("pinned").notNull().default(false),
  environment: text("environment").notNull().default("sandbox"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedBy: varchar("updated_by"),
});

export const noticesRelations = relations(notices, ({ one }) => ({
  school: one(schools, {
    fields: [notices.schoolId],
    references: [schools.id],
  }),
}));

export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true, createdAt: true });
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof notices.$inferSelect;

// Types for frontend
export type Environment = "sandbox" | "live";
export type ContentStatus = "draft" | "pending_approval" | "published";
export type UserRole = "editor" | "admin" | "owner";

export type SectionType = 
  | "hero" 
  | "features" 
  | "about" 
  | "gallery" 
  | "contact" 
  | "testimonials"
  | "cta"
  | "stats";

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesProps {
  heading: string;
  subheading: string;
  features: FeatureItem[];
}

export interface AboutProps {
  heading: string;
  content: string;
  image?: string;
}

export interface StatsItem {
  value: string;
  label: string;
}

export interface StatsProps {
  heading: string;
  stats: StatsItem[];
}

export interface CTAProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export type SectionProps = HeroProps | FeaturesProps | AboutProps | StatsProps | CTAProps;
