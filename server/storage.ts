import {
  users,
  schools,
  pageSections,
  notices,
  leads,
  type User,
  type InsertUser,
  type School,
  type InsertSchool,
  type PageSection,
  type InsertPageSection,
  type Notice,
  type InsertNotice,
  type Lead,
  type InsertLead,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Schools
  getSchool(id: string): Promise<School | undefined>;
  getSchoolBySlug(slug: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: string, data: Partial<InsertSchool>): Promise<School | undefined>;

  // Page Sections
  getSections(schoolId: string, environment?: string): Promise<PageSection[]>;
  getSection(id: string): Promise<PageSection | undefined>;
  createSection(section: InsertPageSection): Promise<PageSection>;
  updateSection(id: string, data: Partial<InsertPageSection>): Promise<PageSection | undefined>;
  deleteSection(id: string): Promise<boolean>;
  
  // Notices
  getNotices(schoolId: string, environment?: string): Promise<Notice[]>;
  getNotice(id: string): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  updateNotice(id: string, data: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: string): Promise<boolean>;
  
  // Leads
  getLeads(schoolId: string, status?: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  getLeadStats(schoolId: string): Promise<{ status: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Schools
  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school || undefined;
  }

  async getSchoolBySlug(slug: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.slug, slug));
    return school || undefined;
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const [school] = await db.insert(schools).values(insertSchool).returning();
    return school;
  }

  async updateSchool(id: string, data: Partial<InsertSchool>): Promise<School | undefined> {
    const [school] = await db.update(schools).set(data).where(eq(schools.id, id)).returning();
    return school || undefined;
  }

  // Page Sections
  async getSections(schoolId: string, environment?: string): Promise<PageSection[]> {
    if (environment) {
      return db.select().from(pageSections)
        .where(and(eq(pageSections.schoolId, schoolId), eq(pageSections.environment, environment)))
        .orderBy(pageSections.position);
    }
    return db.select().from(pageSections)
      .where(eq(pageSections.schoolId, schoolId))
      .orderBy(pageSections.position);
  }

  async getSection(id: string): Promise<PageSection | undefined> {
    const [section] = await db.select().from(pageSections).where(eq(pageSections.id, id));
    return section || undefined;
  }

  async createSection(insertSection: InsertPageSection): Promise<PageSection> {
    const [section] = await db.insert(pageSections).values(insertSection).returning();
    return section;
  }

  async updateSection(id: string, data: Partial<InsertPageSection>): Promise<PageSection | undefined> {
    const [section] = await db.update(pageSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pageSections.id, id))
      .returning();
    return section || undefined;
  }

  async deleteSection(id: string): Promise<boolean> {
    const result = await db.delete(pageSections).where(eq(pageSections.id, id)).returning();
    return result.length > 0;
  }

  // Notices
  async getNotices(schoolId: string, environment?: string): Promise<Notice[]> {
    if (environment) {
      return db.select().from(notices)
        .where(and(eq(notices.schoolId, schoolId), eq(notices.environment, environment)))
        .orderBy(desc(notices.createdAt));
    }
    return db.select().from(notices)
      .where(eq(notices.schoolId, schoolId))
      .orderBy(desc(notices.createdAt));
  }

  async getNotice(id: string): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice || undefined;
  }

  async createNotice(insertNotice: InsertNotice): Promise<Notice> {
    const [notice] = await db.insert(notices).values(insertNotice).returning();
    return notice;
  }

  async updateNotice(id: string, data: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [notice] = await db.update(notices).set(data).where(eq(notices.id, id)).returning();
    return notice || undefined;
  }

  async deleteNotice(id: string): Promise<boolean> {
    const result = await db.delete(notices).where(eq(notices.id, id)).returning();
    return result.length > 0;
  }

  // Leads
  async getLeads(schoolId: string, status?: string): Promise<Lead[]> {
    if (status) {
      return db.select().from(leads)
        .where(and(eq(leads.schoolId, schoolId), eq(leads.status, status)))
        .orderBy(desc(leads.createdAt));
    }
    return db.select().from(leads)
      .where(eq(leads.schoolId, schoolId))
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db.update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  async getLeadStats(schoolId: string): Promise<{ status: string; count: number }[]> {
    const stats = await db.select({
      status: leads.status,
      count: count(),
    })
      .from(leads)
      .where(eq(leads.schoolId, schoolId))
      .groupBy(leads.status);
    return stats.map(s => ({ status: s.status, count: Number(s.count) }));
  }
}

export const storage = new DatabaseStorage();
