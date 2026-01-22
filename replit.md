# School CMS Platform

## Overview

A multi-tenant School Content Management System (CMS) that enables educational institutions to manage their website content through a sandbox/live publishing workflow. The platform consists of two main interfaces:

1. **CMS Admin Interface** - A data-heavy productivity tool for content editors to manage page sections, notices, and approval workflows
2. **Public School Websites** - Professional, accessible school websites served per-tenant via slug-based routing

The system implements a staging/approval/publish architecture where content changes are made in a sandbox environment, submitted for approval, and then published to the live site.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router) with flat route structure using `withCMSLayout` HOC wrapper for CMS pages
- **State Management**: TanStack Query for server state, React Context for UI state (theme, CMS environment, current school)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, supporting light/dark modes
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration for type-safe schemas

### Data Model
The core entities are:
- **Schools** - Multi-tenant root entity with branding (colors, logo, slug)
- **Page Sections** - Configurable content blocks (hero, features, about, gallery, etc.) with position ordering
- **Notices** - Announcements with pinning and file attachments
- **Users** - Authentication with role-based access (editor, admin roles implied)
- **Leads** - Prospective inquiry tracking with status workflow

**Student Management System (SMS) Entities:**
- **Students** - Student records with auto-generated IDs (STU{YY}{0000}) and status tracking (active/inactive/graduated/transferred)
- **Guardians** - Parent/guardian contact information
- **StudentGuardians** - Many-to-many linking between students and guardians with relationship types
- **Classes** - Class/section management with capacity tracking
- **Enrollments** - Student-class associations with roll numbers and status workflow
- **Admissions** - Application pipeline with 9-stage workflow (inquiry→applied→documents_pending→under_review→interview_scheduled→accepted→enrolled→rejected→withdrawn)
- **Subjects** - Academic subjects with optional teacher assignment
- **Attendance** - Daily attendance tracking with multiple statuses (present/absent/late/excused/half_day)
- **Grades** - Academic performance records with exam types and terms
- **ProgressTokens** - Secure tokens for parent portal QR-based access with expiration and revocation

Content supports dual environments (`sandbox` | `live`) and status workflow (`draft` | `pending_approval` | `published`).

### Routing Structure
- `/` - Landing page
- `/cms/*` - Admin CMS interface (dashboard, sections, notices, approvals, settings)
- `/cms/students` - Student directory with search, filters, QR code generation, and ID card view
- `/cms/students/new` - Student registration form
- `/cms/admissions` - Admission applications pipeline with 9-stage workflow
- `/cms/classes` - Class/section management
- `/cms/attendance` - Daily attendance marking interface with date navigation
- `/site/:slug` - Live public website per school
- `/preview/:slug` - Sandbox preview per school
- `/portal/:token` - Parent portal access via secure progress token (QR-based access)

### Design System
- **CMS Admin**: Material Design principles - Inter font, information-dense layouts, clear workflow states
- **Public Website**: Content-first with Playfair Display headings, professional educational aesthetic

## External Dependencies

### Database
- **PostgreSQL** - Primary data store (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit** - Database migrations and schema push (`db:push` script)

### Key NPM Packages
- `@tanstack/react-query` - Server state management and caching
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `react-hook-form` / `@hookform/resolvers` - Form handling with Zod validation
- `date-fns` - Date formatting utilities
- `express-session` / `connect-pg-simple` - Session management (prepared for auth)
- `qrcode` - QR code generation for parent portal access tokens
- Full shadcn/ui component set via Radix UI primitives

### Development Tools
- Replit-specific Vite plugins for development experience
- ESBuild for production server bundling
- TypeScript with strict mode and path aliases (`@/*`, `@shared/*`)