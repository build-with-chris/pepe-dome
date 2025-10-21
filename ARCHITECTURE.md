# Pepe Dome - New Architecture Plan

## Overview
Complete rebuild as modern editorial news/events hub with admin capabilities.

## Design Principles (from pepe-frontend-app)
- Gold/bronze/copper theatre lighting theme
- Doticon particle system (300px small icons, NO emojis)
- Clean bento grid layouts
- Stage-based theater metaphor
- Glassmorphic cards
- Typography: Outfit (display) + Inter (body)

## Content Structure

### 1. Mock Data (JSON) - German Content
Location: `/src/data/`

```
/src/data/
  ├── news.json          # News articles with categories
  ├── events.json        # Event listings
  ├── content.json       # Static page content (DE)
  └── newsletter.json    # Newsletter archives
```

### 2. Page Structure

```
/ (Home)               # Editorial hub with news teasers + event highlights
├── /news              # News overview (grid)
├── /news/[slug]       # Article detail
├── /events            # Event calendar (monthly grid)
├── /events/[id]       # Event detail
├── /newsletter        # Newsletter archive
├── /newsletter/[id]   # Newsletter detail page
├── /admin             # Admin dashboard
├── /admin/news        # News management
├── /admin/events      # Event management
└── /admin/newsletter  # Newsletter management
```

### 3. Component Architecture

#### Core Components
- `NewsTeaser` - Card-style news preview
- `EventCard` - Event listing card
- `NewsletterSignup` - Email capture (DSGVO)
- `BentoGrid` - Flexible grid system
- `InfoBox` - Information callout boxes
- `ArticleLayout` - News article template
- `EventCalendar` - Monthly event grid
- `AdminLayout` - Admin shell
- `DotIcon` - Small icon component (300px cyr wheel placeholder)

#### Layout Components
- `Navbar` - Main navigation (auto-hide)
- `Footer` - Site footer
- `ParticleBackground` - Doticon particle system
- `HeroSection` - Editorial hero

### 4. Mock Content Strategy

All content starts as JSON, migrates to Supabase later:
- **News**: 10 sample articles across categories
- **Events**: 15 upcoming events
- **Newsletter**: 3 past editions

### 5. Database Migration Plan (Supabase)

#### Tables (to be created):
```sql
-- news
id, slug, title, excerpt, content, category, author,
published_at, image_url, tags[]

-- events
id, title, subtitle, description, date, time, location,
category, ticket_url, image_url, price, features[]

-- newsletter_subscribers
id, email, confirmed, opt_in_date, categories[]

-- newsletter_editions
id, month, year, content_json, sent_at, sent_count
```

#### Migration Steps (LATER):
1. Create Supabase project
2. Run SQL migrations
3. Import JSON → database
4. Update API calls from `src/data` to Supabase client
5. Add Row Level Security (RLS) policies

### 6. Admin UI Features

Protected routes with authentication:
- **Dashboard**: Stats overview
- **News Editor**: Create/edit articles (rich text)
- **Event Manager**: CRUD for events
- **Newsletter Builder**: Select events → preview → send
- **Subscriber List**: View/export emails

### 7. Newsletter Integration (Future)

- Resend API for sending
- Template: Monthly event roundup
- Preview before send
- Track open rates

## Implementation Phases

### Phase 1: Foundation (NOW)
✅ Archive old site
⏳ Create data structure (JSON)
⏳ Build core components
⏳ Editorial homepage
⏳ News system
⏳ Event calendar

### Phase 2: Content
⏳ Article templates
⏳ Event detail pages
⏳ Newsletter archive
⏳ Info boxes & CTAs

### Phase 3: Admin (Basic)
⏳ Admin layout
⏳ Protected routes
⏳ Content forms
⏳ Preview mode

### Phase 4: Database (LATER)
- Supabase setup
- Migrations
- API integration
- RLS policies

### Phase 5: Newsletter (LATER)
- Resend integration
- Email templates
- Subscriber management
- Send workflow

## Visual Design Notes

- **Hero**: Large doticon background + featured news
- **News Grid**: 3-column bento with varying sizes
- **Event Calendar**: Monthly grid with hover states
- **Cards**: Glassmorphic with gold accents
- **Typography**: Large headlines, generous spacing
- **Doticons**: 300px wheel placeholder, particle effects
- **NO EMOJIS**: Use doticons or text symbols only

## File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (editorial hub)
│   ├── news/
│   ├── events/
│   ├── newsletter/
│   └── admin/
├── components/
│   ├── layout/ (Navbar, Footer, ParticleBackground)
│   ├── news/ (NewsTeaser, ArticleLayout)
│   ├── events/ (EventCard, EventCalendar)
│   ├── newsletter/ (NewsletterSignup, Archive)
│   ├── admin/ (Dashboard, Forms, Tables)
│   └── ui/ (Button, Card, Input, etc.)
├── data/
│   ├── news.json
│   ├── events.json
│   ├── content.json
│   └── newsletter.json
├── lib/
│   ├── data.ts (JSON readers)
│   └── utils.ts
└── styling/
    └── (existing design system)
```

## Next Steps
1. Create JSON mock data
2. Build core UI components
3. Implement editorial homepage
4. Build news & event pages
5. Add admin scaffolding
6. Document Supabase migration
