import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPageSectionSchema, 
  insertNoticeSchema, 
  insertSchoolSchema, 
  insertLeadSchema,
  insertStudentSchema,
  insertGuardianSchema,
  insertStudentGuardianSchema,
  insertClassSchema,
  insertEnrollmentSchema,
  insertAdmissionSchema,
  insertSubjectSchema,
  insertAttendanceSchema,
  insertGradeSchema,
  insertProgressTokenSchema,
} from "@shared/schema";
import { randomBytes } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed default school if not exists
  const seedDefaultSchool = async () => {
    const existing = await storage.getSchoolBySlug("springfield");
    if (!existing) {
      await storage.createSchool({
        name: "Springfield Academy",
        slug: "springfield",
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
      });
    }
  };
  
  seedDefaultSchool().catch(console.error);

  // ============ ADMIN API ROUTES ============

  // Schools
  app.get("/api/schools/:id", async (req, res) => {
    try {
      const school = await storage.getSchool(req.params.id);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error fetching school:", error);
      res.status(500).json({ error: "Failed to fetch school" });
    }
  });

  app.patch("/api/schools/:id", async (req, res) => {
    try {
      // Partial validation for update
      const validationResult = insertSchoolSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const school = await storage.updateSchool(req.params.id, validationResult.data);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error updating school:", error);
      res.status(500).json({ error: "Failed to update school" });
    }
  });

  // Page Sections
  app.get("/api/sections", async (req, res) => {
    try {
      const schoolId = req.query.schoolId as string || "1";
      const environment = req.query.environment as string;
      
      // Get school by slug if needed
      let school = await storage.getSchool(schoolId);
      if (!school) {
        school = await storage.getSchoolBySlug("springfield");
      }
      
      if (!school) {
        return res.json([]);
      }
      
      const sections = await storage.getSections(school.id, environment);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ error: "Failed to fetch sections" });
    }
  });

  app.post("/api/sections", async (req, res) => {
    try {
      // Get default school if no schoolId provided
      let schoolId = req.body.schoolId;
      if (!schoolId || schoolId === "1") {
        const school = await storage.getSchoolBySlug("springfield");
        if (school) {
          schoolId = school.id;
        }
      }
      
      const sectionData = {
        ...req.body,
        schoolId,
        props: req.body.props || {},
      };
      
      // Validate with Zod schema
      const validationResult = insertPageSectionSchema.safeParse(sectionData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const section = await storage.createSection(validationResult.data);
      res.status(201).json(section);
    } catch (error) {
      console.error("Error creating section:", error);
      res.status(500).json({ error: "Failed to create section" });
    }
  });

  app.patch("/api/sections/:id", async (req, res) => {
    try {
      const section = await storage.updateSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({ error: "Failed to update section" });
    }
  });

  app.delete("/api/sections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({ error: "Failed to delete section" });
    }
  });

  // Section approval workflow
  app.post("/api/sections/:id/submit", async (req, res) => {
    try {
      const section = await storage.updateSection(req.params.id, {
        status: "pending_approval",
      });
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error submitting section:", error);
      res.status(500).json({ error: "Failed to submit section" });
    }
  });

  app.post("/api/sections/:id/approve", async (req, res) => {
    try {
      // First get the sandbox section
      const sandboxSection = await storage.getSection(req.params.id);
      if (!sandboxSection) {
        return res.status(404).json({ error: "Section not found" });
      }

      // Update the section to published status and move to live environment
      const section = await storage.updateSection(req.params.id, {
        status: "published",
        environment: "live",
      });
      
      res.json(section);
    } catch (error) {
      console.error("Error approving section:", error);
      res.status(500).json({ error: "Failed to approve section" });
    }
  });

  app.post("/api/sections/:id/reject", async (req, res) => {
    try {
      const section = await storage.updateSection(req.params.id, {
        status: "draft",
      });
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error rejecting section:", error);
      res.status(500).json({ error: "Failed to reject section" });
    }
  });

  // Notices
  app.get("/api/notices", async (req, res) => {
    try {
      const schoolId = req.query.schoolId as string || "1";
      const environment = req.query.environment as string;
      
      let school = await storage.getSchool(schoolId);
      if (!school) {
        school = await storage.getSchoolBySlug("springfield");
      }
      
      if (!school) {
        return res.json([]);
      }
      
      const noticesList = await storage.getNotices(school.id, environment);
      res.json(noticesList);
    } catch (error) {
      console.error("Error fetching notices:", error);
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  });

  app.post("/api/notices", async (req, res) => {
    try {
      let schoolId = req.body.schoolId;
      if (!schoolId || schoolId === "1") {
        const school = await storage.getSchoolBySlug("springfield");
        if (school) {
          schoolId = school.id;
        }
      }
      
      const noticeData = {
        ...req.body,
        schoolId,
      };
      
      // Validate with Zod schema
      const validationResult = insertNoticeSchema.safeParse(noticeData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const notice = await storage.createNotice(validationResult.data);
      res.status(201).json(notice);
    } catch (error) {
      console.error("Error creating notice:", error);
      res.status(500).json({ error: "Failed to create notice" });
    }
  });

  app.patch("/api/notices/:id", async (req, res) => {
    try {
      const notice = await storage.updateNotice(req.params.id, req.body);
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      res.json(notice);
    } catch (error) {
      console.error("Error updating notice:", error);
      res.status(500).json({ error: "Failed to update notice" });
    }
  });

  app.delete("/api/notices/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNotice(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Notice not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting notice:", error);
      res.status(500).json({ error: "Failed to delete notice" });
    }
  });

  // Notice approval workflow
  app.post("/api/notices/:id/submit", async (req, res) => {
    try {
      const notice = await storage.updateNotice(req.params.id, {
        status: "pending_approval",
      });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      res.json(notice);
    } catch (error) {
      console.error("Error submitting notice:", error);
      res.status(500).json({ error: "Failed to submit notice" });
    }
  });

  app.post("/api/notices/:id/approve", async (req, res) => {
    try {
      const notice = await storage.updateNotice(req.params.id, {
        status: "published",
        environment: "live",
      });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      res.json(notice);
    } catch (error) {
      console.error("Error approving notice:", error);
      res.status(500).json({ error: "Failed to approve notice" });
    }
  });

  app.post("/api/notices/:id/reject", async (req, res) => {
    try {
      const notice = await storage.updateNotice(req.params.id, {
        status: "draft",
      });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      res.json(notice);
    } catch (error) {
      console.error("Error rejecting notice:", error);
      res.status(500).json({ error: "Failed to reject notice" });
    }
  });

  // ============ LEADS API ROUTES ============

  // Get all leads for a school
  app.get("/api/leads", async (req, res) => {
    try {
      const schoolId = req.query.schoolId as string || "1";
      const status = req.query.status as string;
      
      let school = await storage.getSchool(schoolId);
      if (!school) {
        school = await storage.getSchoolBySlug("springfield");
      }
      
      if (!school) {
        return res.json([]);
      }
      
      const leadsList = await storage.getLeads(school.id, status);
      res.json(leadsList);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Get lead stats/analytics
  app.get("/api/leads/stats", async (req, res) => {
    try {
      const schoolId = req.query.schoolId as string || "1";
      
      let school = await storage.getSchool(schoolId);
      if (!school) {
        school = await storage.getSchoolBySlug("springfield");
      }
      
      if (!school) {
        return res.json([]);
      }
      
      const stats = await storage.getLeadStats(school.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ error: "Failed to fetch lead stats" });
    }
  });

  // Get a single lead
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      let schoolId = req.body.schoolId;
      if (!schoolId || schoolId === "1") {
        const school = await storage.getSchoolBySlug("springfield");
        if (school) {
          schoolId = school.id;
        }
      }
      
      const leadData = {
        ...req.body,
        schoolId,
      };
      
      const validationResult = insertLeadSchema.safeParse(leadData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const lead = await storage.createLead(validationResult.data);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // Update a lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const validationResult = insertLeadSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const lead = await storage.updateLead(req.params.id, validationResult.data);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // Delete a lead
  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // ============ STUDENT MANAGEMENT API ROUTES ============

  // Helper function to get school from query
  const getSchoolFromQuery = async (schoolId?: string) => {
    if (schoolId && schoolId !== "1") {
      return storage.getSchool(schoolId);
    }
    return storage.getSchoolBySlug("springfield");
  };

  // Students Dashboard Stats
  app.get("/api/students/dashboard-stats", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      const stats = await storage.getStudentDashboardStats(school.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Students CRUD
  app.get("/api/students", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const status = req.query.status as string;
      const studentsList = await storage.getStudents(school.id, status);
      res.json(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.body.schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // Auto-generate student ID if not provided
      let studentId = req.body.studentId;
      if (!studentId) {
        studentId = await storage.generateStudentId(school.id);
      }

      const studentData = {
        ...req.body,
        schoolId: school.id,
        studentId,
      };

      const validationResult = insertStudentSchema.safeParse(studentData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const student = await storage.createStudent(validationResult.data);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const validationResult = insertStudentSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const student = await storage.updateStudent(req.params.id, validationResult.data);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // Student Guardians
  app.get("/api/students/:id/guardians", async (req, res) => {
    try {
      const guardians = await storage.getStudentGuardians(req.params.id);
      res.json(guardians);
    } catch (error) {
      console.error("Error fetching student guardians:", error);
      res.status(500).json({ error: "Failed to fetch guardians" });
    }
  });

  // Guardians CRUD
  app.get("/api/guardians", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const guardiansList = await storage.getGuardians(school.id);
      res.json(guardiansList);
    } catch (error) {
      console.error("Error fetching guardians:", error);
      res.status(500).json({ error: "Failed to fetch guardians" });
    }
  });

  app.get("/api/guardians/:id", async (req, res) => {
    try {
      const guardian = await storage.getGuardian(req.params.id);
      if (!guardian) {
        return res.status(404).json({ error: "Guardian not found" });
      }
      res.json(guardian);
    } catch (error) {
      console.error("Error fetching guardian:", error);
      res.status(500).json({ error: "Failed to fetch guardian" });
    }
  });

  app.post("/api/guardians", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.body.schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const guardianData = {
        ...req.body,
        schoolId: school.id,
      };

      const validationResult = insertGuardianSchema.safeParse(guardianData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const guardian = await storage.createGuardian(validationResult.data);
      res.status(201).json(guardian);
    } catch (error) {
      console.error("Error creating guardian:", error);
      res.status(500).json({ error: "Failed to create guardian" });
    }
  });

  app.patch("/api/guardians/:id", async (req, res) => {
    try {
      const guardian = await storage.updateGuardian(req.params.id, req.body);
      if (!guardian) {
        return res.status(404).json({ error: "Guardian not found" });
      }
      res.json(guardian);
    } catch (error) {
      console.error("Error updating guardian:", error);
      res.status(500).json({ error: "Failed to update guardian" });
    }
  });

  app.delete("/api/guardians/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGuardian(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Guardian not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting guardian:", error);
      res.status(500).json({ error: "Failed to delete guardian" });
    }
  });

  // Student-Guardian Links
  app.post("/api/student-guardians", async (req, res) => {
    try {
      const validationResult = insertStudentGuardianSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const link = await storage.linkStudentGuardian(validationResult.data);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error linking student-guardian:", error);
      res.status(500).json({ error: "Failed to link student and guardian" });
    }
  });

  app.delete("/api/student-guardians/:id", async (req, res) => {
    try {
      const deleted = await storage.unlinkStudentGuardian(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Link not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error unlinking student-guardian:", error);
      res.status(500).json({ error: "Failed to unlink student and guardian" });
    }
  });

  // Classes CRUD
  app.get("/api/classes", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const academicYear = req.query.academicYear as string;
      const classesList = await storage.getClasses(school.id, academicYear);
      res.json(classesList);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.getClass(req.params.id);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      console.error("Error fetching class:", error);
      res.status(500).json({ error: "Failed to fetch class" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.body.schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const classData = {
        ...req.body,
        schoolId: school.id,
      };

      const validationResult = insertClassSchema.safeParse(classData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const newClass = await storage.createClass(validationResult.data);
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ error: "Failed to create class" });
    }
  });

  app.patch("/api/classes/:id", async (req, res) => {
    try {
      const classData = await storage.updateClass(req.params.id, req.body);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      console.error("Error updating class:", error);
      res.status(500).json({ error: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClass(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting class:", error);
      res.status(500).json({ error: "Failed to delete class" });
    }
  });

  // Class Enrollments
  app.get("/api/classes/:id/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments(req.params.id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  // Enrollments CRUD
  app.get("/api/students/:id/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getStudentEnrollments(req.params.id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const validationResult = insertEnrollmentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const enrollment = await storage.createEnrollment(validationResult.data);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ error: "Failed to create enrollment" });
    }
  });

  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.updateEnrollment(req.params.id, req.body);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating enrollment:", error);
      res.status(500).json({ error: "Failed to update enrollment" });
    }
  });

  app.delete("/api/enrollments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEnrollment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      res.status(500).json({ error: "Failed to delete enrollment" });
    }
  });

  // Admissions CRUD
  app.get("/api/admissions", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const status = req.query.status as string;
      const admissionsList = await storage.getAdmissions(school.id, status);
      res.json(admissionsList);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      res.status(500).json({ error: "Failed to fetch admissions" });
    }
  });

  app.get("/api/admissions/stats", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const stats = await storage.getAdmissionStats(school.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admission stats:", error);
      res.status(500).json({ error: "Failed to fetch admission stats" });
    }
  });

  app.get("/api/admissions/:id", async (req, res) => {
    try {
      const admission = await storage.getAdmission(req.params.id);
      if (!admission) {
        return res.status(404).json({ error: "Admission not found" });
      }
      res.json(admission);
    } catch (error) {
      console.error("Error fetching admission:", error);
      res.status(500).json({ error: "Failed to fetch admission" });
    }
  });

  app.post("/api/admissions", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.body.schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // Auto-generate application number if not provided
      let applicationNumber = req.body.applicationNumber;
      if (!applicationNumber) {
        applicationNumber = await storage.generateApplicationNumber(school.id);
      }

      // Generate QR token for tracking
      const qrToken = randomBytes(16).toString('hex');

      const admissionData = {
        ...req.body,
        schoolId: school.id,
        applicationNumber,
        qrToken,
      };

      const validationResult = insertAdmissionSchema.safeParse(admissionData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const admission = await storage.createAdmission(validationResult.data);
      res.status(201).json(admission);
    } catch (error) {
      console.error("Error creating admission:", error);
      res.status(500).json({ error: "Failed to create admission" });
    }
  });

  app.patch("/api/admissions/:id", async (req, res) => {
    try {
      const validationResult = insertAdmissionSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const admission = await storage.updateAdmission(req.params.id, validationResult.data);
      if (!admission) {
        return res.status(404).json({ error: "Admission not found" });
      }
      res.json(admission);
    } catch (error) {
      console.error("Error updating admission:", error);
      res.status(500).json({ error: "Failed to update admission" });
    }
  });

  app.delete("/api/admissions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAdmission(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Admission not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting admission:", error);
      res.status(500).json({ error: "Failed to delete admission" });
    }
  });

  // Convert admission to student (enrollment)
  app.post("/api/admissions/:id/enroll", async (req, res) => {
    try {
      const admission = await storage.getAdmission(req.params.id);
      if (!admission) {
        return res.status(404).json({ error: "Admission not found" });
      }

      if (admission.status !== "accepted") {
        return res.status(400).json({ error: "Can only enroll accepted admissions" });
      }

      // Generate student ID
      const studentId = await storage.generateStudentId(admission.schoolId);

      // Create student from admission data
      const studentData = {
        schoolId: admission.schoolId,
        studentId,
        firstName: admission.studentFirstName,
        lastName: admission.studentLastName,
        dateOfBirth: admission.dateOfBirth,
        gender: admission.gender,
        address: admission.address,
        status: "active" as const,
      };

      const student = await storage.createStudent(studentData);

      // Create guardian from admission data
      const guardianData = {
        schoolId: admission.schoolId,
        firstName: admission.guardianName.split(' ')[0] || admission.guardianName,
        lastName: admission.guardianName.split(' ').slice(1).join(' ') || '',
        email: admission.guardianEmail,
        phone: admission.guardianPhone,
        relationship: admission.guardianRelationship || "parent",
      };

      const guardian = await storage.createGuardian(guardianData);

      // Link student and guardian
      await storage.linkStudentGuardian({
        studentId: student.id,
        guardianId: guardian.id,
        isPrimary: true,
        canPickup: true,
      });

      // Update admission status to enrolled
      await storage.updateAdmission(req.params.id, { status: "enrolled" });

      res.status(201).json({ 
        success: true, 
        student, 
        guardian,
        message: "Student enrolled successfully" 
      });
    } catch (error) {
      console.error("Error enrolling admission:", error);
      res.status(500).json({ error: "Failed to enroll admission" });
    }
  });

  // Subjects CRUD
  app.get("/api/subjects", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json([]);
      }
      const subjectsList = await storage.getSubjects(school.id);
      res.json(subjectsList);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.body.schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const subjectData = {
        ...req.body,
        schoolId: school.id,
      };

      const validationResult = insertSubjectSchema.safeParse(subjectData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const subject = await storage.createSubject(validationResult.data);
      res.status(201).json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Failed to create subject" });
    }
  });

  app.patch("/api/subjects/:id", async (req, res) => {
    try {
      const subject = await storage.updateSubject(req.params.id, req.body);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      console.error("Error updating subject:", error);
      res.status(500).json({ error: "Failed to update subject" });
    }
  });

  app.delete("/api/subjects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSubject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ error: "Failed to delete subject" });
    }
  });

  // Attendance CRUD
  app.get("/api/attendance", async (req, res) => {
    try {
      const classId = req.query.classId as string;
      const date = req.query.date as string;
      
      if (!classId || !date) {
        return res.status(400).json({ error: "classId and date are required" });
      }
      
      const attendanceList = await storage.getAttendance(classId, date);
      res.json(attendanceList);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.get("/api/attendance/stats", async (req, res) => {
    try {
      const school = await getSchoolFromQuery(req.query.schoolId as string);
      if (!school) {
        return res.json({ present: 0, absent: 0, late: 0, total: 0 });
      }
      const stats = await storage.getAttendanceStats(school.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
      res.status(500).json({ error: "Failed to fetch attendance stats" });
    }
  });

  app.get("/api/students/:id/attendance", async (req, res) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const attendanceList = await storage.getStudentAttendance(req.params.id, startDate, endDate);
      res.json(attendanceList);
    } catch (error) {
      console.error("Error fetching student attendance:", error);
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const validationResult = insertAttendanceSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const record = await storage.createAttendance(validationResult.data);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(500).json({ error: "Failed to create attendance" });
    }
  });

  app.post("/api/attendance/bulk", async (req, res) => {
    try {
      const records = req.body.records as any[];
      if (!Array.isArray(records)) {
        return res.status(400).json({ error: "records must be an array" });
      }

      const validatedRecords = [];
      for (const record of records) {
        const validationResult = insertAttendanceSchema.safeParse(record);
        if (!validationResult.success) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: validationResult.error.errors 
          });
        }
        validatedRecords.push(validationResult.data);
      }

      const results = await storage.bulkCreateAttendance(validatedRecords);
      res.status(201).json(results);
    } catch (error) {
      console.error("Error bulk creating attendance:", error);
      res.status(500).json({ error: "Failed to create attendance records" });
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const record = await storage.updateAttendance(req.params.id, req.body);
      if (!record) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
      res.json(record);
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ error: "Failed to update attendance" });
    }
  });

  // Grades CRUD
  app.get("/api/students/:id/grades", async (req, res) => {
    try {
      const academicYear = req.query.academicYear as string;
      const grades = await storage.getGrades(req.params.id, academicYear);
      res.json(grades);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      res.status(500).json({ error: "Failed to fetch grades" });
    }
  });

  app.get("/api/grades/class", async (req, res) => {
    try {
      const classId = req.query.classId as string;
      const subjectId = req.query.subjectId as string;
      const term = req.query.term as string;

      if (!classId || !subjectId || !term) {
        return res.status(400).json({ error: "classId, subjectId, and term are required" });
      }

      const grades = await storage.getClassGrades(classId, subjectId, term);
      res.json(grades);
    } catch (error) {
      console.error("Error fetching class grades:", error);
      res.status(500).json({ error: "Failed to fetch grades" });
    }
  });

  app.post("/api/grades", async (req, res) => {
    try {
      const validationResult = insertGradeSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const grade = await storage.createGrade(validationResult.data);
      res.status(201).json(grade);
    } catch (error) {
      console.error("Error creating grade:", error);
      res.status(500).json({ error: "Failed to create grade" });
    }
  });

  app.patch("/api/grades/:id", async (req, res) => {
    try {
      const grade = await storage.updateGrade(req.params.id, req.body);
      if (!grade) {
        return res.status(404).json({ error: "Grade not found" });
      }
      res.json(grade);
    } catch (error) {
      console.error("Error updating grade:", error);
      res.status(500).json({ error: "Failed to update grade" });
    }
  });

  app.delete("/api/grades/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGrade(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Grade not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting grade:", error);
      res.status(500).json({ error: "Failed to delete grade" });
    }
  });

  // Progress Tokens (for QR-based parent access)
  app.get("/api/students/:id/progress-tokens", async (req, res) => {
    try {
      const tokens = await storage.getStudentProgressTokens(req.params.id);
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching progress tokens:", error);
      res.status(500).json({ error: "Failed to fetch progress tokens" });
    }
  });

  app.post("/api/progress-tokens", async (req, res) => {
    try {
      // Generate unique token
      const token = randomBytes(32).toString('hex');
      
      const tokenData = {
        ...req.body,
        token,
        isRevoked: false,
      };

      const validationResult = insertProgressTokenSchema.safeParse(tokenData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const progressToken = await storage.createProgressToken(validationResult.data);
      res.status(201).json(progressToken);
    } catch (error) {
      console.error("Error creating progress token:", error);
      res.status(500).json({ error: "Failed to create progress token" });
    }
  });

  app.post("/api/progress-tokens/:id/revoke", async (req, res) => {
    try {
      const revoked = await storage.revokeProgressToken(req.params.id);
      if (!revoked) {
        return res.status(404).json({ error: "Token not found" });
      }
      res.json({ success: true, message: "Token revoked" });
    } catch (error) {
      console.error("Error revoking progress token:", error);
      res.status(500).json({ error: "Failed to revoke token" });
    }
  });

  // ============ PUBLIC API ROUTES ============

  // Public lead submission (for website inquiry forms)
  app.post("/api/public/leads/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      
      const leadData = {
        ...req.body,
        schoolId: school.id,
        source: req.body.source || "website",
        status: "new",
      };
      
      const validationResult = insertLeadSchema.safeParse(leadData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }
      
      const lead = await storage.createLead(validationResult.data);
      res.status(201).json({ success: true, message: "Thank you for your inquiry! We will contact you soon." });
    } catch (error) {
      console.error("Error creating public lead:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });
  
  app.get("/api/public/school/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error fetching public school:", error);
      res.status(500).json({ error: "Failed to fetch school" });
    }
  });

  app.get("/api/public/sections/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.json([]);
      }
      
      // Only return live, published sections
      const sections = await storage.getSections(school.id, "live");
      const publishedSections = sections.filter(s => s.status === "published");
      res.json(publishedSections);
    } catch (error) {
      console.error("Error fetching public sections:", error);
      res.status(500).json({ error: "Failed to fetch sections" });
    }
  });

  app.get("/api/public/notices/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.json([]);
      }
      
      // Only return live, published notices
      const noticesList = await storage.getNotices(school.id, "live");
      const publishedNotices = noticesList.filter(n => n.status === "published");
      res.json(publishedNotices);
    } catch (error) {
      console.error("Error fetching public notices:", error);
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  });

  // Public admission inquiry submission
  app.post("/api/public/admissions/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // Auto-generate application number
      const applicationNumber = await storage.generateApplicationNumber(school.id);
      
      // Generate QR token for tracking
      const qrToken = randomBytes(16).toString('hex');

      const admissionData = {
        ...req.body,
        schoolId: school.id,
        applicationNumber,
        qrToken,
        status: "inquiry",
        source: req.body.source || "website",
      };

      const validationResult = insertAdmissionSchema.safeParse(admissionData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationResult.error.errors 
        });
      }

      const admission = await storage.createAdmission(validationResult.data);
      res.status(201).json({ 
        success: true, 
        applicationNumber: admission.applicationNumber,
        trackingToken: admission.qrToken,
        message: "Thank you for your admission inquiry! Track your application using the provided token." 
      });
    } catch (error) {
      console.error("Error creating public admission:", error);
      res.status(500).json({ error: "Failed to submit admission inquiry" });
    }
  });

  // Track admission status via QR token
  app.get("/api/public/admission-status/:token", async (req, res) => {
    try {
      // Find admission by QR token
      const school = await storage.getSchoolBySlug("springfield");
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      const admissions = await storage.getAdmissions(school.id);
      const admission = admissions.find(a => a.qrToken === req.params.token);
      
      if (!admission) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Return limited info for public access
      res.json({
        applicationNumber: admission.applicationNumber,
        studentName: `${admission.studentFirstName} ${admission.studentLastName}`,
        gradeApplying: admission.gradeApplying,
        status: admission.status,
        submittedAt: admission.createdAt,
      });
    } catch (error) {
      console.error("Error fetching admission status:", error);
      res.status(500).json({ error: "Failed to fetch admission status" });
    }
  });

  // Parent Portal - Access student progress via QR token
  app.get("/api/portal/:token", async (req, res) => {
    try {
      const tokenData = await storage.getProgressToken(req.params.token);
      if (!tokenData) {
        return res.status(404).json({ error: "Invalid or expired access token" });
      }

      // Check expiration
      if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date()) {
        return res.status(401).json({ error: "Access token has expired" });
      }

      const student = tokenData.student;
      
      // Get student's attendance (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const attendance = await storage.getStudentAttendance(
        student.id,
        thirtyDaysAgo.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      // Get student's grades
      const currentYear = new Date().getFullYear().toString();
      const grades = await storage.getGrades(student.id, currentYear);

      // Get enrollments
      const enrollments = await storage.getStudentEnrollments(student.id);

      res.json({
        student: {
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          photo: student.photo,
          status: student.status,
        },
        attendance: {
          records: attendance,
          summary: {
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            late: attendance.filter(a => a.status === 'late').length,
            total: attendance.length,
          }
        },
        grades,
        enrollments: enrollments.map(e => ({
          class: e.class.name,
          grade: e.class.grade,
          section: e.class.section,
          academicYear: e.academicYear,
          rollNumber: e.rollNumber,
          status: e.status,
        })),
      });
    } catch (error) {
      console.error("Error fetching portal data:", error);
      res.status(500).json({ error: "Failed to fetch student progress" });
    }
  });

  return httpServer;
}
