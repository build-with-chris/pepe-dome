# PEPE Dome Newsletter System - Developer Documentation

**Version:** 1.0
**Last Updated:** 2025-11-17
**Architecture:** Next.js 15, React 19, Prisma, PostgreSQL, Resend

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Email System](#email-system)
6. [DotCloud Visual System](#dotcloud-visual-system)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

### Purpose
The PEPE Dome Newsletter System provides a complete solution for collecting subscribers, creating newsletters, and sending email campaigns with engagement tracking.

### Key Features
- Double opt-in subscriber management
- Newsletter builder with content selection
- React Email templates
- Resend integration for sending
- Webhook-based engagement tracking
- Public newsletter archive with SEO
- DotCloud visual animations across site

### Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL via Prisma ORM
- **Email:** Resend API, React Email templates
- **Animation:** Framer Motion
- **Testing:** Vitest, Testing Library
- **Drag-and-Drop:** @dnd-kit/core

---

## Architecture

### Layers

```
┌─────────────────────────────────────────────┐
│           Public Pages (Next.js)            │
│  - Newsletter signup forms                  │
│  - Newsletter archive (/newsletter)         │
│  - Confirmation & unsubscribe pages         │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│         Admin UI (Next.js)                  │
│  - Newsletter builder                       │
│  - Content selection & reordering           │
│  - Subscriber management                    │
│  - Stats dashboard                          │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│           API Routes (Next.js)              │
│  - /api/subscribers (public)                │
│  - /api/admin/* (protected)                 │
│  - /api/webhooks/resend (Resend callbacks)  │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│         Business Logic Layer                │
│  - /src/lib/subscribers.ts                  │
│  - /src/lib/newsletters.ts                  │
│  - /src/lib/email-send.ts                   │
│  - /src/lib/resend.ts                       │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│         Data Layer (Prisma)                 │
│  - Subscriber, Newsletter models            │
│  - NewsletterContent, NewsletterStats       │
│  - NewsletterEvent                          │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                 │
└─────────────────────────────────────────────┘
```

### External Services
- **Resend:** Email sending and tracking
- **Vercel:** Hosting and serverless functions
- **PostgreSQL:** Database (Neon, Supabase, or self-hosted)

---

## Database Schema

### Subscriber
```prisma
model Subscriber {
  id                   String    @id @default(uuid())
  email                String    @unique
  firstName            String?
  status               SubscriberStatus @default(PENDING)
  interests            Json?     // Array of interest tags
  doubleOptInToken     String?   @unique
  doubleOptInSentAt    DateTime?
  confirmedAt          DateTime?
  unsubscribedAt       DateTime?
  lastOpenAt           DateTime?
  lastClickAt          DateTime?
  metadata             Json?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  events               NewsletterEvent[]

  @@index([email])
  @@index([status])
  @@map("subscribers")
}

enum SubscriberStatus {
  PENDING
  ACTIVE
  UNSUBSCRIBED
  BOUNCED
}
```

**Indexes:**
- `email` (unique): Fast subscriber lookup
- `status`: Filter active subscribers for sending

**JSONB Fields:**
- `interests`: Array of strings (e.g., `["Shows & Events", "Workshops"]`)
- `metadata`: Flexible storage for bounce info, unsubscribe reasons, etc.

---

### Newsletter
```prisma
model Newsletter {
  id              String           @id @default(uuid())
  slug            String           @unique
  subject         String
  preheader       String?
  heroImageUrl    String?
  heroTitle       String?
  heroSubtitle    String?
  heroCTALabel    String?
  heroCTAUrl      String?
  status          NewsletterStatus @default(DRAFT)
  scheduledAt     DateTime?
  sentAt          DateTime?
  recipientCount  Int              @default(0)
  createdBy       String?
  metadata        Json?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  content         NewsletterContent[]
  stats           NewsletterStats?
  events          NewsletterEvent[]

  @@index([status])
  @@index([slug])
  @@index([scheduledAt])
  @@map("newsletters")
}

enum NewsletterStatus {
  DRAFT
  SCHEDULED
  SENT
}
```

**Indexes:**
- `slug` (unique): Public URL generation
- `status`: Filter by draft/scheduled/sent
- `scheduledAt`: Background job pickup

---

### NewsletterContent
```prisma
model NewsletterContent {
  id                  String   @id @default(uuid())
  newsletterId        String
  contentType         ContentType
  contentData         Json     // Flexible content storage
  sectionHeading      String?
  sectionDescription  String?
  orderPosition       Int

  newsletter          Newsletter @relation(fields: [newsletterId], references: [id], onDelete: Cascade)

  @@index([newsletterId])
  @@index([orderPosition])
  @@map("newsletter_content")
}

enum ContentType {
  EVENT
  ARTICLE
  CUSTOM
}
```

**Content Data Structure:**
```typescript
// EVENT
{
  id: string
  title: string
  date: string
  time?: string
  venue?: string
  imageUrl?: string
  url: string
}

// ARTICLE
{
  id: string
  title: string
  excerpt: string
  imageUrl?: string
  url: string
}

// CUSTOM
{
  title: string
  description: string
  imageUrl?: string
  ctaLabel?: string
  ctaUrl?: string
}
```

---

### NewsletterStats
```prisma
model NewsletterStats {
  id                String   @id @default(uuid())
  newsletterId      String   @unique
  sentCount         Int      @default(0)
  deliveredCount    Int      @default(0)
  openCount         Int      @default(0)
  uniqueOpenCount   Int      @default(0)
  clickCount        Int      @default(0)
  uniqueClickCount  Int      @default(0)
  bounceCount       Int      @default(0)
  complaintCount    Int      @default(0)
  unsubscribeCount  Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  newsletter        Newsletter @relation(fields: [newsletterId], references: [id], onDelete: Cascade)

  @@map("newsletter_stats")
}
```

**Stats Tracking:**
- `sentCount`: Set when newsletter sent
- `deliveredCount`: Updated via webhook
- `openCount`: Total opens (can be multiple per subscriber)
- `uniqueOpenCount`: Unique subscribers who opened (tracked once)
- Similar logic for clicks

---

### NewsletterEvent
```prisma
model NewsletterEvent {
  id            String       @id @default(uuid())
  newsletterId  String
  subscriberId  String?
  eventType     EventType
  eventData     Json?
  resendEventId String?
  createdAt     DateTime     @default(now())

  newsletter    Newsletter   @relation(fields: [newsletterId], references: [id], onDelete: Cascade)
  subscriber    Subscriber?  @relation(fields: [subscriberId], references: [id], onDelete: SetNull)

  @@index([newsletterId])
  @@index([subscriberId])
  @@index([eventType])
  @@index([createdAt])
  @@map("newsletter_events")
}

enum EventType {
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
}
```

**Event Data Examples:**
```typescript
// CLICKED
{
  emailId: string
  link: string
}

// BOUNCED
{
  emailId: string
  bounceType: 'Hard' | 'Soft'
}
```

---

## API Endpoints

### Public Endpoints

#### POST /api/subscribers
**Purpose:** Subscriber signup
**Auth:** None (rate limited: 5/hour per IP)
**Body:**
```json
{
  "email": "user@example.com",
  "firstName": "Max",
  "interests": ["Shows & Events"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent"
}
```

#### GET /api/subscribers/confirm
**Purpose:** Double opt-in confirmation
**Auth:** None (token-based)
**Query:** `?token={doubleOptInToken}`
**Response:** 302 redirect to /newsletter/confirm success page

#### POST /api/subscribers/unsubscribe
**Purpose:** Single-click unsubscribe
**Auth:** None
**Body:**
```json
{
  "subscriberId": "uuid"
}
```
**Response:**
```json
{
  "success": true,
  "message": "You have been unsubscribed"
}
```

---

### Admin Endpoints

**Note:** All /api/admin/* endpoints require authentication (placeholder in current version)

#### GET /api/admin/subscribers
**Purpose:** List subscribers with pagination
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `status`: Filter by ACTIVE, PENDING, UNSUBSCRIBED
- `interests`: Filter by interest tags
- `export`: Set to 'csv' for CSV download

**Response:**
```json
{
  "subscribers": [...],
  "total": 247,
  "page": 1,
  "limit": 50
}
```

#### POST /api/admin/newsletters
**Purpose:** Create draft newsletter
**Body:**
```json
{
  "slug": "november-2025",
  "subject": "November im PEPE Dome",
  "preheader": "Shows, Events & More",
  "heroTitle": "November Highlights",
  "heroSubtitle": "Comedy, Circus & Community",
  "heroCTALabel": "View All Events",
  "heroCTAUrl": "/events"
}
```

#### PUT /api/admin/newsletters/[id]
**Purpose:** Update newsletter
**Body:** Same fields as POST (all optional)

#### DELETE /api/admin/newsletters/[id]
**Purpose:** Delete draft newsletter
**Note:** Cannot delete SCHEDULED or SENT newsletters

#### GET /api/admin/newsletters/[id]/preview
**Purpose:** Preview newsletter HTML
**Response:** HTML content

#### POST /api/admin/newsletters/[id]/test-send
**Purpose:** Send test emails
**Body:**
```json
{
  "testRecipients": ["test@example.com"]
}
```

#### POST /api/admin/newsletters/[id]/schedule
**Purpose:** Schedule newsletter for future send
**Body:**
```json
{
  "scheduledAt": "2025-12-01T10:00:00Z"
}
```

#### POST /api/admin/newsletters/[id]/send
**Purpose:** Send newsletter immediately
**Response:**
```json
{
  "success": 247,
  "failed": 3,
  "total": 250
}
```

#### GET /api/admin/content
**Purpose:** Fetch available content for selection
**Query:**
- `dateFrom`, `dateTo`: Filter by date range
- `category`: Filter by category
- `status`: Filter by published status
- `tags`: Filter by tags

---

### Webhook Endpoint

#### POST /api/webhooks/resend
**Purpose:** Receive Resend webhook events
**Auth:** Webhook signature verification
**Events:** email.sent, email.delivered, email.opened, email.clicked, email.bounced, email.complained

**Payload Example:**
```json
{
  "type": "email.opened",
  "created_at": "2025-11-17T10:30:00Z",
  "data": {
    "email_id": "resend-email-id",
    "from": "newsletter@pepe-dome.de",
    "to": ["subscriber@example.com"],
    "subject": "Newsletter Subject",
    "tags": [
      {"name": "newsletter_id", "value": "uuid"},
      {"name": "subscriber_id", "value": "uuid"}
    ]
  }
}
```

---

## Email System

### Sending Flow

```
┌─────────────────────────────────────────────────┐
│  1. Admin clicks "Send" or scheduled job runs   │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  2. sendNewsletter(newsletterId) called         │
│     - Fetches newsletter + content              │
│     - Fetches active subscribers                │
│     - Renders email HTML per subscriber         │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  3. Batch send via Resend API                   │
│     - 50 emails per batch                       │
│     - 1 second delay between batches            │
│     - Includes tracking tags                    │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  4. Update newsletter status to SENT            │
│     - Set sentAt timestamp                      │
│     - Record recipientCount                     │
│     - Create NewsletterStats record             │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  5. Resend sends emails                         │
│     - Webhooks fire for events                  │
│     - Stats updated in real-time                │
└─────────────────────────────────────────────────┘
```

### Email Templates

**Location:** `/src/components/email/templates/`

#### ConfirmationEmail.tsx
- Purpose: Double opt-in confirmation
- Props: `confirmationUrl`, `subscriberEmail`, `firstName?`
- Includes: Logo, CTA button, footer

#### WelcomeEmail.tsx
- Purpose: Sent after successful confirmation
- Props: `subscriberId`, `subscriberEmail`, `firstName?`, `upcomingEventsUrl`, `newsletterArchiveUrl`
- Includes: Welcome message, links, upcoming events teaser

#### NewsletterTemplate.tsx
- Purpose: Main newsletter layout
- Props: `subject`, `preheader`, `heroImageUrl`, `heroTitle`, `heroSubtitle`, `contentSections`, etc.
- Structure:
  - Header with logo
  - Hero section (image, title, subtitle, CTA)
  - Content sections (dynamic)
  - Footer with unsubscribe, legal info

### Email Components

**Location:** `/src/components/email/components/`

- `EmailHeader.tsx`: Logo and header
- `EmailFooter.tsx`: Address, unsubscribe, privacy
- `EmailButton.tsx`: CTA button with styling
- `EmailEventCard.tsx`: Event display card
- `EmailNewsCard.tsx`: Article/news card

### Rendering
```typescript
import { render } from '@react-email/components'

const html = render(
  <NewsletterTemplate {...props} />
)
```

### Personalization
- Unsubscribe URL includes subscriber ID
- First name used in greeting (if provided)
- Custom tags for tracking

---

## DotCloud Visual System

### Component Usage
```tsx
import DotCloud from '@/components/dotcloud/DotCloud'

<DotCloud
  subject={1} // 1-6
  size="large" // small | medium | large
  position="hero" // hero | intro | callout
  behavior="load" // load | scroll | idle | hover
/>
```

### Subjects
1. PEPE Dome logomark
2. Show logo/badge
3. Theatre mask/performer silhouette
4. Ticket/Admit One symbol
5. Stage/spotlight icon
6. Art/installations symbol

### Animation Configurations
**Location:** `/src/components/dotcloud/animations.ts`

- **load:** Fade + scale on page load (0.3-0.6s)
- **scroll:** Triggered when entering viewport (Framer Motion `whileInView`)
- **idle:** Slow drift and rotation (continuous)
- **hover:** Scale up on mouse hover

### Performance
- GPU-accelerated (CSS transforms only)
- `will-change: transform` applied
- One instance per page
- Responsive sizing (50% smaller on mobile)

### Integration Points
- Homepage (`/`): Subject 1, large, hero
- Events page (`/events`): Subject 5, medium, intro
- News page (`/news`): Subject 3, small, intro
- Newsletter archive (`/newsletter`): Subject 2 or 4, medium, intro
- About page (`/about`): Subject 1 or 6, large, behind text

---

## Testing

### Test Structure
```
/tests
├── models/           # Database model tests
├── api/              # API endpoint tests
├── email/            # Email template tests
├── components/       # React component tests
├── pages/            # Page rendering tests
├── resend/           # Resend integration tests
└── integration/      # End-to-end integration tests
```

### Running Tests
```bash
# All tests
npm test

# Specific test file
npm test tests/api/newsletters.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Test Database
- Uses same PostgreSQL database with separate test data
- Each test cleans up in `beforeEach` or `afterEach`
- Prisma migrations applied automatically

### Integration Tests
**Location:** `/tests/integration/`

- `subscriber-journey.test.ts`: Complete signup → confirm → receive → unsubscribe flow
- `newsletter-flow.test.ts`: Complete newsletter creation → send → stats tracking
- `webhook-stats-flow.test.ts`: Webhook processing and stats aggregation

---

## Deployment

### Environment Variables
See `.env.example` for required variables.

**Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: Resend API key
- `RESEND_FROM_EMAIL`: Sender email address
- `NEXT_PUBLIC_BASE_URL`: Site URL (for email links)

**Optional:**
- `RESEND_WEBHOOK_SECRET`: Webhook signature secret
- `RESEND_TEST_RECIPIENTS`: Comma-separated test emails

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed data (optional)
npx prisma db seed
```

### Resend Configuration
1. Log in to Resend dashboard
2. Add and verify your domain
3. Create API key
4. Set up webhook: Point to `https://yourdomain.com/api/webhooks/resend`
5. Copy webhook secret

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add DATABASE_URL
vercel env add RESEND_API_KEY
# ... etc
```

### Background Jobs (Scheduled Sends)
**Current:** Requires cron job or background worker
**Setup:**
```bash
# Add cron job (runs every 5 minutes)
*/5 * * * * curl https://yourdomain.com/api/jobs/send-scheduled
```

**Future:** Use Vercel Cron or dedicated job queue (Bull, pg-boss)

---

## Troubleshooting

### Common Issues

#### "Webhook signature verification failed"
**Cause:** Invalid or missing RESEND_WEBHOOK_SECRET
**Solution:**
- Copy secret from Resend dashboard
- Set in environment variables
- Restart server

#### "No recipients found"
**Cause:** No active subscribers
**Solution:**
- Check subscriber status (must be ACTIVE)
- Verify double opt-in completed
- Query: `SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'`

#### Test emails not arriving
**Cause:** Resend API key invalid or rate limit exceeded
**Solution:**
- Verify API key in Resend dashboard
- Check Resend sending logs
- Ensure domain is verified

#### Stats not updating
**Cause:** Webhooks not being received
**Solution:**
- Verify webhook URL in Resend dashboard
- Check webhook endpoint is publicly accessible
- Review server logs for webhook errors
- Test webhook with Resend webhook simulator

#### "Newsletter already sent" error
**Cause:** Attempting to resend sent newsletter
**Solution:**
- Cannot resend sent newsletters (by design)
- Duplicate newsletter and send as new
- Or create new newsletter

---

## API Response Utilities

**Location:** `/src/lib/api-response.ts`

Standard response formats:
```typescript
// Success
{
  success: true,
  data: { ... },
  message: "Optional message"
}

// Error
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

---

## Rate Limiting

**Location:** `/src/lib/rate-limit.ts`

**Configured Limits:**
- Subscriber signup: 5 per hour per IP
- Admin endpoints: TBD
- Webhook: Unlimited (verified by signature)

---

## Logging

**Strategy:** Console logging in development, structured logging in production

**Key Log Points:**
- Email send attempts and results
- Webhook event processing
- Errors and exceptions
- Batch processing progress

---

## Monitoring Recommendations

### Metrics to Track
- Subscriber growth rate
- Newsletter send success/failure rates
- Average open/click rates
- Bounce and complaint rates
- API response times
- Database query performance

### Alerting
- High bounce rate (> 5%)
- High complaint rate (> 0.5%)
- Failed webhook processing
- Background job failures
- Database connection issues

---

## Future Enhancements

### v2 Features (Out of Scope for v1)
- A/B testing for subject lines
- Automated newsletter generation
- Recurring scheduled sends
- Advanced subscriber segmentation
- In-browser email rendering tests
- In-browser image cropping
- Full WYSIWYG editor
- Admin-configurable DotCloud placement
- Newsletter archive search

---

## Support

**Technical Questions:** support@pepe-dome.de
**Resend Issues:** https://resend.com/support
**Prisma Issues:** https://www.prisma.io/docs/support

---

## License

Proprietary - PEPE Dome
