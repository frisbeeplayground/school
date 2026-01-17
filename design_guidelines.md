# Design Guidelines: School CMS Platform

## Design Approach

**CMS Admin Interface**: Design System approach using **Material Design** principles - optimized for data-heavy, multi-user productivity tools with clear state management and workflow clarity.

**Public School Websites**: Reference-based approach inspired by modern educational platforms (university websites, modern school sites) - professional, trustworthy, accessible, with emphasis on content hierarchy and readability.

---

## Core Design Principles

### CMS Admin
- **Workflow Clarity**: Visual distinction between sandbox/live states, approval statuses
- **Information Density**: Efficient use of space for content management
- **Action Confidence**: Clear, unmistakable CTAs for critical publishing actions

### Public Website
- **Trust & Authority**: Professional aesthetic appropriate for educational institutions
- **Content-First**: Typography and readability prioritized over decoration
- **Multi-Purpose Flexibility**: Support diverse school content (academics, events, admissions, news)

---

## Typography

**CMS Admin Interface**
- Primary: Inter (400, 500, 600) via Google Fonts
- Headings: 24px (sections), 18px (subsections), 14px (cards)
- Body: 14px regular, 16px for main content areas
- Code/Technical: 13px monospace for IDs, timestamps

**Public School Website**
- Headings: Playfair Display (700) for major headings, Inter (600) for subheadings
- Body: Inter (400, 500) - 16px base, 18px for featured content
- Hierarchy: h1 (48px), h2 (36px), h3 (24px), h4 (20px), body (16px)

---

## Layout System

**Spacing Units**: Tailwind scale - primary units are 4, 6, 8, 12, 16, 24 (p-4, m-6, gap-8, py-12, etc.)

**CMS Admin Grid**: 12-column responsive grid, fixed sidebar navigation (256px), fluid content area

**Public Website Grid**: Container-based with max-w-6xl for content, full-bleed for heroes/images

---

## Component Library

### CMS Admin Interface

**Navigation & Layout**
- Left sidebar (256px fixed): Logo, environment indicator, main nav, user profile
- Top bar: School selector, environment toggle (Sandbox/Live with visual badge), breadcrumb, actions
- Content area: Card-based sections with clear headers

**Environment & Status Indicators**
- Sandbox mode: Amber badge with subtle amber tint on sidebar
- Live mode: Green badge, neutral sidebar
- Status pills: Draft (gray), Pending Approval (amber), Published (green)
- Visual banner across top when in Sandbox: "Editing Sandbox Version"

**Content Management**
- Section cards: Drag handle (future), section type icon, title, edit/delete actions
- Form controls: Material-style inputs with floating labels
- Preview pane: Split-screen or modal showing actual website render

**Action Buttons** (in order of visual weight)
- Primary: "Publish" (green, prominent when approved)
- Secondary: "Submit for Approval" (blue)
- Tertiary: "Save Draft" (gray outline)
- Utility: "Preview" (ghost with eye icon)

**Data Tables**
- Notices, Events: Striped rows, sortable headers, inline edit icons
- Pinned items: Top position with pin icon
- Bulk actions: Checkbox column, action bar appears on selection

**Approval Workflow UI**
- Pending items: Dedicated queue card with approval actions
- Diff viewer: Side-by-side or inline changes visualization
- Approval actions: Approve (green), Reject (red), Request Changes (amber)

### Public School Website

**Hero Section**
- Full-width, 70vh height, background image with subtle overlay
- Centered content: School name (h1), tagline, primary CTA
- CTA buttons: Blurred background (backdrop-blur-sm), white text

**Navigation**
- Sticky header: School logo, horizontal menu, secondary CTAs
- Mobile: Hamburger menu, slide-in drawer
- Mega-menu support: For complex school navigation structures

**Content Sections** (modular)
- Feature cards: 3-column grid (lg), 2-col (md), 1-col (sm) with icons, headings, descriptions
- News/Events: Card grid with image, date badge, title, excerpt, read more
- Notices: List-based with pinned items highlighted, icon indicators, download buttons
- Image galleries: Masonry layout or standard grid
- Contact/Info: 2-column split (form + map/info)

**Footer**
- Multi-column: Quick links, contact info, social links
- School branding: Logo, address, credentials
- Newsletter signup: Email input with CTA button

---

## Images

**CMS Admin**: Minimal decorative imagery, focus on icons and UI chrome

**Public School Website**:
- **Hero**: Large, high-quality school photo (students, campus, activities) - 1920x1080 minimum
- **Section Headers**: 16:9 aspect ratio images for major sections
- **Cards**: Square thumbnails (1:1) for events/news, 400x400px
- **Gallery**: Mixed aspect ratios supported, minimum 800px width
- **Placement**: Hero (mandatory), about section, events/news cards, faculty profiles, campus life

---

## Accessibility & Interaction

- Focus states: 2px blue outline (admin), school brand color (website)
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Keyboard navigation: Full support, skip links, logical tab order
- Screen readers: Semantic HTML, ARIA labels for state indicators
- Loading states: Skeleton screens for content, spinners for actions
- Error handling: Inline validation, toast notifications for success/errors

---

## Critical CMS-Specific Patterns

**Preview Mode**: Iframe or new tab showing sandbox site with "Preview Mode" banner, close button returns to edit

**Publishing Safety**: Confirmation modals for publish actions, diff preview before approval

**Responsive Editing**: Admin interface desktop-first (1280px+), public website mobile-first

**Multi-Tenancy**: School branding customizable (logo, colors) but consistent chrome/UX

This design creates professional distinction between the utility-focused admin interface and content-rich public websites while maintaining cohesive quality standards across the platform.