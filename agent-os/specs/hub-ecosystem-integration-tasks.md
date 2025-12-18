# Tasks: PEPE Hub Ecosystem Integration

**Spec**: [hub-ecosystem-integration.md](./hub-ecosystem-integration.md)
**Status**: Ready for Implementation
**Estimated Duration**: 5 weeks

## Task Breakdown

### Phase 1: Foundation & Database (Week 1)

#### 1.1 Database Schema Setup
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Install and configure Prisma ORM
- [ ] Create schema for Events model
- [ ] Create schema for Articles model
- [ ] Create schema for CalendarItems model
- [ ] Create schema for Classes model
- [ ] Create database migrations
- [ ] Seed database with test data
- [ ] Document schema relationships

**Files**:
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.ts`

---

#### 1.2 Admin Authentication Setup
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Install NextAuth.js
- [ ] Configure authentication providers
- [ ] Create admin user model
- [ ] Set up protected routes under `/admin`
- [ ] Create login page
- [ ] Add session management
- [ ] Test authentication flow

**Files**:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/admin/login/page.tsx`
- `src/middleware.ts`
- `src/lib/auth.ts`

---

#### 1.3 Content Import from pepe-dome.de
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create scraper for https://www.pepe-dome.de/veranstaltungen
- [ ] Extract event data
- [ ] Transform to database schema
- [ ] Import into database
- [ ] Verify data integrity
- [ ] Create placeholder articles for past events

**Files**:
- `scripts/import-content.ts`
- `scripts/scrape-events.ts`

---

### Phase 2: Hub Hero & Navigation (Week 2)

#### 2.1 DotCloud Component Integration
**Status**: In Progress ✅
**Priority**: High
**Estimated Time**: 0.5 days

- [x] Import imageToDots library
- [x] Create DotCloudImage component
- [x] Copy doticon assets
- [ ] Test component rendering
- [ ] Optimize performance
- [ ] Add loading states

**Files**:
- `src/lib/imageToDots.ts` ✅
- `src/components/ui/DotCloudImage.tsx` (in progress)
- `public/doticons/logo.jpg` ✅

---

#### 2.2 Hub Hero Component
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create HubHero component with light background
- [ ] Integrate DotCloud visualization
- [ ] Create FloatingLogo component
- [ ] Add three property logos (Shows, Dome, Art)
- [ ] Implement hover interactions
- [ ] Add links to properties
- [ ] Make mobile-responsive
- [ ] Add engaging tagline

**Files**:
- `src/components/hub/HubHero.tsx`
- `src/components/hub/FloatingLogo.tsx`
- `src/styling/hub-components.css`

---

#### 2.3 Property Switcher Navigation
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create PropertySwitcher component
- [ ] Add to navbar
- [ ] Design dropdown/menu UI
- [ ] Add icons for each property
- [ ] Implement navigation logic
- [ ] Mobile optimization

**Files**:
- `src/components/hub/PropertySwitcher.tsx`
- `src/components/layout/Navbar.tsx` (update)

---

### Phase 3: Calendar System (Week 2-3)

#### 3.1 Calendar Core Component
**Status**: Not Started
**Priority**: High
**Estimated Time**: 3 days

- [ ] Create CalendarView component
- [ ] Implement month grid view
- [ ] Implement list view
- [ ] Add date navigation (prev/next month)
- [ ] Color code by property and type
- [ ] Add event click handlers
- [ ] Optimize rendering performance
- [ ] Add keyboard navigation

**Files**:
- `src/components/calendar/CalendarView.tsx`
- `src/components/calendar/CalendarGrid.tsx`
- `src/components/calendar/CalendarList.tsx`
- `src/styling/calendar-components.css`

---

#### 3.2 Calendar Detail Modal
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create CalendarDetail modal component
- [ ] Display full event information
- [ ] Add close and navigation controls
- [ ] Implement registration/ticket CTAs
- [ ] Make mobile-responsive
- [ ] Add transitions and animations

**Files**:
- `src/components/calendar/CalendarDetail.tsx`

---

#### 3.3 Calendar Sidebar Widget
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create CalendarSidebar component
- [ ] Show upcoming 5-7 items
- [ ] Add quick filters
- [ ] Implement sticky behavior on desktop
- [ ] Collapse on mobile
- [ ] Add "View Full Calendar" CTA

**Files**:
- `src/components/calendar/CalendarSidebar.tsx`

---

#### 3.4 Mobile Calendar Optimization
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create MobileCalendar component
- [ ] Implement horizontal date scroller
- [ ] Add swipe gestures
- [ ] Show event list for selected date
- [ ] Add filter chips
- [ ] Add "Jump to Date" picker
- [ ] Test on various mobile devices

**Files**:
- `src/components/calendar/MobileCalendar.tsx`
- `src/components/calendar/DateScroller.tsx`

---

#### 3.5 Calendar Page
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create calendar page route
- [ ] Integrate CalendarView
- [ ] Add page header
- [ ] Implement URL-based filtering
- [ ] Add SEO metadata
- [ ] Desktop and mobile layouts

**Files**:
- `src/app/calendar/page.tsx`

---

### Phase 4: Event Pages (Week 3)

#### 4.1 Event Page Template
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create dynamic event route
- [ ] Build EventPage component
- [ ] Implement EventHero with image
- [ ] Add EventDetails section
- [ ] Create PastEventBanner component
- [ ] Add visual treatment for past events (greyed out)
- [ ] Implement TicketCTA component
- [ ] Add share functionality
- [ ] Show related articles section
- [ ] Add "Similar Events" for past events

**Files**:
- `src/app/events/[slug]/page.tsx`
- `src/components/events/EventPage.tsx`
- `src/components/events/EventHero.tsx`
- `src/components/events/PastEventBanner.tsx`
- `src/components/events/TicketCTA.tsx`
- `src/styling/event-pages.css`

---

#### 4.2 Events Listing Page
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create events listing route
- [ ] Grid layout with EventCard components
- [ ] Filter by category and status
- [ ] Sort by date
- [ ] Pagination or infinite scroll
- [ ] SEO optimization

**Files**:
- `src/app/events/page.tsx`

---

### Phase 5: Article Pages (Week 3)

#### 5.1 Article Page Template
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create dynamic article route
- [ ] Build ArticlePage component
- [ ] Add rich content renderer (Markdown/Tiptap)
- [ ] Implement author info section
- [ ] Add related event card component
- [ ] Create tag filtering
- [ ] Add social sharing buttons
- [ ] Show "Read More" related articles
- [ ] SEO metadata

**Files**:
- `src/app/articles/[slug]/page.tsx`
- `src/components/articles/ArticlePage.tsx`
- `src/components/articles/ArticleContent.tsx`
- `src/components/articles/EventArticleLink.tsx`
- `src/styling/article-pages.css`

---

#### 5.2 Articles Listing Page
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create articles listing route
- [ ] Grid layout with NewsCard components
- [ ] Filter by category and tags
- [ ] Sort by date
- [ ] Pagination
- [ ] SEO optimization

**Files**:
- `src/app/articles/page.tsx`

---

### Phase 6: Static Pages (Week 3-4)

#### 6.1 About Page
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create About page route
- [ ] Build hero with DotCloud
- [ ] Create "Our Properties" section with 3 cards
- [ ] Add rich imagery from events
- [ ] Create interactive hover states
- [ ] Add contact information
- [ ] Mobile optimization
- [ ] SEO metadata

**Files**:
- `src/app/about/page.tsx`
- `src/components/about/PropertyCard.tsx`
- `src/styling/about-page.css`

---

#### 6.2 Business Page
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create Business page route
- [ ] Hero with corporate imagery
- [ ] Service cards (corporate events, team building, rentals)
- [ ] Testimonials section (if available)
- [ ] Contact form
- [ ] Link to calendar
- [ ] SEO metadata

**Files**:
- `src/app/business/page.tsx`

---

#### 6.3 Training Page
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create Training page route
- [ ] Hero with training imagery
- [ ] Classes overview section
- [ ] Workshop calendar integration
- [ ] Instructor profiles (optional)
- [ ] Skill levels explanation
- [ ] Registration CTA
- [ ] SEO metadata

**Files**:
- `src/app/training/page.tsx`

---

### Phase 7: Admin UI (Week 4)

#### 7.1 Admin Dashboard
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Create admin dashboard layout
- [ ] Add navigation sidebar
- [ ] Show content statistics
- [ ] Recent activity feed
- [ ] Quick actions menu
- [ ] Mobile-responsive admin UI

**Files**:
- `src/app/admin/page.tsx`
- `src/app/admin/layout.tsx`
- `src/components/admin/AdminNav.tsx`

---

#### 7.2 Event Management UI
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create event list view
- [ ] Build event creation form
- [ ] Add event editing interface
- [ ] Image upload functionality
- [ ] Status toggle (upcoming/past)
- [ ] Preview functionality
- [ ] Delete/archive events
- [ ] Form validation with Zod

**Files**:
- `src/app/admin/events/page.tsx`
- `src/app/admin/events/new/page.tsx`
- `src/app/admin/events/[id]/edit/page.tsx`
- `src/components/admin/EventForm.tsx`

---

#### 7.3 Article Management UI
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Create article list view
- [ ] Build article creation form
- [ ] Integrate rich text editor (Tiptap)
- [ ] Add article editing interface
- [ ] Image upload functionality
- [ ] Event linking interface
- [ ] Tag management
- [ ] Draft/publish workflow
- [ ] Preview functionality
- [ ] Form validation

**Files**:
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/new/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/components/admin/ArticleForm.tsx`
- `src/components/admin/RichTextEditor.tsx`

---

#### 7.4 Calendar Management UI
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Create calendar items list
- [ ] Add calendar item form
- [ ] Support all item types (events, classes, holidays)
- [ ] Bulk date entry for classes
- [ ] Quick add interface
- [ ] Delete functionality

**Files**:
- `src/app/admin/calendar/page.tsx`
- `src/components/admin/CalendarForm.tsx`

---

### Phase 8: OpenAI Integration (Week 4)

#### 8.1 OpenAI Setup & API
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Set up OpenAI API key
- [ ] Create API route for AI generation
- [ ] Implement rate limiting
- [ ] Add error handling
- [ ] Create prompt templates
- [ ] Test German content generation
- [ ] Add fallback for API failures

**Files**:
- `src/app/api/ai/generate/route.ts`
- `src/lib/openai.ts`
- `.env` (API key)

---

#### 8.2 AI Content Generation for Events
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Add "Generate Description" button to event form
- [ ] Create AI prompt for event descriptions
- [ ] Handle streaming responses
- [ ] Add edit/regenerate options
- [ ] Show token usage
- [ ] German language optimization

**Files**:
- `src/components/admin/AIGenerateButton.tsx`
- `src/components/admin/AITextArea.tsx`

---

#### 8.3 AI Content Generation for Articles
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Add AI assistance to article editor
- [ ] Generate article from event data
- [ ] Improve/expand existing text
- [ ] Generate SEO metadata
- [ ] Suggest tags
- [ ] Content style matching

**Files**:
- `src/components/admin/AIArticleAssistant.tsx`

---

### Phase 9: Homepage Integration (Week 5)

#### 9.1 Editorial Homepage Layout
**Status**: Not Started
**Priority**: High
**Estimated Time**: 2 days

- [ ] Update homepage with new layout
- [ ] Integrate HubHero
- [ ] Add featured event/article unit
- [ ] Integrate calendar sidebar
- [ ] Add editorial teasers grid
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Analytics integration

**Files**:
- `src/app/page.tsx` (major update)
- `src/components/home/FeaturedUnit.tsx`
- `src/components/home/EditorialGrid.tsx`

---

### Phase 10: Polish & Launch (Week 5)

#### 10.1 Performance Optimization
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Optimize images (next/image)
- [ ] Lazy load below-fold content
- [ ] Code splitting review
- [ ] Bundle size analysis
- [ ] Lighthouse audit
- [ ] Fix performance issues

---

#### 10.2 SEO Implementation
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Add metadata to all pages
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Implement structured data (JSON-LD)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Test with SEO tools

**Files**:
- `src/app/sitemap.ts`
- `public/robots.txt`

---

#### 10.3 Accessibility Review
**Status**: Not Started
**Priority**: High
**Estimated Time**: 1 day

- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Color contrast verification
- [ ] ARIA labels review
- [ ] Focus management
- [ ] WCAG AA compliance check

---

#### 10.4 User Testing
**Status**: Not Started
**Priority**: Medium
**Estimated Time**: 1 day

- [ ] Test with internal users
- [ ] Gather feedback
- [ ] Fix critical issues
- [ ] Test on multiple devices
- [ ] Test on different browsers

---

#### 10.5 Production Deployment
**Status**: Not Started
**Priority**: High
**Estimated Time**: 0.5 days

- [ ] Set up production environment
- [ ] Configure environment variables
- [ ] Database migration to production
- [ ] Deploy to hosting (Vercel)
- [ ] DNS configuration
- [ ] SSL certificate verification
- [ ] Monitor for errors
- [ ] Announce launch

---

## Summary

**Total Tasks**: 78
**Completed**: 3
**In Progress**: 1
**Not Started**: 74

**Estimated Total Time**: 5 weeks (1 developer)

**Critical Path**:
1. Database setup
2. DotCloud integration
3. Calendar system
4. Event/Article pages
5. Admin UI with AI

**Quick Wins** (can be done in parallel):
- About page
- Business/Training pages
- Content import script
