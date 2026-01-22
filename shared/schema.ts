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
