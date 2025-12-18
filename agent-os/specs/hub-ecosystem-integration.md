# Spec: PEPE Hub Ecosystem Integration

**Status**: Draft
**Priority**: High
**Target**: Phase 2 - Content Foundation
**Owner**: Development Team

## Overview

Transform Pepe Dome into a central hub for the PEPE ecosystem, connecting three independent properties (pepeshows.de, pepe-dome.de, pepeart.de) with a unified content calendar, editorial layout, and cross-site navigation.

## Goals

1. Create engaging hub-style homepage with DotCloud visualization and floating logos
2. Build unified calendar system for events, classes, workshops across all properties
3. Implement editorial layout with event-article linking
4. Provide mobile-optimized, accessible content discovery
5. Enable simple content creation via admin UI with AI assistance

## User Stories

### Visitors
- As a visitor, I want to see all PEPE properties at a glance so I can discover the full ecosystem
- As a visitor, I want to view upcoming events, classes, and workshops in one calendar
- As a visitor, I want to read articles about past events with links to event details
- As a mobile user, I want an optimized calendar view that works on my phone

### Content Creators
- As an admin, I want to create event listings with simple forms
- As an admin, I want AI assistance to generate German content that fits our target audience
- As an admin, I want to link articles to related events automatically
- As an admin, I want to mark events as past and have them visually distinguished

### Business Stakeholders
- As a stakeholder, I want Business and Training pages that showcase our services
- As a stakeholder, I want an About page explaining the entire PEPE ecosystem

## Scope

### In Scope
- Hub hero with DotCloud particle animation and floating property logos
- Database schema for events, articles, classes, workshops, calendar items
- Calendar component (central, mobile-optimized, detail view)
- About page (interactive, all services, rich imagery)
- Event page template (past/future states)
- Article page template with event linking
- Business and Training pages
- Placeholder content import from pepe-dome.de/veranstaltungen
- Admin UI with OpenAI integration for content creation

### Out of Scope (Future Phases)
- Cross-site authentication/SSO
- Real-time calendar sync with external calendars
- Advanced analytics and reporting
- Multi-language support beyond German
- Payment integration for classes/workshops

## Technical Architecture

### Site Ecosystem
- **pepe-dome.de**: Central hub (Next.js 15, this codebase)
- **pepeshows.de**: Artist booking service (React, existing, separate)
- **pepeart.de**: Network & Classes (to be linked)

### Database Schema

```typescript
// Events (Dome venue events)
interface Event {
  id: string
  title: string
  description: string
  date: Date
  endDate?: Date
  category: 'show' | 'workshop' | 'training' | 'special'
  status: 'upcoming' | 'past'
  image?: string
  ticketUrl?: string
  relatedArticles?: string[] // Article IDs
  createdAt: Date
  updatedAt: Date
}

// Articles (Editorial content)
interface Article {
  id: string
  title: string
  excerpt: string
  content: string // Markdown or rich text
  author: string
  category: string
  publishedAt: Date
  image?: string
  relatedEvent?: string // Event ID
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Calendar Items (Unified calendar for all properties)
interface CalendarItem {
  id: string
  title: string
  type: 'event' | 'class' | 'workshop' | 'holiday' | 'special'
  startDate: Date
  endDate?: Date
  property: 'dome' | 'shows' | 'art'
  description?: string
  url?: string
  isPublic: boolean
  createdAt: Date
}

// Classes/Workshops
interface Class {
  id: string
  title: string
  description: string
  instructor?: string
  dates: Date[]
  duration: number // minutes
  capacity?: number
  price?: number
  registrationUrl?: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  createdAt: Date
}
```

### Component Architecture

```
src/components/
├── hub/
│   ├── HubHero.tsx              # Hero with DotCloud + floating logos
│   ├── FloatingLogo.tsx         # Animated logo component
│   └── PropertySwitcher.tsx     # Hub navigation
├── calendar/
│   ├── CalendarView.tsx         # Main calendar component
│   ├── CalendarDetail.tsx       # Event detail modal
│   ├── CalendarSidebar.tsx      # Sidebar widget
│   └── MobileCalendar.tsx       # Mobile-optimized view
├── events/
│   ├── EventCard.tsx            # (existing, enhanced)
│   ├── EventPage.tsx            # Event detail page
│   └── PastEventBanner.tsx      # Visual indicator for past events
└── articles/
    ├── ArticlePage.tsx          # Article detail page
    ├── ArticleList.tsx          # Editorial feed
    └── EventArticleLink.tsx     # Link between event & article
```

## Detailed Requirements

### 1. Hub Hero Component

**Description**: Hero section with light background for contrast, featuring DotCloud particle animation of PEPE logo and floating property logos.

**Requirements**:
- Light background (cream/beige) for contrast against dark site
- DotCloud particle system imported from pepeshows
- Three floating logos: Shows, Dome, Art
- Smooth hover interactions on logos
- Links to respective properties
- Mobile-responsive (stack vertically on mobile)
- Engaging tagline: "Das PEPE Netzwerk - Shows, Dome & Training"

**Technical Notes**:
- Use DotCloudImage component with `reverseScroll` for hero
- Logo files: `/public/PEPE_logos_shows.svg`, `/public/PEPE_logos_dome.svg`, need Art logo
- Light background: `#F5F1E8` or similar warm cream
- Animation: Logos float/orbit around central DotCloud

**Design Reference**: Similar to pepeshows hero but lighter and hub-focused

---

### 2. Editorial Homepage Layout

**Description**: Below hero, editorial magazine-style layout with featured content and calendar sidebar.

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         Hub Hero (Light BG)         │
├─────────────────────────┬───────────┤
│                         │           │
│   Featured Event/       │ Calendar  │
│   Article Unit          │ Sidebar   │
│   (Large Card)          │           │
│                         │ Upcoming  │
├─────────────────────────┤ Events    │
│                         │           │
│   Editorial Teasers     │ Classes   │
│   Grid (2-3 cards)      │           │
│                         │ Special   │
│                         │ Dates     │
└─────────────────────────┴───────────┘
```

**Requirements**:
- Featured unit can combine past event + article about it
- Teasers show mix of upcoming events and recent articles
- Calendar sidebar shows next 5 items
- Mobile: Calendar becomes horizontal carousel below content
- All cards use golden theme with hover effects

---

### 3. Calendar Component

**Description**: Central calendar system showing all PEPE ecosystem activities.

**Features**:
- **Views**: Month grid, List view, Week view
- **Filtering**: By property (Dome/Shows/Art), by type (event/class/workshop)
- **Detail Modal**: Click item opens overlay with full details
- **Mobile**: Horizontal date scroller + list below
- **Color Coding**:
  - Dome events: Gold (#D4A574)
  - Shows bookings: Bronze (#B8860B)
  - Classes: Amber (#FFBF00)
  - Holidays: Gray
- **Admin Features**: Can add holidays, closures, special dates

**Calendar Sidebar Widget**:
- Compact list of upcoming items (5-7)
- Quick filtering toggle
- "View Full Calendar" button
- Sticky on desktop, collapses on mobile

**Technical Notes**:
- Use date-fns for date handling
- State management for filters
- Local storage for user preferences
- Lazy load events outside current month

---

### 4. Event Pages

**Description**: Event detail pages with past/future state distinction.

**Future Event Features**:
- Full color images
- Ticket/registration button (gold)
- Share functionality
- Add to calendar button
- Related articles section

**Past Event Features**:
- Greyed out visual treatment (desaturate images)
- "Vergangene Veranstaltung" banner
- Link to photo gallery if available
- Link to article/recap if available
- No ticket button
- "Similar Upcoming Events" section

**Template Structure**:
```typescript
<EventPage event={event}>
  {event.status === 'past' && <PastEventBanner />}
  <EventHero image={event.image} isPast={event.status === 'past'} />
  <EventDetails {...event} />
  {event.relatedArticles && <RelatedArticles articles={event.relatedArticles} />}
  {event.status === 'upcoming' && <TicketCTA url={event.ticketUrl} />}
  {event.status === 'past' && <SimilarEvents category={event.category} />}
</EventPage>
```

---

### 5. Article Pages

**Description**: Editorial articles with event linking and German content.

**Features**:
- Rich content editor support (Markdown or Tiptap)
- Featured image with caption
- Author info and date
- Related event card (if linked)
- Tag filtering
- Social sharing
- "Read More" related articles section

**Event Article Link**:
- When article is about an event, show event card at top
- Two-way linking: Article → Event, Event → Articles
- Visual indicator showing connection

**German Content Style**:
- Professional but warm tone
- Target audience: Culture enthusiasts, families, corporate clients
- AI-generated content should match existing pepe-dome.de style
- Examples available at: https://www.pepe-dome.de/veranstaltungen

---

### 6. About Page

**Description**: Interactive page explaining entire PEPE ecosystem with rich imagery.

**Sections**:
1. **Hero**: "Das PEPE Netzwerk" with DotCloud visualization
2. **Our Properties**:
   - Pepe Dome (Venue, events, shows)
   - Pepe Shows (Artist booking service)
   - Pepe Art (Network, classes, workshops)
3. **Interactive Map**: Visual showing locations/connections
4. **Team** (optional for now)
5. **Contact & Locations**

**Visual Design**:
- Rich imagery from events and classes
- Interactive hover states on property cards
- Golden accents throughout
- Mobile: Vertical cards, no horizontal scroll

---

### 7. Business & Training Pages

**Description**: Service pages for corporate and training offerings.

**Business Page** (`/business`):
- Corporate events
- Team building
- Private rentals
- Case studies/testimonials
- Contact form

**Training Page** (`/training`):
- Classes overview
- Workshop calendar
- Instructor profiles
- Skill levels
- Registration process

**Both Pages Include**:
- Hero with relevant imagery
- Service cards with golden accents
- CTA buttons for inquiries
- Link to calendar for availability

---

### 8. Admin UI with AI Integration

**Description**: Simple content creation interface with OpenAI assistance.

**Features**:
- **Event Creation**: Form with AI text generation
- **Article Creation**: Rich editor with AI writing assistance
- **Calendar Management**: Add events, classes, holidays
- **Image Upload**: Support for event/article images
- **Preview**: Live preview before publish
- **Draft/Publish**: Save drafts, schedule publishing

**OpenAI Integration**:
- Generate event descriptions in German
- Suggest article content based on event
- Improve existing text
- Generate SEO metadata
- Target audience: Culture enthusiasts in Munich

**Technical Stack**:
- Admin routes under `/admin/*`
- Protected with authentication (NextAuth.js)
- OpenAI API integration (gpt-4 or gpt-4-turbo)
- Form validation with Zod
- Rich text editor: Tiptap or similar

**AI Prompts**:
```
System: You are a content writer for Pepe Dome, a cultural venue in Munich.
Write engaging German content for events and articles targeting culture
enthusiasts, families, and corporate clients. Tone: Professional but warm
and welcoming. Include theatrical flair and excitement.

User: Generate a description for: [Event Title]
```

---

## Content Import & Initial Data

### Existing Content Source
- URL: https://www.pepe-dome.de/veranstaltungen
- Extract event data for placeholder/initial content
- Create matching articles for past events

### Placeholder Content Requirements
- 10 future events (next 3 months)
- 10 past events (last 3 months)
- 5 articles about past events
- 2 articles about upcoming events
- 5 classes/workshops
- Special calendar dates (holidays, closures)

---

## Mobile Optimization

### Calendar Mobile View
- Horizontal date scroller (7 days visible)
- Swipe left/right for more dates
- Selected date shows list of events below
- Filter chips at top
- "Jump to Date" button

### Homepage Mobile
1. Hub hero (reduced height, centered logos)
2. Featured event/article card
3. Calendar carousel
4. Editorial teasers (1 column)
5. Newsletter signup

### Navigation Mobile
- Hamburger menu with property switcher
- Sticky calendar access button
- Quick search

---

## Success Criteria

### User Experience
- [ ] Hub hero loads and animates within 2 seconds
- [ ] Calendar is filterable and responsive
- [ ] Event pages clearly distinguish past/future states
- [ ] Articles link to events seamlessly
- [ ] Mobile calendar is easy to navigate

### Content
- [ ] All existing pepe-dome.de events imported
- [ ] AI generates appropriate German content
- [ ] Event-article connections are clear
- [ ] Images are optimized and load quickly

### Technical
- [ ] Database schema supports all entity types
- [ ] Admin UI is intuitive for non-technical users
- [ ] OpenAI integration has error handling and fallbacks
- [ ] All pages are accessible (WCAG AA)
- [ ] SEO metadata is complete

---

## Dependencies

- DotCloud component from pepeshows ✅ (imported)
- Logo files for all three properties (need Art logo)
- OpenAI API key and setup
- Database setup (Prisma + PostgreSQL)
- Image hosting/CDN setup
- Authentication system (NextAuth.js)

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Import DotCloud module
- [ ] Create database schema and migrations
- [ ] Set up admin authentication
- [ ] Import placeholder content

### Phase 2: Hub & Calendar (Week 2)
- [ ] Build HubHero component
- [ ] Create CalendarView component
- [ ] Build CalendarSidebar widget
- [ ] Mobile calendar optimization

### Phase 3: Content Pages (Week 3)
- [ ] Event page template
- [ ] Article page template
- [ ] About page
- [ ] Business & Training pages

### Phase 4: Admin & AI (Week 4)
- [ ] Admin UI for events
- [ ] Admin UI for articles
- [ ] OpenAI integration
- [ ] Content preview system

### Phase 5: Polish & Launch (Week 5)
- [ ] Mobile optimization review
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] User testing
- [ ] Launch to production

---

## Open Questions

1. **Pepe Art Logo**: Where is the logo file for pepeart.de?
2. **OpenAI Budget**: What's the monthly budget for AI content generation?
3. **Calendar Sync**: Should we support iCal export?
4. **User Accounts**: Do regular users need accounts or just admins?
5. **Analytics**: What metrics should we track?

---

## Resources

- Design System: [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)
- Component Library: [COMPONENT_LIBRARY.md](../../COMPONENT_LIBRARY.md)
- PRD: [CLAUDE.md](../../CLAUDE.md)
- Existing Site: https://www.pepe-dome.de/veranstaltungen
