import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPageSectionSchema, insertNoticeSchema, insertSchoolSchema, insertLeadSchema } from "@shared/schema";

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

  return httpServer;
}
