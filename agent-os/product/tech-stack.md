# Tech Stack

## Overview
Pepe Dome Beta Platform uses a modern, type-safe web stack optimized for content management, email delivery, and rapid iteration. The architecture prioritizes developer experience, performance, and maintainability while leveraging proven tools. The design system is based on PEPE Shows' golden theatre lighting aesthetic.

## Frontend

### Framework & Runtime
- **Next.js 15.5.4** with App Router for server-side rendering, file-based routing, and API routes
- **React 19.1.1** for component-based UI development with latest concurrent features
- **TypeScript 5.9.2** in strict mode for type safety across the entire application
- **Node.js 20+** as the JavaScript runtime

**Rationale:** Next.js 15 provides excellent SEO for news and event content, built-in API routes for backend functionality, and fast page loads through automatic code splitting. React 19 brings improved performance and developer experience. TypeScript prevents runtime errors and improves code quality.

### Styling & Design System
- **Tailwind CSS 4.1.13** with CSS custom properties for theming and responsive design
- **CSS Design Tokens** defined in `src/styling/tokens.css` for consistent design system
- **Golden Theatre Lighting Theme** with warm gold (#D4A574) and bronze (#B8860B) accents
- **Component Library** located in `src/components/ui/` with production-ready components:
  - **Button** - 3 variants (primary/secondary/ghost), 5 sizes (xs/sm/md/lg/xl)
  - **EventCard** - Responsive grid layouts, featured and compact variants
  - **NewsCard** - Grid layouts with featured variant support
  - **Card** - Base container with default/glass/interactive variants
  - **Input** - Form input with consistent styling and focus states
- **Glassmorphism Effects** with backdrop blur for modern, layered UI
- **Accessibility Built-in** - WCAG 2.1 AA compliance with focus indicators, semantic HTML, and keyboard navigation

**Rationale:** Tailwind CSS 4 enables rapid UI development with modern features. Custom CSS properties provide theme flexibility. The component library ensures design consistency across all pages while maintaining accessibility standards. The golden theatre aesthetic creates emotional connection with the venue's live performance identity.

### Typography
- **Outfit** (Google Fonts) for display text, headings, logo, and UI labels - conveys theatrical personality
- **Inter** (Google Fonts) for body text, paragraphs, and form inputs - ensures readability
- **JetBrains Mono** (optional, Google Fonts) for code snippets and technical content
- **Fluid Type Scale** from 12px (text-xs) to 96px (text-7xl) with responsive sizing

**Rationale:** Outfit provides theatrical personality for headings and branding. Inter ensures excellent readability across screen sizes for body content. Fluid typography adapts smoothly across all device sizes.

### State Management
- **React Context** for simple global state (theme, user session)
- **TanStack Query** (planned) for server state management and API caching
- **Zustand** (optional) if complex client state is needed (e.g., multi-step forms)

**Rationale:** TanStack Query handles API data fetching, caching, and synchronization, reducing boilerplate and improving UX with optimistic updates. Context is sufficient for simple global state without introducing complexity.

## Backend

### Application Framework
- **Next.js API Routes** for backend endpoints (integrated with frontend)
- **TypeScript** for type-safe API handlers and business logic
- **Option: Express.js** if separate backend service is needed for complex business logic

**Rationale:** Next.js API routes keep frontend and backend in a single codebase, simplifying deployment and reducing context switching. Express can be introduced later if microservices architecture is required.

### Database & ORM
- **PostgreSQL** (planned) as the primary relational database for structured data (events, news, subscribers, newsletters)
- **Prisma** (planned) as the ORM for type-safe database queries and schema migrations
- **Supabase** (optional) as a Backend-as-a-Service for PostgreSQL hosting, authentication, and real-time features

**Rationale:** PostgreSQL provides robust relational data handling with excellent performance for content-heavy applications. Prisma generates TypeScript types from database schema, ensuring type safety across the entire stack. Supabase offers managed PostgreSQL with built-in auth and is cost-effective for beta deployment.

### Caching
- **Redis** (optional, if needed) for caching frequently accessed data like event listings or newsletter archives

**Rationale:** Redis can improve performance for high-traffic pages but is not required for beta launch. Can be added as traffic grows.

## Third-Party Services

### Email Delivery
- **Resend** (planned) for newsletter sending, transactional emails (double opt-in confirmations), and email analytics
- **React Email** (optional) for building email templates with React components

**Rationale:** Resend provides a modern API designed for developers, excellent deliverability rates, and built-in analytics for tracking opens and clicks. Integrates seamlessly with React Email for template creation matching the golden theatre design.

### Authentication
- **NextAuth.js** or **Supabase Auth** (planned) for admin login and session management
- **Role-based access control** for editorial team permissions

**Rationale:** NextAuth.js integrates natively with Next.js and supports multiple authentication providers. Supabase Auth is a strong alternative if using Supabase for database hosting, reducing vendor count.

### File Storage
- **Vercel Blob** or **Supabase Storage** (planned) for image uploads (event photos, article images, author avatars)

**Rationale:** Vercel Blob integrates seamlessly with Next.js deployments. Supabase Storage is a cost-effective alternative with built-in CDN and image transformations.

## Testing & Quality

### Testing Frameworks
- **Vitest** (planned) for unit and integration tests of utilities and API logic
- **Playwright** (planned) for end-to-end tests of critical user flows (newsletter subscription, event browsing, admin workflows)
- **React Testing Library** (planned) for component testing

**Rationale:** Vitest is fast and integrates well with Vite-based tooling. Playwright provides reliable cross-browser testing for complex flows like newsletter sending and form submissions.

### Code Quality Tools
- **ESLint 9.36.0** for linting TypeScript/JavaScript code
- **Prettier** (planned) for consistent code formatting (2-space indentation, single quotes, no semicolons)
- **TypeScript strict mode** with `tsc --noEmit` in CI to catch type errors

**Rationale:** Automated tooling ensures code consistency across the team and catches errors before runtime.

## Deployment & Infrastructure

### Hosting & Deployment
- **Vercel** (planned) for frontend and full-stack Next.js deployment with automatic preview deployments for pull requests
- **Vercel Analytics** (planned) for web analytics and performance monitoring
- **GitHub Actions** (planned) for CI/CD (running tests, type checks, and linting on every commit)

**Rationale:** Vercel provides zero-config deployment for Next.js with edge caching, automatic HTTPS, and preview URLs for testing. Tight integration with GitHub enables seamless collaboration.

### Environment Management
- **Vercel Environment Variables** (planned) for production secrets (database URL, Resend API key, NextAuth secret)
- **.env.local** for local development environment variables
- **.env.example** in repository as a template for required variables

**Rationale:** Vercel's environment variable management keeps secrets secure and allows different configurations per environment (development, preview, production).

### Monitoring & Logging
- **Vercel Monitoring** (planned) for basic performance metrics and error tracking
- **Sentry** (optional) for advanced error tracking and performance monitoring if needed

**Rationale:** Vercel's built-in monitoring is sufficient for beta launch. Sentry can be added later for detailed error reporting and user impact analysis.

## Development Tools

### Package Management
- **npm** as the primary package manager (standard for Next.js projects)

**Rationale:** npm is stable, widely supported, and integrates well with Vercel deployments. pnpm can be considered later if monorepo structure is needed.

### Version Control
- **Git** with **GitHub** for source control and collaboration
- **Feature branch workflow** with pull requests requiring review before merging to `main`

**Rationale:** GitHub provides robust code review tools, issue tracking, and integrates with Vercel for automatic deployments.

### Code Editor Configuration
- **VSCode** with recommended extensions (ESLint, Prettier, Tailwind CSS IntelliSense)
- **Format on save** enabled for consistent code style
- **EditorConfig** for cross-editor consistency

**Rationale:** Standardized editor configuration reduces friction and ensures all team members follow the same coding standards.

## Design System

### Brand Identity
- **Logo**: PEPE_logos_dome.svg (white "PEPE" + golden "DOME" in Outfit Bold)
- **Location**: `/public/PEPE_logos_dome.svg`

### Color Palette - Golden Theatre Lighting
- **Primary Gold**: #D4A574 - Warm theatre spotlight for primary accents
- **Bronze**: #B8860B - Depth and richness for CTAs and interactive elements
- **Black Tones**: #000000 (pure black), #111111 (dark), #161616 (ink), #1A1A1A (surface)
- **Text Hierarchy**: White at 100%, 80%, 64%, 48%, 32% opacity levels
- **Semantic Colors**: Success (#00DC82), Warning (#FFB800), Error (#FF3B3B), Info (#0096FF)

**Rationale:** The golden theatre lighting theme creates emotional connection with live performance while maintaining professional readability. High contrast (21:1 ratio for primary text) ensures accessibility.

### Layout & Spacing
- **Container**: `.stage-container` with max-width 1280px, responsive padding
- **Section Spacing**: 64-96px vertical padding (section, section-hero, section-compact)
- **Grid Layouts**: Responsive 1/2/3 column grids (`.event-grid`, `.news-grid`)
- **Border Radius**: 0.25rem (sm) to 1.5rem (3xl) based on element importance
- **Spacing Scale**: 4px base unit (0.25rem) up to 96px (6rem)

### Animations & Effects
- **Timing Functions**: Linear, ease-in, ease-out, ease-in-out, spring, bounce
- **Durations**: 150ms (fast), 300ms (normal), 500ms (slow), 1000ms (slowest)
- **Hover Effects**: Lift (translateY -4px), glow (gold shadow), scale, brightness
- **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
- **Motion Preferences**: Respects `prefers-reduced-motion` for accessibility

### Breakpoints
- **sm**: 640px (Small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Large desktops)

**Mobile-first approach**: Start with mobile styles, progressively enhance with md: and lg: prefixes.

### Documentation
- **Design System Guide**: `/DESIGN_SYSTEM.md` - Complete design tokens, components, patterns
- **Component Library Guide**: `/COMPONENT_LIBRARY.md` - Usage examples for all UI components
- **Token Definitions**: `/src/styling/tokens.css` - CSS custom properties
- **Component Styles**: `/src/styling/card-components.css` - Event and news card styling

## Security & Compliance

### Data Protection
- **GDPR compliance** (planned) with explicit consent tracking, double opt-in for email subscriptions, and data export capabilities
- **Environment variable security** - no secrets committed to repository
- **SQL injection protection** via Prisma's parameterized queries (when implemented)
- **XSS protection** via React's automatic escaping and Content Security Policy headers

### Authentication Security
- **Secure session management** (planned) with HTTP-only cookies
- **Password hashing** via NextAuth.js or Supabase Auth (when implemented)
- **CSRF protection** built into Next.js API routes

**Rationale:** Security best practices are implemented from day one to protect user data and comply with GDPR requirements for newsletter subscriptions.

## Architecture Decisions

### Monolith vs Microservices
**Decision:** Start with Next.js monolith (frontend + API routes in single codebase)

**Rationale:** Simpler deployment, faster iteration, and easier debugging for beta launch. Can extract services later if needed.

### Database Choice
**Decision:** PostgreSQL via Supabase (managed) or self-hosted

**Rationale:** Relational database fits structured event and news data. Supabase provides managed hosting with auth and storage in one platform, reducing operational complexity.

### Email Provider
**Decision:** Resend over SendGrid

**Rationale:** Resend has a modern developer experience with React Email integration, transparent pricing, and excellent deliverability. Better suited for content-focused newsletters than transactional-focused SendGrid.

### Styling Approach
**Decision:** Tailwind CSS 4 with custom design system over component libraries like Material-UI

**Rationale:** Tailwind provides maximum flexibility for custom design while maintaining consistency. Custom component library gives production-ready components without locking into a specific design system, allowing Pepe Dome's unique golden theatre brand expression.

### Design System Source
**Decision:** Base design system on proven PEPE Shows design with golden theatre lighting

**Rationale:** Leverages tested design patterns from existing successful product. Golden theatre aesthetic creates strong brand consistency across PEPE family products while differentiating from generic event platforms.

## Current Implementation Status

### Completed (Phase 1)
- Next.js 15.5.4 with React 19.1.1 and TypeScript 5.9.2
- Tailwind CSS 4.1.13 with custom design tokens
- Golden theatre lighting design system with full color palette
- Component library (Button, Card, EventCard, NewsCard, Input)
- Responsive grid layouts (event-grid, news-grid)
- Typography system (Outfit + Inter fonts)
- Logo integration (PEPE_logos_dome.svg)
- Core layout components (Navbar, Footer)
- Design system documentation (DESIGN_SYSTEM.md, COMPONENT_LIBRARY.md)

### Planned (Phases 2-6)
- PostgreSQL database with Prisma ORM
- Resend email integration
- Admin authentication (NextAuth.js or Supabase Auth)
- File storage (Vercel Blob or Supabase Storage)
- Analytics and monitoring
- Testing framework (Vitest + Playwright)
- Production deployment to Vercel
