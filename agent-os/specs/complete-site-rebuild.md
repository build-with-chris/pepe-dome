# Spec: Complete Site Rebuild

**Status**: Ready for Implementation
**Priority**: Critical
**Target**: Full Reset & Rebuild
**Owner**: Development Team

## Overview

Complete rebuild of the Pepe Dome platform with a clean, consistent design system implementation and fully functional admin area. The current implementation has broken CSS variables, inconsistent styling, and missing admin functionality.

## Goals

1. Fix all CSS variable inconsistencies and broken styling
2. Rebuild all public pages with clean, beautiful UI following the design system
3. Build complete admin area for content management (Events, Articles, Newsletters, Subscribers)
4. Ensure mobile responsiveness and accessibility throughout

## Problem Statement

### Current Issues

1. **Broken CSS Variables**:
   - `--pepe-red`, `--pepe-red-hover`, `--pepe-red-glow`, `--pepe-red-active` are used but never defined
   - Admin pages use non-existent variables like `--color-text-primary`, `--color-bg-secondary`
   - Inconsistent naming between `pepe-*` and `color-*` patterns

2. **Styling Inconsistencies**:
   - Components don't follow DESIGN_SYSTEM.md specifications
   - Mixed use of Tailwind utilities and CSS classes without clear pattern
   - Cards, buttons, and forms look broken/ugly

3. **Missing Admin Area**:
   - No functional admin dashboard
   - No CRUD operations for Events
   - No CRUD operations for Articles
   - Newsletter management incomplete
   - Subscriber management missing

## Scope

### In Scope

#### Phase 1: Design System Reset
- [ ] Fix tokens.css - add missing variables, remove dead ones
- [ ] Clean up globals.css - proper Tailwind v4 integration
- [ ] Fix components.css - use only defined variables
- [ ] Fix typography.css - use only defined variables
- [ ] Fix animations.css - use only defined variables
- [ ] Update all components to use consistent variable names

#### Phase 2: Public Pages Rebuild
- [ ] Home page - Hero, featured events, news teasers, newsletter signup
- [ ] Events listing page - Grid with filters, pagination
- [ ] Event detail page - Full info, ticket CTA, related content
- [ ] News/Magazine listing - Grid with category filters
- [ ] Article detail page - Rich content, author, related events
- [ ] Newsletter signup page - Form with extended fields
- [ ] Newsletter archive pages - View sent newsletters
- [ ] About page - PEPE ecosystem overview
- [ ] Contact page - Contact form and info

#### Phase 3: Admin Area (Complete Build)
- [ ] Admin dashboard - Stats overview, quick actions
- [ ] Events CRUD - List, create, edit, delete events
- [ ] Articles CRUD - List, create, edit, delete articles
- [ ] Newsletters management - Create, edit, preview, send
- [ ] Subscribers management - List, export, segments
- [ ] Settings - Site configuration

### Out of Scope
- User authentication for visitors (admin-only auth via Clerk)
- Payment/ticketing integration
- Multi-language support
- Advanced analytics beyond basic stats

## Technical Architecture

### CSS Architecture (Clean)

```
src/styling/
├── tokens.css        # All CSS variables (single source of truth)
├── globals.css       # Base styles, Tailwind imports
├── typography.css    # Text styles using tokens
├── animations.css    # Animation keyframes
├── components.css    # Component classes using tokens
└── card-components.css  # Card-specific styles
```

### Color System (Fixed)

All components MUST use these variables from tokens.css:

```css
/* Backgrounds */
--pepe-black: #000000
--pepe-dark: #111111
--pepe-ink: #161616
--pepe-coal: #0A0A0A
--pepe-surface: #1A1A1A

/* Text */
--pepe-white: #FFFFFF
--pepe-t80: rgba(255, 255, 255, 0.80)
--pepe-t64: rgba(255, 255, 255, 0.64)
--pepe-t48: rgba(255, 255, 255, 0.48)
--pepe-t32: rgba(255, 255, 255, 0.32)

/* Accents (Gold Theme) */
--pepe-gold: #D4A574
--pepe-gold-hover: #E6B887
--pepe-gold-active: #C19A64
--pepe-gold-glow: rgba(212, 165, 116, 0.25)
--pepe-bronze: #B8860B

/* Semantic */
--pepe-success: #00DC82
--pepe-warning: #FFB800
--pepe-error: #FF3B3B
--pepe-info: #0096FF

/* Borders */
--pepe-line: #333333
--pepe-line2: #292929
```

### Component Architecture

```
src/components/
├── ui/                    # shadcn/ui components (auto-generated)
│   ├── button.tsx         # shadcn Button
│   ├── card.tsx           # shadcn Card
│   ├── input.tsx          # shadcn Input
│   ├── label.tsx          # shadcn Label
│   ├── select.tsx         # shadcn Select
│   ├── dialog.tsx         # shadcn Dialog
│   ├── table.tsx          # shadcn Table
│   ├── tabs.tsx           # shadcn Tabs
│   ├── textarea.tsx       # shadcn Textarea
│   ├── badge.tsx          # shadcn Badge
│   ├── dropdown-menu.tsx  # shadcn Dropdown
│   ├── toast.tsx          # shadcn Toast
│   ├── calendar.tsx       # shadcn Calendar
│   ├── popover.tsx        # shadcn Popover
│   ├── switch.tsx         # shadcn Switch
│   ├── skeleton.tsx       # shadcn Skeleton
│   └── index.ts           # Exports
├── custom/                # Custom components (public site)
│   ├── EventCard.tsx      # Event display card
│   ├── NewsCard.tsx       # News/article card
│   ├── HeroSection.tsx    # Homepage hero
│   └── SignupForm.tsx     # Newsletter signup
├── layout/
│   ├── Navbar.tsx         # Main navigation
│   ├── Footer.tsx         # Site footer
│   └── AdminLayout.tsx    # Admin wrapper with sidebar
├── events/
│   ├── EventCalendar.tsx  # Calendar view
│   ├── EventDetail.tsx    # Detail display
│   └── EventFilters.tsx   # Filter controls
├── news/
│   ├── ArticleLayout.tsx  # Article display
│   └── NewsTeaser.tsx     # Teaser cards
├── newsletter/
│   ├── NewsletterEditForm.tsx
│   └── EmailPreview.tsx
└── admin/
    ├── AdminSidebar.tsx   # Admin sidebar navigation
    ├── DataTable.tsx      # Reusable table (using shadcn Table)
    ├── StatsCard.tsx      # Dashboard stats
    └── forms/             # Admin forms using shadcn
        ├── EventForm.tsx
        ├── ArticleForm.tsx
        └── NewsletterForm.tsx
```

### shadcn/ui Integration

**Setup**:
```bash
npx shadcn@latest init
```

**Configuration** (`components.json`):
```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Required shadcn Components**:
```bash
npx shadcn@latest add button card input label select dialog table tabs textarea badge dropdown-menu toast calendar popover switch skeleton form
```

**Theme Customization**:
shadcn components will be styled to match the Pepe Dome design system:
- Primary color: `--pepe-gold` (#D4A574)
- Background: `--pepe-ink` (#161616)
- Border: `--pepe-line` (#333333)
- Text: `--pepe-white` / `--pepe-t80`

The shadcn CSS variables will be mapped to Pepe tokens in globals.css:
```css
:root {
  --background: var(--pepe-black);
  --foreground: var(--pepe-white);
  --card: var(--pepe-ink);
  --card-foreground: var(--pepe-white);
  --primary: var(--pepe-gold);
  --primary-foreground: var(--pepe-black);
  --secondary: var(--pepe-surface);
  --secondary-foreground: var(--pepe-t80);
  --muted: var(--pepe-coal);
  --muted-foreground: var(--pepe-t64);
  --accent: var(--pepe-bronze);
  --accent-foreground: var(--pepe-white);
  --destructive: var(--pepe-error);
  --destructive-foreground: var(--pepe-white);
  --border: var(--pepe-line);
  --input: var(--pepe-line);
  --ring: var(--pepe-gold);
}
```

### Page Routes

```
src/app/
├── page.tsx                    # Home
├── events/
│   ├── page.tsx               # Events listing
│   └── [id]/page.tsx          # Event detail
├── news/
│   ├── page.tsx               # News listing
│   └── [slug]/page.tsx        # Article detail
├── newsletter/
│   ├── page.tsx               # Signup page
│   ├── confirm/page.tsx       # Confirmation
│   ├── unsubscribed/page.tsx  # Unsubscribe confirm
│   └── [slug]/page.tsx        # Archive view
├── about/page.tsx             # About page
├── contact/page.tsx           # Contact page
└── admin/
    ├── page.tsx               # Dashboard
    ├── events/
    │   ├── page.tsx           # List events
    │   ├── new/page.tsx       # Create event
    │   └── [id]/edit/page.tsx # Edit event
    ├── articles/
    │   ├── page.tsx           # List articles
    │   ├── new/page.tsx       # Create article
    │   └── [id]/edit/page.tsx # Edit article
    ├── newsletters/
    │   ├── page.tsx           # List newsletters
    │   ├── new/page.tsx       # Create newsletter
    │   └── [id]/edit/page.tsx # Edit newsletter
    └── subscribers/page.tsx   # Manage subscribers
```

## Detailed Requirements

### 1. Design System Reset

**tokens.css Changes**:
- Remove all references to `--pepe-red*` (not part of brand)
- Ensure all semantic colors are defined
- Add missing admin-friendly aliases if needed
- Document every variable with comments

**Component Updates**:
- Every component MUST only use `var(--pepe-*)` variables
- NO inline color values except in tokens.css
- NO undefined variable references
- Consistent class naming pattern

---

### 2. Home Page

**Layout**:
```
┌─────────────────────────────────────┐
│           Hero Section              │
│   Logo + Tagline + CTA Buttons     │
├─────────────────────────────────────┤
│        Featured Events (3)          │
│   [Card] [Card] [Card]             │
├─────────────────────────────────────┤
│         Latest News (3)             │
│   [Teaser] [Teaser] [Teaser]       │
├─────────────────────────────────────┤
│      Newsletter Signup CTA          │
└─────────────────────────────────────┘
```

**Requirements**:
- Hero: Full-width, dark background, gold accents
- Featured events: 3 cards in grid, gold hover effects
- News section: 3 article teasers
- Newsletter CTA: Email input + submit button
- All sections use consistent spacing (space-16 to space-24)

---

### 3. Events Pages

**Listing Page**:
- Grid of event cards (3 columns desktop, 2 tablet, 1 mobile)
- Category filter (pills/tabs)
- Month/date filter
- Pagination or infinite scroll
- "Past Events" toggle

**Detail Page**:
- Hero image (full width)
- Event title, date, time, location
- Category badge
- Description (rich text)
- Ticket/registration button (gold CTA)
- Related articles section
- Share buttons

**Event Card**:
- Image with overlay gradient
- Date badge (top left)
- Category badge (colored)
- Title (bold, white)
- Short description (muted)
- Hover: lift effect, gold glow

---

### 4. News/Magazine Pages

**Listing Page**:
- Featured article (large, top)
- Grid of article cards
- Category filter
- Tag cloud or filter
- Author filter (optional)

**Article Detail**:
- Hero image
- Title, author, date
- Category badge
- Rich content (markdown rendered)
- Related events section
- Share buttons
- "Read More" suggestions

---

### 5. Newsletter Pages

**Signup Page**:
- Clean form: Name, Email, Interests
- GDPR checkbox
- Submit button (gold)
- Success/error states

**Archive Page** (`/newsletter/[slug]`):
- Rendered newsletter as web page
- Same styling as email version
- Share functionality

---

### 6. Admin Dashboard

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Admin Header (Logo + User Role Badge + Logout)│
├─────────┬──────────────────────────────────────┤
│         │                                      │
│  Nav    │    Content Area                      │
│  -----  │                                      │
│ Dashboard│   Stats Cards Row                   │
│ Events  │   [Subscribers] [Events] [Articles] │
│ Articles│                                      │
│ News-   │   Recent Activity                    │
│ letters │   [Table of recent items]            │
│ Subs*   │                                      │
│ Settings*│   Quick Actions                     │
│         │   [Create Event] [Create Article]   │
│         │                                      │
└─────────┴──────────────────────────────────────┘
* = Super Admin only
```

**Role-Based Access (Clerk User Groups)**:

| Feature | Super Admin | Editor | Viewer |
|---------|-------------|--------|--------|
| Dashboard (stats) | ✅ | ✅ | ✅ |
| Events - View | ✅ | ✅ | ✅ |
| Events - Create/Edit | ✅ | ✅ | ❌ |
| Events - Delete | ✅ | ❌ | ❌ |
| Articles - View | ✅ | ✅ | ✅ |
| Articles - Create/Edit | ✅ | ✅ | ❌ |
| Articles - Delete | ✅ | ❌ | ❌ |
| Newsletters - View | ✅ | ✅ | ✅ |
| Newsletters - Create/Edit | ✅ | ✅ | ❌ |
| Newsletters - Send | ✅ | ❌ | ❌ |
| Subscribers - View | ✅ | ❌ | ❌ |
| Subscribers - Export | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |

**Stats Cards**:
- Total Subscribers (with growth indicator) - Super Admin only
- Total Events (upcoming vs past)
- Total Articles (published vs drafts)
- Newsletter stats (sent, open rate)

---

### 7. Admin: Events CRUD

**List View**:
- Table with columns: Title, Date, Category, Status, Actions
- Filters: Category, Date range, Status
- Bulk actions: Delete selected
- Pagination
- Search

**Create/Edit Form**:
- Title (required)
- Date/Time picker (required)
- End Date/Time (optional)
- Location (text)
- Category (dropdown: SHOW, PREMIERE, FESTIVAL, WORKSHOP, etc.)
- Description (rich text editor)
- Image upload
- Ticket URL (optional)
- Price (optional)
- Featured toggle
- Published toggle
- Recurring event options

**Form Styling**:
- Dark background (--pepe-ink)
- White text
- Gold focus rings
- Clear labels
- Validation errors in red (--pepe-error)

---

### 8. Admin: Articles CRUD

**List View**:
- Table: Title, Category, Author, Status, Published Date, Actions
- Filters: Category, Status (draft/published)
- Search
- Pagination

**Create/Edit Form**:
- Title (required)
- Slug (auto-generated, editable)
- Excerpt (short description)
- Content (rich text editor with markdown)
- Category dropdown
- Author name
- Tags (multi-select or input)
- Featured image upload
- Related events (multi-select)
- Published toggle
- Featured toggle

---

### 9. Admin: Newsletters

**List View**:
- Table: Subject, Status (draft/scheduled/sent), Send Date, Stats
- Quick actions: Edit, Preview, Duplicate, Delete

**Create/Edit Form**:
- Subject line
- Preheader text
- Hero image upload
- Hero title, subtitle
- Content blocks (drag-and-drop):
  - Events (select from DB)
  - Articles (select from DB)
  - Custom sections
- Preview button (shows email render)
- Test send (to admin email)
- Schedule send
- Send now

---

### 10. Admin: Subscribers

**List View**:
- Table: Email, Name, Status, Subscribed Date, Last Activity
- Filters: Status (active/pending/unsubscribed)
- Export CSV button
- Bulk actions: Delete, Change status

**No create form** (subscribers come from signup)

---

## UI Component Specifications

### Button Variants

```tsx
// Primary (Gold/Bronze) - Main CTAs
<Button variant="primary">Book Now</Button>

// Secondary (Outlined) - Secondary actions
<Button variant="secondary">Learn More</Button>

// Ghost (Transparent) - Tertiary actions
<Button variant="ghost">Cancel</Button>

// Sizes
<Button size="sm" />  // Compact
<Button size="md" />  // Default
<Button size="lg" />  // Large
```

### Card Styling

All cards must have:
- Background: `var(--pepe-ink)` or `var(--pepe-surface)`
- Border: `1px solid var(--pepe-line)`
- Border radius: `var(--radius-lg)` (12px)
- Hover: `border-color: var(--pepe-gold)`, subtle lift
- Shadow on hover: `var(--shadow-glow-sm)`

### Form Inputs

```css
.form-input {
  background: var(--pepe-coal);
  border: 1px solid var(--pepe-line);
  color: var(--pepe-white);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
}

.form-input:focus {
  border-color: var(--pepe-gold);
  outline: none;
  box-shadow: 0 0 0 2px var(--pepe-gold-glow);
}
```

---

## Success Criteria

### Design System
- [ ] Zero undefined CSS variable references
- [ ] All components follow DESIGN_SYSTEM.md
- [ ] Consistent spacing, colors, typography throughout
- [ ] No broken/ugly UI elements

### Public Pages
- [ ] Home page loads beautifully with all sections
- [ ] Events page displays and filters correctly
- [ ] News page shows articles with categories
- [ ] Newsletter signup works end-to-end
- [ ] All pages are mobile responsive
- [ ] All pages pass accessibility checks (WCAG AA)

### Admin Area
- [ ] Dashboard shows accurate stats
- [ ] Events CRUD fully functional
- [ ] Articles CRUD fully functional
- [ ] Newsletters can be created, previewed, sent
- [ ] Subscribers can be viewed and exported
- [ ] All forms validate properly
- [ ] All forms have loading/error states

### Performance
- [ ] Pages load under 3 seconds
- [ ] Images are optimized
- [ ] No layout shift on load

---

## Implementation Phases

### Phase 1: Design System Reset (Day 1)
1. Audit all CSS files for undefined variables
2. Update tokens.css with complete variable set
3. Fix all component CSS files
4. Test that no styling is broken

### Phase 2: UI Components (Day 2)
1. Rebuild Button component
2. Rebuild Card component
3. Rebuild Input/Form components
4. Rebuild EventCard and NewsCard
5. Create consistent admin components

### Phase 3: Public Pages (Days 3-4)
1. Home page rebuild
2. Events pages rebuild
3. News pages rebuild
4. Newsletter pages rebuild
5. About and Contact pages

### Phase 4: Admin Area (Days 5-7)
1. Admin layout and navigation
2. Dashboard with stats
3. Events CRUD pages
4. Articles CRUD pages
5. Newsletters management
6. Subscribers management

### Phase 5: Testing & Polish (Day 8)
1. Cross-browser testing
2. Mobile responsiveness check
3. Accessibility audit
4. Performance optimization
5. Final bug fixes

---

## Dependencies

- **Clerk authentication** - Shared instance with pepe-shows frontend (`/Users/densen/Dropbox/sen_dev/pepe-shows/frontend`)
- Prisma + PostgreSQL (already configured)
- Resend for emails (already configured)
- Next.js 15 with App Router
- Tailwind CSS v4
- React 19
- **shadcn/ui** - For admin area components (forms, tables, dialogs, etc.)

### Clerk User Groups

The shared Clerk instance has three user groups for role-based access:

1. **Super Admin** - Full access to all admin features across both pepe-dome and pepe-shows
2. **Editor** - Can create/edit content (events, articles, newsletters) but cannot manage subscribers or settings
3. **Viewer** - Read-only access to admin dashboard and reports

Admin middleware should check user roles and restrict access accordingly.

---

## Open Questions

1. Should we add dark/light theme toggle or keep dark-only?
2. ~~Do we need role-based access control for admin (editor vs super-admin)?~~ **ANSWERED**: Yes, using shared Clerk instance with 3 user groups (Super Admin, Editor, Viewer)
3. Should newsletters support audience segmentation?
4. Do we need image cropping/editing in admin?

---

## Resources

- [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) - Complete design guide
- [COMPONENT_LIBRARY.md](../../COMPONENT_LIBRARY.md) - Component documentation
- [CLAUDE.md](../../CLAUDE.md) - Original PRD
- [Prisma Schema](../../prisma/schema.prisma) - Database models
