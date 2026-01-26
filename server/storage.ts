import {
  users,
  schools,
  pageSections,
  notices,
  leads,
  students,
  guardians,
  studentGuardians,
  classes,
  enrollments,
  admissions,
  subjects,
  attendance,
  grades,
  progressTokens,
  websiteThemes,
  componentCustomizations,
  themeVersions,
  aiDesignSuggestions,
  defaultDesignTokens,
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
  type Student,
  type InsertStudent,
  type Guardian,
  type InsertGuardian,
  type StudentGuardian,
  type InsertStudentGuardian,
  type Class,
  type InsertClass,
  type Enrollment,
  type InsertEnrollment,
  type Admission,
  type InsertAdmission,
  type Subject,
  type InsertSubject,
  type Attendance,
  type InsertAttendance,
  type Grade,
  type InsertGrade,
  type ProgressToken,
  type InsertProgressToken,
  type WebsiteTheme,
  type InsertWebsiteTheme,
  type ComponentCustomization,
  type InsertComponentCustomization,
  type ThemeVersion,
  type InsertThemeVersion,
  type AiDesignSuggestion,
  type InsertAiDesignSuggestion,
  type DesignTokens,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql, gte, lte, like, or } from "drizzle-orm";

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

  // Students
  getStudents(schoolId: string, status?: string): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string, schoolId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  getStudentCount(schoolId: string): Promise<number>;
  generateStudentId(schoolId: string): Promise<string>;

  // Guardians
  getGuardians(schoolId: string): Promise<Guardian[]>;
  getGuardian(id: string): Promise<Guardian | undefined>;
  createGuardian(guardian: InsertGuardian): Promise<Guardian>;
  updateGuardian(id: string, data: Partial<InsertGuardian>): Promise<Guardian | undefined>;
  deleteGuardian(id: string): Promise<boolean>;

  // Student-Guardian Links
  getStudentGuardians(studentId: string): Promise<(StudentGuardian & { guardian: Guardian })[]>;
  getGuardianStudents(guardianId: string): Promise<(StudentGuardian & { student: Student })[]>;
  linkStudentGuardian(link: InsertStudentGuardian): Promise<StudentGuardian>;
  unlinkStudentGuardian(id: string): Promise<boolean>;

  // Classes
  getClasses(schoolId: string, academicYear?: string): Promise<Class[]>;
  getClass(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, data: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;

  // Enrollments
  getEnrollments(classId: string): Promise<(Enrollment & { student: Student })[]>;
  getStudentEnrollments(studentId: string): Promise<(Enrollment & { class: Class })[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, data: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: string): Promise<boolean>;

  // Admissions
  getAdmissions(schoolId: string, status?: string): Promise<Admission[]>;
  getAdmission(id: string): Promise<Admission | undefined>;
  createAdmission(admission: InsertAdmission): Promise<Admission>;
  updateAdmission(id: string, data: Partial<InsertAdmission>): Promise<Admission | undefined>;
  deleteAdmission(id: string): Promise<boolean>;
  getAdmissionStats(schoolId: string): Promise<{ status: string; count: number }[]>;
  generateApplicationNumber(schoolId: string): Promise<string>;

  // Subjects
  getSubjects(schoolId: string): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, data: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: string): Promise<boolean>;

  // Attendance
  getAttendance(classId: string, date: string): Promise<(Attendance & { student: Student })[]>;
  getStudentAttendance(studentId: string, startDate?: string, endDate?: string): Promise<Attendance[]>;
  createAttendance(record: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, data: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  bulkCreateAttendance(records: InsertAttendance[]): Promise<Attendance[]>;
  getAttendanceStats(schoolId: string): Promise<{ present: number; absent: number; late: number; total: number }>;

  // Grades
  getGrades(studentId: string, academicYear?: string): Promise<(Grade & { subject: Subject })[]>;
  getClassGrades(classId: string, subjectId: string, term: string): Promise<(Grade & { student: Student })[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, data: Partial<InsertGrade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<boolean>;

  // Progress Tokens
  getProgressToken(token: string): Promise<(ProgressToken & { student: Student }) | undefined>;
  createProgressToken(tokenData: InsertProgressToken): Promise<ProgressToken>;
  revokeProgressToken(id: string): Promise<boolean>;
  getStudentProgressTokens(studentId: string): Promise<ProgressToken[]>;

  // Dashboard Stats
  getStudentDashboardStats(schoolId: string): Promise<{
    totalStudents: number;
    activeStudents: number;
    newAdmissionsThisMonth: number;
    attendanceRate: number;
    classCount: number;
  }>;

  // Website Themes
  getThemes(schoolId: string): Promise<WebsiteTheme[]>;
  getTheme(id: string): Promise<WebsiteTheme | undefined>;
  getActiveTheme(schoolId: string): Promise<WebsiteTheme | undefined>;
  createTheme(theme: InsertWebsiteTheme): Promise<WebsiteTheme>;
  updateTheme(id: string, data: Partial<InsertWebsiteTheme>): Promise<WebsiteTheme | undefined>;
  deleteTheme(id: string): Promise<boolean>;
  activateTheme(id: string): Promise<WebsiteTheme | undefined>;
  createThemeVersion(themeId: string, createdBy?: string): Promise<ThemeVersion>;
  getThemeVersions(themeId: string): Promise<ThemeVersion[]>;
  revertToVersion(versionId: string): Promise<WebsiteTheme | undefined>;

  // Component Customizations
  getComponentCustomizations(themeId: string): Promise<ComponentCustomization[]>;
  getComponentCustomization(themeId: string, componentType: string): Promise<ComponentCustomization | undefined>;
  saveComponentCustomization(customization: InsertComponentCustomization): Promise<ComponentCustomization>;
  deleteComponentCustomization(id: string): Promise<boolean>;

  // AI Design Suggestions
  getAiSuggestions(schoolId: string): Promise<AiDesignSuggestion[]>;
  createAiSuggestion(suggestion: InsertAiDesignSuggestion): Promise<AiDesignSuggestion>;
  updateAiSuggestionStatus(id: string, status: string): Promise<AiDesignSuggestion | undefined>;
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

  // ============ STUDENT MANAGEMENT ============

  // Students
  async getStudents(schoolId: string, status?: string): Promise<Student[]> {
    if (status) {
      return db.select().from(students)
        .where(and(eq(students.schoolId, schoolId), eq(students.status, status)))
        .orderBy(desc(students.createdAt));
    }
    return db.select().from(students)
      .where(eq(students.schoolId, schoolId))
      .orderBy(desc(students.createdAt));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentByStudentId(studentId: string, schoolId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students)
      .where(and(eq(students.studentId, studentId), eq(students.schoolId, schoolId)));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db.update(students)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return student || undefined;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id)).returning();
    return result.length > 0;
  }

  async getStudentCount(schoolId: string): Promise<number> {
    const [result] = await db.select({ count: count() })
      .from(students)
      .where(eq(students.schoolId, schoolId));
    return Number(result?.count || 0);
  }

  async generateStudentId(schoolId: string): Promise<string> {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const studentCount = await this.getStudentCount(schoolId);
    const sequence = (studentCount + 1).toString().padStart(4, '0');
    return `STU${currentYear}${sequence}`;
  }

  // Guardians
  async getGuardians(schoolId: string): Promise<Guardian[]> {
    return db.select().from(guardians)
      .where(eq(guardians.schoolId, schoolId))
      .orderBy(guardians.firstName);
  }

  async getGuardian(id: string): Promise<Guardian | undefined> {
    const [guardian] = await db.select().from(guardians).where(eq(guardians.id, id));
    return guardian || undefined;
  }

  async createGuardian(insertGuardian: InsertGuardian): Promise<Guardian> {
    const [guardian] = await db.insert(guardians).values(insertGuardian).returning();
    return guardian;
  }

  async updateGuardian(id: string, data: Partial<InsertGuardian>): Promise<Guardian | undefined> {
    const [guardian] = await db.update(guardians).set(data).where(eq(guardians.id, id)).returning();
    return guardian || undefined;
  }

  async deleteGuardian(id: string): Promise<boolean> {
    const result = await db.delete(guardians).where(eq(guardians.id, id)).returning();
    return result.length > 0;
  }

  // Student-Guardian Links
  async getStudentGuardians(studentId: string): Promise<(StudentGuardian & { guardian: Guardian })[]> {
    const links = await db.select()
      .from(studentGuardians)
      .innerJoin(guardians, eq(studentGuardians.guardianId, guardians.id))
      .where(eq(studentGuardians.studentId, studentId));
    return links.map(l => ({ ...l.student_guardians, guardian: l.guardians }));
  }

  async getGuardianStudents(guardianId: string): Promise<(StudentGuardian & { student: Student })[]> {
    const links = await db.select()
      .from(studentGuardians)
      .innerJoin(students, eq(studentGuardians.studentId, students.id))
      .where(eq(studentGuardians.guardianId, guardianId));
    return links.map(l => ({ ...l.student_guardians, student: l.students }));
  }

  async linkStudentGuardian(link: InsertStudentGuardian): Promise<StudentGuardian> {
    const [result] = await db.insert(studentGuardians).values(link).returning();
    return result;
  }

  async unlinkStudentGuardian(id: string): Promise<boolean> {
    const result = await db.delete(studentGuardians).where(eq(studentGuardians.id, id)).returning();
    return result.length > 0;
  }

  // Classes
  async getClasses(schoolId: string, academicYear?: string): Promise<Class[]> {
    if (academicYear) {
      return db.select().from(classes)
        .where(and(eq(classes.schoolId, schoolId), eq(classes.academicYear, academicYear)))
        .orderBy(classes.grade, classes.section);
    }
    return db.select().from(classes)
      .where(eq(classes.schoolId, schoolId))
      .orderBy(classes.grade, classes.section);
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData || undefined;
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [result] = await db.insert(classes).values(classData).returning();
    return result;
  }

  async updateClass(id: string, data: Partial<InsertClass>): Promise<Class | undefined> {
    const [result] = await db.update(classes).set(data).where(eq(classes.id, id)).returning();
    return result || undefined;
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id)).returning();
    return result.length > 0;
  }

  // Enrollments
  async getEnrollments(classId: string): Promise<(Enrollment & { student: Student })[]> {
    const results = await db.select()
      .from(enrollments)
      .innerJoin(students, eq(enrollments.studentId, students.id))
      .where(eq(enrollments.classId, classId));
    return results.map(r => ({ ...r.enrollments, student: r.students }));
  }

  async getStudentEnrollments(studentId: string): Promise<(Enrollment & { class: Class })[]> {
    const results = await db.select()
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .where(eq(enrollments.studentId, studentId));
    return results.map(r => ({ ...r.enrollments, class: r.classes }));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [result] = await db.insert(enrollments).values(enrollment).returning();
    return result;
  }

  async updateEnrollment(id: string, data: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [result] = await db.update(enrollments).set(data).where(eq(enrollments.id, id)).returning();
    return result || undefined;
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const result = await db.delete(enrollments).where(eq(enrollments.id, id)).returning();
    return result.length > 0;
  }

  // Admissions
  async getAdmissions(schoolId: string, status?: string): Promise<Admission[]> {
    if (status) {
      return db.select().from(admissions)
        .where(and(eq(admissions.schoolId, schoolId), eq(admissions.status, status)))
        .orderBy(desc(admissions.createdAt));
    }
    return db.select().from(admissions)
      .where(eq(admissions.schoolId, schoolId))
      .orderBy(desc(admissions.createdAt));
  }

  async getAdmission(id: string): Promise<Admission | undefined> {
    const [admission] = await db.select().from(admissions).where(eq(admissions.id, id));
    return admission || undefined;
  }

  async createAdmission(insertAdmission: InsertAdmission): Promise<Admission> {
    const [admission] = await db.insert(admissions).values(insertAdmission).returning();
    return admission;
  }

  async updateAdmission(id: string, data: Partial<InsertAdmission>): Promise<Admission | undefined> {
    const [admission] = await db.update(admissions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(admissions.id, id))
      .returning();
    return admission || undefined;
  }

  async deleteAdmission(id: string): Promise<boolean> {
    const result = await db.delete(admissions).where(eq(admissions.id, id)).returning();
    return result.length > 0;
  }

  async getAdmissionStats(schoolId: string): Promise<{ status: string; count: number }[]> {
    const stats = await db.select({
      status: admissions.status,
      count: count(),
    })
      .from(admissions)
      .where(eq(admissions.schoolId, schoolId))
      .groupBy(admissions.status);
    return stats.map(s => ({ status: s.status, count: Number(s.count) }));
  }

  async generateApplicationNumber(schoolId: string): Promise<string> {
    const currentYear = new Date().getFullYear().toString();
    const [result] = await db.select({ count: count() })
      .from(admissions)
      .where(eq(admissions.schoolId, schoolId));
    const sequence = (Number(result?.count || 0) + 1).toString().padStart(5, '0');
    return `APP${currentYear}${sequence}`;
  }

  // Subjects
  async getSubjects(schoolId: string): Promise<Subject[]> {
    return db.select().from(subjects)
      .where(eq(subjects.schoolId, schoolId))
      .orderBy(subjects.name);
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(insertSubject).returning();
    return subject;
  }

  async updateSubject(id: string, data: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [subject] = await db.update(subjects).set(data).where(eq(subjects.id, id)).returning();
    return subject || undefined;
  }

  async deleteSubject(id: string): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id)).returning();
    return result.length > 0;
  }

  // Attendance
  async getAttendance(classId: string, date: string): Promise<(Attendance & { student: Student })[]> {
    const results = await db.select()
      .from(attendance)
      .innerJoin(students, eq(attendance.studentId, students.id))
      .where(and(eq(attendance.classId, classId), eq(attendance.date, date)));
    return results.map(r => ({ ...r.attendance, student: r.students }));
  }

  async getStudentAttendance(studentId: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    let query = db.select().from(attendance).where(eq(attendance.studentId, studentId));
    if (startDate && endDate) {
      query = db.select().from(attendance)
        .where(and(
          eq(attendance.studentId, studentId),
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        ));
    }
    return query.orderBy(desc(attendance.date));
  }

  async createAttendance(record: InsertAttendance): Promise<Attendance> {
    const [result] = await db.insert(attendance).values(record).returning();
    return result;
  }

  async updateAttendance(id: string, data: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [result] = await db.update(attendance).set(data).where(eq(attendance.id, id)).returning();
    return result || undefined;
  }

  async bulkCreateAttendance(records: InsertAttendance[]): Promise<Attendance[]> {
    if (records.length === 0) return [];
    const results = await db.insert(attendance).values(records).returning();
    return results;
  }

  async getAttendanceStats(schoolId: string): Promise<{ present: number; absent: number; late: number; total: number }> {
    const today = new Date().toISOString().split('T')[0];
    const studentIds = await db.select({ id: students.id })
      .from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.status, 'active')));
    
    if (studentIds.length === 0) {
      return { present: 0, absent: 0, late: 0, total: 0 };
    }

    const todayAttendance = await db.select()
      .from(attendance)
      .where(eq(attendance.date, today));

    const present = todayAttendance.filter(a => a.status === 'present').length;
    const absent = todayAttendance.filter(a => a.status === 'absent').length;
    const late = todayAttendance.filter(a => a.status === 'late').length;
    
    return { present, absent, late, total: studentIds.length };
  }

  // Grades
  async getGrades(studentId: string, academicYear?: string): Promise<(Grade & { subject: Subject })[]> {
    let whereClause = eq(grades.studentId, studentId);
    if (academicYear) {
      whereClause = and(eq(grades.studentId, studentId), eq(grades.academicYear, academicYear)) as any;
    }
    const results = await db.select()
      .from(grades)
      .innerJoin(subjects, eq(grades.subjectId, subjects.id))
      .where(whereClause);
    return results.map(r => ({ ...r.grades, subject: r.subjects }));
  }

  async getClassGrades(classId: string, subjectId: string, term: string): Promise<(Grade & { student: Student })[]> {
    const results = await db.select()
      .from(grades)
      .innerJoin(students, eq(grades.studentId, students.id))
      .where(and(
        eq(grades.classId, classId),
        eq(grades.subjectId, subjectId),
        eq(grades.term, term)
      ));
    return results.map(r => ({ ...r.grades, student: r.students }));
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(insertGrade).returning();
    return grade;
  }

  async updateGrade(id: string, data: Partial<InsertGrade>): Promise<Grade | undefined> {
    const [grade] = await db.update(grades).set(data).where(eq(grades.id, id)).returning();
    return grade || undefined;
  }

  async deleteGrade(id: string): Promise<boolean> {
    const result = await db.delete(grades).where(eq(grades.id, id)).returning();
    return result.length > 0;
  }

  // Progress Tokens
  async getProgressToken(token: string): Promise<(ProgressToken & { student: Student }) | undefined> {
    const [result] = await db.select()
      .from(progressTokens)
      .innerJoin(students, eq(progressTokens.studentId, students.id))
      .where(and(eq(progressTokens.token, token), eq(progressTokens.isRevoked, false)));
    if (!result) return undefined;
    
    // Update last accessed
    await db.update(progressTokens)
      .set({ lastAccessedAt: new Date() })
      .where(eq(progressTokens.token, token));
    
    return { ...result.progress_tokens, student: result.students };
  }

  async createProgressToken(tokenData: InsertProgressToken): Promise<ProgressToken> {
    const [token] = await db.insert(progressTokens).values(tokenData).returning();
    return token;
  }

  async revokeProgressToken(id: string): Promise<boolean> {
    const [result] = await db.update(progressTokens)
      .set({ isRevoked: true })
      .where(eq(progressTokens.id, id))
      .returning();
    return !!result;
  }

  async getStudentProgressTokens(studentId: string): Promise<ProgressToken[]> {
    return db.select().from(progressTokens)
      .where(eq(progressTokens.studentId, studentId))
      .orderBy(desc(progressTokens.createdAt));
  }

  // Dashboard Stats
  async getStudentDashboardStats(schoolId: string): Promise<{
    totalStudents: number;
    activeStudents: number;
    newAdmissionsThisMonth: number;
    attendanceRate: number;
    classCount: number;
  }> {
    // Total students
    const [totalResult] = await db.select({ count: count() })
      .from(students)
      .where(eq(students.schoolId, schoolId));
    
    // Active students
    const [activeResult] = await db.select({ count: count() })
      .from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.status, 'active')));
    
    // New admissions this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const [admissionResult] = await db.select({ count: count() })
      .from(admissions)
      .where(and(
        eq(admissions.schoolId, schoolId),
        gte(admissions.createdAt, startOfMonth)
      ));
    
    // Class count
    const currentYear = new Date().getFullYear().toString();
    const [classResult] = await db.select({ count: count() })
      .from(classes)
      .where(and(eq(classes.schoolId, schoolId), like(classes.academicYear, `%${currentYear}%`)));
    
    // Attendance rate (last 7 days)
    const attendanceStats = await this.getAttendanceStats(schoolId);
    const attendanceRate = attendanceStats.total > 0 
      ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
      : 0;

    return {
      totalStudents: Number(totalResult?.count || 0),
      activeStudents: Number(activeResult?.count || 0),
      newAdmissionsThisMonth: Number(admissionResult?.count || 0),
      attendanceRate,
      classCount: Number(classResult?.count || 0),
    };
  }

  // ============ WEBSITE THEMES ============

  async getThemes(schoolId: string): Promise<WebsiteTheme[]> {
    return await db.select().from(websiteThemes)
      .where(eq(websiteThemes.schoolId, schoolId))
      .orderBy(desc(websiteThemes.updatedAt));
  }

  async getTheme(id: string): Promise<WebsiteTheme | undefined> {
    const [theme] = await db.select().from(websiteThemes)
      .where(eq(websiteThemes.id, id));
    return theme || undefined;
  }

  async getActiveTheme(schoolId: string): Promise<WebsiteTheme | undefined> {
    const [theme] = await db.select().from(websiteThemes)
      .where(and(
        eq(websiteThemes.schoolId, schoolId),
        eq(websiteThemes.isActive, true)
      ));
    
    // If no active theme, return undefined (will use defaults)
    return theme || undefined;
  }

  async createTheme(theme: InsertWebsiteTheme): Promise<WebsiteTheme> {
    // Set default design tokens if not provided
    const themeWithDefaults = {
      ...theme,
      designTokens: theme.designTokens || defaultDesignTokens,
    };
    
    const [newTheme] = await db.insert(websiteThemes).values(themeWithDefaults).returning();
    return newTheme;
  }

  async updateTheme(id: string, data: Partial<InsertWebsiteTheme>): Promise<WebsiteTheme | undefined> {
    const [updated] = await db.update(websiteThemes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(websiteThemes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTheme(id: string): Promise<boolean> {
    const result = await db.delete(websiteThemes).where(eq(websiteThemes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async activateTheme(id: string): Promise<WebsiteTheme | undefined> {
    // Get the theme to find schoolId
    const theme = await this.getTheme(id);
    if (!theme) return undefined;

    // Deactivate all other themes for this school
    await db.update(websiteThemes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(websiteThemes.schoolId, theme.schoolId));

    // Activate the selected theme
    const [updated] = await db.update(websiteThemes)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(websiteThemes.id, id))
      .returning();
    
    return updated || undefined;
  }

  async createThemeVersion(themeId: string, createdBy?: string): Promise<ThemeVersion> {
    const theme = await this.getTheme(themeId);
    if (!theme) throw new Error("Theme not found");

    // Get current max version number
    const [maxVersion] = await db.select({ maxV: sql<number>`COALESCE(MAX(version_number), 0)` })
      .from(themeVersions)
      .where(eq(themeVersions.themeId, themeId));
    
    const nextVersion = (maxVersion?.maxV || 0) + 1;

    const [version] = await db.insert(themeVersions).values({
      themeId,
      versionNumber: nextVersion,
      configSnapshot: theme.config,
      designTokensSnapshot: theme.designTokens,
      createdBy,
    }).returning();

    // Update theme version number
    await db.update(websiteThemes)
      .set({ version: nextVersion, updatedAt: new Date() })
      .where(eq(websiteThemes.id, themeId));

    return version;
  }

  async getThemeVersions(themeId: string): Promise<ThemeVersion[]> {
    return await db.select().from(themeVersions)
      .where(eq(themeVersions.themeId, themeId))
      .orderBy(desc(themeVersions.versionNumber));
  }

  async revertToVersion(versionId: string): Promise<WebsiteTheme | undefined> {
    const [version] = await db.select().from(themeVersions)
      .where(eq(themeVersions.id, versionId));
    
    if (!version) return undefined;

    // Restore theme from version snapshot
    const [updated] = await db.update(websiteThemes)
      .set({
        config: version.configSnapshot,
        designTokens: version.designTokensSnapshot,
        updatedAt: new Date(),
      })
      .where(eq(websiteThemes.id, version.themeId))
      .returning();

    return updated || undefined;
  }

  // ============ COMPONENT CUSTOMIZATIONS ============

  async getComponentCustomizations(themeId: string): Promise<ComponentCustomization[]> {
    return await db.select().from(componentCustomizations)
      .where(eq(componentCustomizations.themeId, themeId));
  }

  async getComponentCustomization(themeId: string, componentType: string): Promise<ComponentCustomization | undefined> {
    const [customization] = await db.select().from(componentCustomizations)
      .where(and(
        eq(componentCustomizations.themeId, themeId),
        eq(componentCustomizations.componentType, componentType)
      ));
    return customization || undefined;
  }

  async saveComponentCustomization(customization: InsertComponentCustomization): Promise<ComponentCustomization> {
    // Upsert: update if exists, insert if not
    const existing = await this.getComponentCustomization(
      customization.themeId, 
      customization.componentType
    );

    if (existing) {
      const [updated] = await db.update(componentCustomizations)
        .set({ ...customization, updatedAt: new Date() })
        .where(eq(componentCustomizations.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(componentCustomizations)
        .values(customization)
        .returning();
      return created;
    }
  }

  async deleteComponentCustomization(id: string): Promise<boolean> {
    const result = await db.delete(componentCustomizations)
      .where(eq(componentCustomizations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ============ AI DESIGN SUGGESTIONS ============

  async getAiSuggestions(schoolId: string): Promise<AiDesignSuggestion[]> {
    return await db.select().from(aiDesignSuggestions)
      .where(eq(aiDesignSuggestions.schoolId, schoolId))
      .orderBy(desc(aiDesignSuggestions.createdAt));
  }

  async createAiSuggestion(suggestion: InsertAiDesignSuggestion): Promise<AiDesignSuggestion> {
    const [created] = await db.insert(aiDesignSuggestions)
      .values(suggestion)
      .returning();
    return created;
  }

  async updateAiSuggestionStatus(id: string, status: string): Promise<AiDesignSuggestion | undefined> {
    const [updated] = await db.update(aiDesignSuggestions)
      .set({ status })
      .where(eq(aiDesignSuggestions.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
