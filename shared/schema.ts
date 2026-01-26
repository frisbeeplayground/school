import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb, date, decimal } from "drizzle-orm/pg-core";
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
  tagline: text("tagline").default("Excellence in Education"),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  operatingHours: text("operating_hours"),
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

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  source: text("source").notNull().default("website"),
  status: text("status").notNull().default("new"),
  gradeInterest: text("grade_interest"),
  message: text("message"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  assignedTo: varchar("assigned_to"),
});

export const leadsRelations = relations(leads, ({ one }) => ({
  school: one(schools, {
    fields: [leads.schoolId],
    references: [schools.id],
  }),
}));

const leadStatusEnum = z.enum(["new", "contacted", "qualified", "enrolled", "lost"]);
const leadSourceEnum = z.enum(["website", "phone", "referral", "event", "social", "other"]);

export const insertLeadSchema = createInsertSchema(leads)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: leadStatusEnum.default("new"),
    source: leadSourceEnum.default("website"),
  });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Types for frontend
export type Environment = "sandbox" | "live";
export type ContentStatus = "draft" | "pending_approval" | "published";
export type UserRole = "editor" | "admin" | "owner";
export type LeadStatus = "new" | "contacted" | "qualified" | "enrolled" | "lost";
export type LeadSource = "website" | "phone" | "referral" | "event" | "social" | "other";

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

// ============ STUDENT MANAGEMENT SYSTEM ============

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  studentId: text("student_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  photo: text("photo"),
  bloodGroup: text("blood_group"),
  address: text("address"),
  medicalNotes: text("medical_notes"),
  status: text("status").notNull().default("active"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const studentStatusEnum = z.enum(["active", "inactive", "graduated", "transferred"]);

export const insertStudentSchema = createInsertSchema(students)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: studentStatusEnum.default("active"),
  });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Guardians table
export const guardians = pgTable("guardians", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  alternatePhone: text("alternate_phone"),
  relationship: text("relationship").notNull(),
  occupation: text("occupation"),
  address: text("address"),
  photo: text("photo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGuardianSchema = createInsertSchema(guardians).omit({ id: true, createdAt: true });
export type InsertGuardian = z.infer<typeof insertGuardianSchema>;
export type Guardian = typeof guardians.$inferSelect;

// Student-Guardian junction table
export const studentGuardians = pgTable("student_guardians", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  guardianId: varchar("guardian_id").notNull().references(() => guardians.id),
  isPrimary: boolean("is_primary").notNull().default(false),
  canPickup: boolean("can_pickup").notNull().default(true),
});

export const insertStudentGuardianSchema = createInsertSchema(studentGuardians).omit({ id: true });
export type InsertStudentGuardian = z.infer<typeof insertStudentGuardianSchema>;
export type StudentGuardian = typeof studentGuardians.$inferSelect;

// Classes table
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  section: text("section"),
  academicYear: text("academic_year").notNull(),
  teacherId: varchar("teacher_id"),
  capacity: integer("capacity").default(30),
  roomNumber: text("room_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClassSchema = createInsertSchema(classes).omit({ id: true, createdAt: true });
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

// Enrollments table (student enrolled in class)
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  academicYear: text("academic_year").notNull(),
  rollNumber: text("roll_number"),
  status: text("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
});

const enrollmentStatusEnum = z.enum(["active", "completed", "dropped", "transferred"]);

export const insertEnrollmentSchema = createInsertSchema(enrollments)
  .omit({ id: true, enrolledAt: true })
  .extend({
    status: enrollmentStatusEnum.default("active"),
  });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Admissions table (application workflow)
export const admissions = pgTable("admissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  applicationNumber: text("application_number").notNull(),
  studentFirstName: text("student_first_name").notNull(),
  studentLastName: text("student_last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  gradeApplying: text("grade_applying").notNull(),
  academicYear: text("academic_year").notNull(),
  guardianName: text("guardian_name").notNull(),
  guardianEmail: text("guardian_email"),
  guardianPhone: text("guardian_phone").notNull(),
  guardianRelationship: text("guardian_relationship"),
  address: text("address"),
  previousSchool: text("previous_school"),
  status: text("status").notNull().default("inquiry"),
  source: text("source").notNull().default("website"),
  notes: text("notes"),
  qrToken: text("qr_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const admissionStatusEnum = z.enum(["inquiry", "applied", "documents_pending", "under_review", "interview_scheduled", "accepted", "rejected", "enrolled", "withdrawn"]);
const admissionSourceEnum = z.enum(["website", "walk_in", "referral", "event", "advertisement", "social_media", "other"]);

export const insertAdmissionSchema = createInsertSchema(admissions)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: admissionStatusEnum.default("inquiry"),
    source: admissionSourceEnum.default("website"),
  });
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type Admission = typeof admissions.$inferSelect;

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  name: text("name").notNull(),
  code: text("code"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, createdAt: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

// Attendance table
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  date: date("date").notNull(),
  status: text("status").notNull().default("present"),
  remarks: text("remarks"),
  markedBy: varchar("marked_by"),
  markedAt: timestamp("marked_at").notNull().defaultNow(),
});

const attendanceStatusEnum = z.enum(["present", "absent", "late", "excused", "half_day"]);

export const insertAttendanceSchema = createInsertSchema(attendance)
  .omit({ id: true, markedAt: true })
  .extend({
    status: attendanceStatusEnum.default("present"),
  });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  classId: varchar("class_id").notNull().references(() => classes.id),
  examType: text("exam_type").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  grade: text("grade"),
  remarks: text("remarks"),
  term: text("term").notNull(),
  academicYear: text("academic_year").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, createdAt: true });
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;

// Progress Tokens table (for QR-based parent access)
export const progressTokens = pgTable("progress_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  guardianId: varchar("guardian_id").references(() => guardians.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at"),
  isRevoked: boolean("is_revoked").notNull().default(false),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProgressTokenSchema = createInsertSchema(progressTokens).omit({ id: true, createdAt: true, lastAccessedAt: true });
export type InsertProgressToken = z.infer<typeof insertProgressTokenSchema>;
export type ProgressToken = typeof progressTokens.$inferSelect;

// Relations for Student Management
export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, { fields: [students.schoolId], references: [schools.id] }),
  studentGuardians: many(studentGuardians),
  enrollments: many(enrollments),
  attendance: many(attendance),
  grades: many(grades),
  progressTokens: many(progressTokens),
}));

export const guardiansRelations = relations(guardians, ({ one, many }) => ({
  school: one(schools, { fields: [guardians.schoolId], references: [schools.id] }),
  studentGuardians: many(studentGuardians),
}));

export const studentGuardiansRelations = relations(studentGuardians, ({ one }) => ({
  student: one(students, { fields: [studentGuardians.studentId], references: [students.id] }),
  guardian: one(guardians, { fields: [studentGuardians.guardianId], references: [guardians.id] }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, { fields: [classes.schoolId], references: [schools.id] }),
  enrollments: many(enrollments),
  attendance: many(attendance),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, { fields: [enrollments.studentId], references: [students.id] }),
  class: one(classes, { fields: [enrollments.classId], references: [classes.id] }),
}));

export const admissionsRelations = relations(admissions, ({ one }) => ({
  school: one(schools, { fields: [admissions.schoolId], references: [schools.id] }),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  school: one(schools, { fields: [subjects.schoolId], references: [schools.id] }),
  grades: many(grades),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, { fields: [attendance.studentId], references: [students.id] }),
  class: one(classes, { fields: [attendance.classId], references: [classes.id] }),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, { fields: [grades.studentId], references: [students.id] }),
  subject: one(subjects, { fields: [grades.subjectId], references: [subjects.id] }),
  class: one(classes, { fields: [grades.classId], references: [classes.id] }),
}));

export const progressTokensRelations = relations(progressTokens, ({ one }) => ({
  student: one(students, { fields: [progressTokens.studentId], references: [students.id] }),
  guardian: one(guardians, { fields: [progressTokens.guardianId], references: [guardians.id] }),
}));

// Type exports for Student Management
export type StudentStatus = "active" | "inactive" | "graduated" | "transferred";
export type EnrollmentStatus = "active" | "completed" | "dropped" | "transferred";
export type AdmissionStatus = "inquiry" | "applied" | "documents_pending" | "under_review" | "interview_scheduled" | "accepted" | "rejected" | "enrolled" | "withdrawn";
export type AdmissionSource = "website" | "walk_in" | "referral" | "event" | "advertisement" | "social_media" | "other";
export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "half_day";

// ============ WEBSITE THEMING SYSTEM ============

// Design Tokens TypeScript Types (Template Structure)
export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface TypographyTokens {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingTokens {
  scale: string;
  unit: string;
}

export interface BorderRadiusTokens {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  breakpoints: BreakpointTokens;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
}

export interface ComponentDefinition {
  type: string;
  variants: ComponentVariant[];
  defaultVariant: string;
}

export interface LayoutDefinition {
  alignment: "left" | "center" | "right";
  contentWidth: "narrow" | "medium" | "wide" | "full";
  spacing: "compact" | "normal" | "relaxed";
}

export interface TemplateStructure {
  version: string;
  templateId: string;
  templateName: string;
  designTokens: DesignTokens;
  components: {
    hero: ComponentDefinition;
    features: ComponentDefinition;
    about: ComponentDefinition;
    stats: ComponentDefinition;
    cta: ComponentDefinition;
    notices: ComponentDefinition;
    contact: ComponentDefinition;
    footer: ComponentDefinition;
  };
  layouts: {
    hero: LayoutDefinition;
    content: LayoutDefinition;
    footer: LayoutDefinition;
  };
}

// Default Design Tokens
export const defaultDesignTokens: DesignTokens = {
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      muted: "#9CA3AF",
    },
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  typography: {
    fontFamily: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    scale: "1.25",
    unit: "0.25rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// Website Themes table
export const websiteThemes = pgTable("website_themes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  isDefault: boolean("is_default").notNull().default(false),
  version: integer("version").notNull().default(1),
  designTokens: jsonb("design_tokens").notNull().default({}),
  config: jsonb("config").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const websiteThemesRelations = relations(websiteThemes, ({ one, many }) => ({
  school: one(schools, { fields: [websiteThemes.schoolId], references: [schools.id] }),
  customizations: many(componentCustomizations),
  versions: many(themeVersions),
}));

export const insertWebsiteThemeSchema = createInsertSchema(websiteThemes).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWebsiteTheme = z.infer<typeof insertWebsiteThemeSchema>;
export type WebsiteTheme = typeof websiteThemes.$inferSelect;

// Component Customizations table
export const componentCustomizations = pgTable("component_customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  themeId: varchar("theme_id").notNull().references(() => websiteThemes.id),
  componentType: text("component_type").notNull(),
  componentId: varchar("component_id"),
  styles: jsonb("styles").notNull().default({}),
  layout: jsonb("layout").notNull().default({}),
  variants: jsonb("variants").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const componentCustomizationsRelations = relations(componentCustomizations, ({ one }) => ({
  theme: one(websiteThemes, { fields: [componentCustomizations.themeId], references: [websiteThemes.id] }),
}));

export const insertComponentCustomizationSchema = createInsertSchema(componentCustomizations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComponentCustomization = z.infer<typeof insertComponentCustomizationSchema>;
export type ComponentCustomization = typeof componentCustomizations.$inferSelect;

// Theme Versions table
export const themeVersions = pgTable("theme_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  themeId: varchar("theme_id").notNull().references(() => websiteThemes.id),
  versionNumber: integer("version_number").notNull(),
  configSnapshot: jsonb("config_snapshot").notNull(),
  designTokensSnapshot: jsonb("design_tokens_snapshot").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: varchar("created_by"),
});

export const themeVersionsRelations = relations(themeVersions, ({ one }) => ({
  theme: one(websiteThemes, { fields: [themeVersions.themeId], references: [websiteThemes.id] }),
}));

export const insertThemeVersionSchema = createInsertSchema(themeVersions).omit({ id: true, createdAt: true });
export type InsertThemeVersion = z.infer<typeof insertThemeVersionSchema>;
export type ThemeVersion = typeof themeVersions.$inferSelect;

// AI Design Suggestions table
export const aiDesignSuggestions = pgTable("ai_design_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull().references(() => schools.id),
  suggestionType: text("suggestion_type").notNull(),
  prompt: text("prompt"),
  generatedConfig: jsonb("generated_config").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiDesignSuggestionsRelations = relations(aiDesignSuggestions, ({ one }) => ({
  school: one(schools, { fields: [aiDesignSuggestions.schoolId], references: [schools.id] }),
}));

const suggestionStatusEnum = z.enum(["pending", "accepted", "rejected"]);
const suggestionTypeEnum = z.enum(["color_palette", "typography", "layout", "full_template"]);

export const insertAiDesignSuggestionSchema = createInsertSchema(aiDesignSuggestions)
  .omit({ id: true, createdAt: true })
  .extend({
    status: suggestionStatusEnum.default("pending"),
    suggestionType: suggestionTypeEnum,
  });
export type InsertAiDesignSuggestion = z.infer<typeof insertAiDesignSuggestionSchema>;
export type AiDesignSuggestion = typeof aiDesignSuggestions.$inferSelect;

// Zod schema for design tokens validation
export const designTokensSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.object({
      primary: z.string(),
      secondary: z.string(),
      muted: z.string(),
    }),
    border: z.string(),
    error: z.string(),
    success: z.string(),
    warning: z.string(),
    info: z.string(),
  }),
  typography: z.object({
    fontFamily: z.object({
      heading: z.string(),
      body: z.string(),
      mono: z.string(),
    }),
    fontSize: z.object({
      xs: z.string(),
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string(),
      "2xl": z.string(),
      "3xl": z.string(),
      "4xl": z.string(),
      "5xl": z.string(),
    }),
    fontWeight: z.object({
      light: z.number(),
      normal: z.number(),
      medium: z.number(),
      semibold: z.number(),
      bold: z.number(),
    }),
    lineHeight: z.object({
      tight: z.number(),
      normal: z.number(),
      relaxed: z.number(),
    }),
  }),
  spacing: z.object({
    scale: z.string(),
    unit: z.string(),
  }),
  borderRadius: z.object({
    none: z.string(),
    sm: z.string(),
    base: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    full: z.string(),
  }),
  shadows: z.object({
    sm: z.string(),
    base: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
  }),
  breakpoints: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    "2xl": z.string(),
  }),
});

// Type exports for theming
export type SuggestionStatus = "pending" | "accepted" | "rejected";
export type SuggestionType = "color_palette" | "typography" | "layout" | "full_template";
