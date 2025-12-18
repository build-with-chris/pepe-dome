# Product Roadmap

## Phase 1: Foundation & Design System (COMPLETED)

1. [x] **Design System & Component Library** — Extracted golden theatre lighting design system from PEPE Shows with warm gold (#D4A574) and bronze (#B8860B) accents; created comprehensive design tokens (colors, typography, spacing, animations); built production-ready React component library (Button, Card, EventCard, NewsCard, Input) with accessibility and responsive layouts; documented in DESIGN_SYSTEM.md and COMPONENT_LIBRARY.md `M`

2. [x] **Logo Integration & Brand Identity** — Updated Navbar to use PEPE_logos_dome.svg (white "PEPE" + golden "DOME"); established Outfit font for display/headings and Inter font for body text; implemented glassmorphism effects and hover animations `XS`

3. [x] **Core Page Structure** — Set up Next.js 15 app router with main navigation, homepage hub layout, responsive container system (.stage-container), and shared layout components (Navbar with sticky behavior, Footer) `S`

## Phase 2: Content Foundation

4. [ ] **Database Schema & API Foundation** — Set up PostgreSQL database with tables for events, news articles, subscribers, and newsletters; create RESTful API endpoints for CRUD operations; implement Prisma ORM with TypeScript types; database migrations and seeding with sample data `M`

5. [ ] **Event Module** — Create event listing page using EventCard component in responsive grids (1/2/3 columns); implement upcoming/past event filtering; individual event detail pages with full information (image, description, time, location, category, ticket link); month-based calendar filtering with featured event support `M`

6. [ ] **News & Magazine Module** — Build news article listing page using NewsCard component with grid layouts; article detail pages with rich text content and author information; category and tag filtering system; cross-linking between news and events; featured article variant support `M`

## Phase 3: Newsletter System

7. [ ] **Newsletter Landing Pages** — Generate static HTML pages for monthly newsletters from event data (e.g., /newsletter/2025-10); create responsive email-friendly templates using design system components; implement automatic content aggregation by month; build public archive view of past newsletters `M`

8. [ ] **Resend Email Integration** — Integrate Resend API for email delivery; create email templates matching web design with golden theme; implement test sending functionality to sample addresses; build preview system for email rendering across clients (Gmail, Outlook, Apple Mail) `S`

## Phase 4: Admin & Content Management

9. [ ] **Admin Authentication & Dashboard** — Implement secure login system using NextAuth.js or Supabase Auth; create protected admin routes with role-based access control; build main admin dashboard with content overview, quick actions, and recent activity feed `M`

10. [ ] **Admin Content Management** — Build admin interfaces for creating/editing/deleting news articles and events; implement rich text editor for article content with image embedding; add image upload and management via Vercel Blob or Supabase Storage; create draft/publish workflow for content approval; reuse EventCard and NewsCard components in admin preview `L`

11. [ ] **Newsletter Management Interface** — Create admin UI for viewing auto-generated newsletter drafts; implement editing capabilities for customizing content before sending; build recipient list management with segmentation options (Training, Shows, Business); add sending log with delivery status tracking and engagement metrics `M`

## Phase 5: Lead Generation & Analytics

12. [ ] **Lead Collection & GDPR Compliance** — Build email opt-in forms using Input component for homepage, event pages, and news articles; implement double opt-in workflow via Resend with branded confirmation emails; create subscriber management with categories; add GDPR-compliant consent tracking, data export, and unsubscribe handling `M`

13. [ ] **Analytics & Reporting Dashboard** — Integrate subscriber growth tracking with visualizations; implement newsletter open and click-rate metrics via Resend webhooks; add event page view analytics; create admin dashboard widgets for key performance indicators (KPIs); subscriber engagement scoring `S`

## Phase 6: Polish & Launch

14. [ ] **Testing, Refinement & Beta Launch** — Conduct end-to-end testing of all user flows (visitor browsing, newsletter subscription, admin content management); test email rendering across major clients (Gmail, Outlook, Apple Mail, mobile); perform security audit of authentication and data handling; optimize performance and loading times with Next.js optimization features; conduct accessibility audit (WCAG 2.1 AA compliance); deploy to Vercel production environment with monitoring `L`

> Notes
> - Phase 1 (Design System) is COMPLETE - all components and documentation created
> - Order reflects technical dependencies: design system enables consistent UI development; database foundation precedes content features; content modules precede newsletter automation; authentication precedes admin features
> - Each item represents a complete, testable feature that includes both frontend UI (using component library) and backend API/database integration
> - Newsletter landing pages come before Resend integration to allow testing of content generation independently from email delivery
> - Component library (EventCard, NewsCard, Button, Card, Input) should be used throughout to maintain design consistency
> - GDPR compliance is implemented before beta launch to ensure legal requirements are met from day one
> - All new UI should follow the golden theatre lighting design system documented in DESIGN_SYSTEM.md
