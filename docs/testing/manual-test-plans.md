# Manual Test Plans - Newsletter System

## Overview

This document contains comprehensive manual test plans for the newsletter system integration testing. These tests should be performed by a human tester to verify the complete functionality of the system.

---

## Test Plan 9.1.1: Full Subscriber Journey End-to-End

**Objective:** Verify the complete subscriber journey from signup to receiving newsletters.

### Prerequisites
- Newsletter system is deployed and accessible
- Database is clean or test data is isolated
- Resend is configured with valid API key
- Test email account accessible (e.g., Gmail)

### Test Steps

#### 1. Initial Signup
- [ ] Navigate to homepage
- [ ] Locate newsletter signup form in hero or footer
- [ ] Enter valid email address: `test.subscriber@example.com`
- [ ] Optionally enter first name: `Max`
- [ ] Submit form
- [ ] **Expected:** Inline confirmation message appears: "Danke! Schau in dein Postfach..."
- [ ] **Expected:** No page redirect occurs
- [ ] **Expected:** Form is replaced or hidden for returning visitors

#### 2. Confirmation Email Receipt
- [ ] Check email inbox for `test.subscriber@example.com`
- [ ] **Expected:** Email from "PEPE Dome" received within 1-2 minutes
- [ ] **Expected:** Subject line: "Bestätige deine Newsletter-Anmeldung bei PEPE Dome"
- [ ] **Expected:** Email contains PEPE Dome branding (logo, gold accents)
- [ ] **Expected:** Email contains confirmation button/link
- [ ] **Expected:** Email renders correctly in email client

#### 3. Double Opt-In Confirmation
- [ ] Click confirmation link in email
- [ ] **Expected:** Redirects to `/newsletter/confirm?token=xxx`
- [ ] **Expected:** Success page displays confirmation message
- [ ] **Expected:** Page includes link to newsletter archive
- [ ] **Expected:** localStorage flag `newsletter_subscribed` is set

#### 4. Welcome Email Receipt
- [ ] Check email inbox again
- [ ] **Expected:** Welcome email received within 1-2 minutes
- [ ] **Expected:** Subject line: "Willkommen beim PEPE Dome Newsletter!"
- [ ] **Expected:** Email includes welcome message and links to upcoming events
- [ ] **Expected:** Email renders correctly

#### 5. Newsletter Receipt
- [ ] Admin sends a test newsletter (see Test Plan 9.1.2)
- [ ] **Expected:** Newsletter email received by subscriber
- [ ] **Expected:** Newsletter includes hero image, content sections, and footer
- [ ] **Expected:** All links work correctly
- [ ] **Expected:** Unsubscribe link is present and visible

#### 6. Unsubscribe Flow
- [ ] Click unsubscribe link in newsletter email
- [ ] **Expected:** Redirects to `/newsletter/unsubscribe/{subscriberId}`
- [ ] **Expected:** Unsubscribe confirmation page displays
- [ ] **Expected:** Single-click unsubscribe (no auth required)
- [ ] **Expected:** Subscriber status updated to UNSUBSCRIBED in database

#### 7. Verify No Further Emails
- [ ] Admin sends another newsletter
- [ ] **Expected:** Unsubscribed user does NOT receive newsletter
- [ ] **Expected:** Database confirms subscriber status is UNSUBSCRIBED

### Database Verification
- [ ] Check `Subscriber` table for created record
- [ ] Verify `status` progresses: PENDING → ACTIVE → UNSUBSCRIBED
- [ ] Verify `confirmedAt` timestamp is set
- [ ] Verify `unsubscribedAt` timestamp is set
- [ ] Verify `doubleOptInToken` is generated and used

### Pass Criteria
- All expected results match actual results
- Email delivery is reliable and fast (< 2 minutes)
- All database records are correct
- Unsubscribe prevents future emails

---

## Test Plan 9.1.2: Full Newsletter Creation and Sending Flow

**Objective:** Verify the complete admin workflow for creating, previewing, testing, and sending newsletters.

### Prerequisites
- Admin access to `/admin/newsletters`
- At least 3 active subscribers in database
- Test recipient emails configured
- Sample content (events, articles) available

### Test Steps

#### 1. Create Draft Newsletter
- [ ] Navigate to `/admin/newsletters`
- [ ] Click "Create Newsletter" button
- [ ] **Expected:** Redirects to `/admin/newsletters/new`
- [ ] Enter subject line: "PEPE Dome November Highlights"
- [ ] Enter preheader: "Shows, Workshops, and Behind the Scenes"
- [ ] Enter hero title: "November im PEPE Dome"
- [ ] Enter hero subtitle: "Comedy, Circus & Community"
- [ ] Enter CTA label: "Alle Events ansehen"
- [ ] Enter CTA URL: "/events"
- [ ] **Expected:** All form fields accept input correctly

#### 2. Upload Hero Image
- [ ] Upload test image (1200x600px recommended)
- [ ] **Expected:** Image uploads successfully
- [ ] **Expected:** Live preview displays uploaded image
- [ ] **Expected:** Aspect ratio warning appears if image is far from 2:1
- [ ] Upload image with wrong aspect ratio (test validation)
- [ ] **Expected:** Warning displayed but upload still allowed

#### 3. Select Content
- [ ] Click "Add Content" or similar
- [ ] **Expected:** Content selector modal/panel opens
- [ ] Filter by date range (current month)
- [ ] Filter by category (Shows)
- [ ] **Expected:** Filtered content list updates
- [ ] Check 3-5 content items (events, articles)
- [ ] **Expected:** Selected items appear in preview panel
- [ ] Click "Add to Newsletter"
- [ ] **Expected:** Items added to newsletter draft

#### 4. Reorder Content
- [ ] Drag and drop content items to reorder
- [ ] **Expected:** Order updates smoothly with visual feedback
- [ ] **Expected:** `orderPosition` updates in real-time
- [ ] Edit section heading: "Kommende Shows"
- [ ] Edit section description: "Das erwartet dich im November"
- [ ] **Expected:** Inline editing works correctly

#### 5. Save Draft
- [ ] Click "Save Draft" button
- [ ] **Expected:** Success notification appears
- [ ] **Expected:** Newsletter saved with status DRAFT
- [ ] **Expected:** Redirect to edit page `/admin/newsletters/{id}/edit`

#### 6. Preview Newsletter
- [ ] Click "Preview" button
- [ ] **Expected:** Preview modal or new tab opens
- [ ] **Expected:** Newsletter HTML renders with all content
- [ ] **Expected:** Hero image displays correctly
- [ ] **Expected:** Content sections render in correct order
- [ ] **Expected:** Footer includes legal info and unsubscribe link
- [ ] **Expected:** Mobile responsive (test by resizing browser)

#### 7. Send Test Email
- [ ] Click "Send Test Email" button
- [ ] **Expected:** Confirmation dialog appears
- [ ] Confirm test send
- [ ] **Expected:** Test emails sent to configured test recipients
- [ ] Check test email inbox
- [ ] **Expected:** Test email received within 1-2 minutes
- [ ] **Expected:** Email renders correctly in email client
- [ ] **Expected:** All links work (click through to verify)
- [ ] **Expected:** Newsletter status remains DRAFT (not changed)

#### 8. Schedule Newsletter
- [ ] Click "Schedule" button
- [ ] **Expected:** Scheduling modal opens
- [ ] Select date/time picker (set 5 minutes in future for testing)
- [ ] **Expected:** Date picker validates future date only
- [ ] Try to schedule past date (test validation)
- [ ] **Expected:** Error message: "Must be future date"
- [ ] Set valid future date
- [ ] Click "Schedule Newsletter"
- [ ] **Expected:** Confirmation modal appears with recipient count
- [ ] Confirm scheduling
- [ ] **Expected:** Newsletter status updates to SCHEDULED
- [ ] **Expected:** Background job created for scheduled send

#### 9. Send Now (Alternative to Scheduling)
- [ ] Create another draft newsletter (repeat steps 1-5)
- [ ] Click "Send Now" button
- [ ] **Expected:** Confirmation modal appears
- [ ] **Expected:** Modal shows recipient count (e.g., "Send to 3 subscribers?")
- [ ] **Expected:** Modal shows last 5 test send results
- [ ] **Expected:** "Send" button disabled if no subscribers
- [ ] Confirm send
- [ ] **Expected:** Newsletter status updates to SENT
- [ ] **Expected:** `sentAt` timestamp recorded
- [ ] **Expected:** `recipientCount` updated

#### 10. Verify Newsletter Sent
- [ ] Check subscriber email inboxes
- [ ] **Expected:** All active subscribers received newsletter
- [ ] **Expected:** Newsletter renders correctly
- [ ] **Expected:** Hero image displays
- [ ] **Expected:** Content sections render correctly
- [ ] **Expected:** All links work
- [ ] **Expected:** Unsubscribe link present

#### 11. View Newsletter Stats
- [ ] Return to `/admin/newsletters`
- [ ] **Expected:** Sent newsletter shows basic stats (sent count)
- [ ] Click newsletter to view details
- [ ] **Expected:** Stats update as webhooks arrive (opens, clicks)
- [ ] Open newsletter email in subscriber inbox
- [ ] Click a link in newsletter
- [ ] Wait 1-2 minutes for webhook processing
- [ ] Refresh admin stats page
- [ ] **Expected:** Open count increments
- [ ] **Expected:** Click count increments

### Database Verification
- [ ] Check `Newsletter` table for created record
- [ ] Verify `status` progresses: DRAFT → SCHEDULED/SENT
- [ ] Verify `recipientCount` matches active subscriber count
- [ ] Check `NewsletterContent` table for content associations
- [ ] Verify `orderPosition` matches reordered items
- [ ] Check `NewsletterStats` table for sent count

### Pass Criteria
- All steps complete successfully without errors
- Newsletter creation flow is intuitive and smooth
- Preview matches final sent email
- Test send doesn't affect newsletter status
- Send/schedule works correctly
- Stats tracking functions properly

---

## Test Plan 9.1.3: Webhook Event Tracking

**Objective:** Verify that Resend webhook events are received, processed, and stored correctly.

### Prerequisites
- Newsletter sent to at least 1 active subscriber
- Resend webhook configured and pointing to `/api/webhooks/resend`
- Access to Resend dashboard for webhook logs
- RESEND_WEBHOOK_SECRET configured (if using signature verification)

### Test Steps

#### 1. Configure Webhook (One-Time Setup)
- [ ] Log in to Resend dashboard
- [ ] Navigate to Webhooks section
- [ ] Add webhook endpoint: `https://pepe-dome.de/api/webhooks/resend`
- [ ] Select events: sent, delivered, opened, clicked, bounced, complained
- [ ] Copy webhook secret
- [ ] Set `RESEND_WEBHOOK_SECRET` environment variable
- [ ] **Expected:** Webhook configured successfully

#### 2. Send Newsletter and Track Sent Event
- [ ] Send newsletter via admin UI (see Test Plan 9.1.2)
- [ ] **Expected:** Newsletter sent successfully
- [ ] Check Resend dashboard webhook logs
- [ ] **Expected:** `email.sent` event delivered to webhook endpoint
- [ ] Check application logs
- [ ] **Expected:** Webhook received log entry
- [ ] **Expected:** Event processed without errors

#### 3. Track Delivery Event
- [ ] Wait 30-60 seconds for email delivery
- [ ] Check Resend webhook logs
- [ ] **Expected:** `email.delivered` event delivered
- [ ] Check database `NewsletterStats` table
- [ ] **Expected:** `deliveredCount` incremented for newsletter

#### 4. Track Open Event
- [ ] Open newsletter email in subscriber inbox
- [ ] Wait 30-60 seconds for tracking pixel load
- [ ] Check Resend webhook logs
- [ ] **Expected:** `email.opened` event delivered
- [ ] Check database `NewsletterStats` table
- [ ] **Expected:** `openCount` incremented
- [ ] **Expected:** `uniqueOpenCount` incremented (first open only)
- [ ] Check `Subscriber` table
- [ ] **Expected:** `lastOpenAt` timestamp updated
- [ ] Check `NewsletterEvent` table
- [ ] **Expected:** Event record created with type OPENED
- [ ] Open email again (test unique tracking)
- [ ] **Expected:** `openCount` increments again
- [ ] **Expected:** `uniqueOpenCount` does NOT increment (still 1)

#### 5. Track Click Event
- [ ] Click a link in newsletter email
- [ ] Wait 30-60 seconds for webhook processing
- [ ] Check Resend webhook logs
- [ ] **Expected:** `email.clicked` event delivered
- [ ] **Expected:** Event data includes clicked URL
- [ ] Check database `NewsletterStats` table
- [ ] **Expected:** `clickCount` incremented
- [ ] **Expected:** `uniqueClickCount` incremented (first click)
- [ ] Check `Subscriber` table
- [ ] **Expected:** `lastClickAt` timestamp updated
- [ ] Check `NewsletterEvent` table
- [ ] **Expected:** Event record created with type CLICKED
- [ ] **Expected:** `eventData` includes clicked link URL
- [ ] Click another link (test unique tracking)
- [ ] **Expected:** `clickCount` increments again
- [ ] **Expected:** `uniqueClickCount` does NOT increment (still 1)

#### 6. Test Bounce Handling
- [ ] Send newsletter to invalid email (e.g., `invalid@nonexistent-domain-test.com`)
- [ ] Wait for bounce webhook (may take several minutes)
- [ ] Check Resend webhook logs
- [ ] **Expected:** `email.bounced` event delivered
- [ ] **Expected:** Bounce type indicated (Hard or Soft)
- [ ] If Hard Bounce:
  - [ ] Check `Subscriber` table
  - [ ] **Expected:** Subscriber status updated to UNSUBSCRIBED
  - [ ] **Expected:** `unsubscribedAt` timestamp set
  - [ ] **Expected:** `metadata` includes bounce info
- [ ] If Soft Bounce:
  - [ ] **Expected:** Bounce logged in metadata but status unchanged

#### 7. Test Spam Complaint Handling
- [ ] Send newsletter to test email
- [ ] Mark email as spam in email client
- [ ] Wait for complaint webhook (may take several minutes)
- [ ] Check Resend webhook logs
- [ ] **Expected:** `email.complained` event delivered
- [ ] Check `Subscriber` table
- [ ] **Expected:** Subscriber status updated to UNSUBSCRIBED
- [ ] **Expected:** `unsubscribedAt` timestamp set
- [ ] **Expected:** `metadata` includes complaint reason

#### 8. Verify Webhook Signature
- [ ] Send webhook with invalid signature (test with Postman or curl)
- [ ] **Expected:** Webhook rejected with 401 Unauthorized
- [ ] Send webhook with valid signature
- [ ] **Expected:** Webhook accepted and processed
- [ ] Test with missing signature (if RESEND_WEBHOOK_SECRET configured)
- [ ] **Expected:** Warning logged but webhook processed (dev mode)

### Database Verification
- [ ] Query `NewsletterStats` for test newsletter
- [ ] Verify all counts are accurate (sent, delivered, open, click)
- [ ] Query `NewsletterEvent` for all events
- [ ] Verify event types, timestamps, and subscriber IDs
- [ ] Verify unique vs. total counts are tracked correctly

### Pass Criteria
- All webhook events received and processed
- Database records created and updated correctly
- Stats aggregate accurately
- Bounce and complaint handling works
- Webhook signature verification works (if enabled)

---

## Test Plan 9.1.4: Newsletter Archive Public View

**Objective:** Verify that sent newsletters are accessible via public archive pages with proper SEO.

### Prerequisites
- At least 2 newsletters sent with status SENT
- Newsletters have unique slugs, titles, and hero images

### Test Steps

#### 1. Navigate to Archive Index
- [ ] Navigate to `/newsletter`
- [ ] **Expected:** Archive index page loads
- [ ] **Expected:** Page title includes "Newsletter Archiv" or similar
- [ ] **Expected:** Page includes newsletter signup form
- [ ] **Expected:** DotCloud animation present (Subject 2 or 4)

#### 2. Verify Newsletter List
- [ ] **Expected:** All sent newsletters listed
- [ ] **Expected:** Newsletters grouped by year
- [ ] **Expected:** Each item shows: date, title, CTA link
- [ ] **Expected:** Most recent newsletter appears first
- [ ] **Expected:** Draft and scheduled newsletters NOT visible

#### 3. Filter by Year
- [ ] Use year dropdown filter (if available)
- [ ] Select previous year (e.g., 2024)
- [ ] **Expected:** Only newsletters from selected year shown
- [ ] Select current year
- [ ] **Expected:** Current year newsletters shown

#### 4. Navigate to Individual Newsletter
- [ ] Click on a newsletter title or CTA
- [ ] **Expected:** Redirects to `/newsletter/{slug}`
- [ ] **Expected:** Newsletter page loads with full content
- [ ] **Expected:** Page renders same HTML as email version
- [ ] **Expected:** Hero image displays
- [ ] **Expected:** Content sections render correctly
- [ ] **Expected:** Footer includes signup CTA

#### 5. Verify Web-Specific Enhancements
- [ ] Test responsive design (resize browser)
- [ ] **Expected:** Single-column layout on mobile
- [ ] **Expected:** Text is readable (16px+ body text)
- [ ] **Expected:** Better fonts than email (web fonts loaded)
- [ ] **Expected:** Touch targets are adequate (44px+ for buttons)

#### 6. Test SEO Meta Tags
- [ ] View page source (Ctrl+U or Cmd+Option+U)
- [ ] **Expected:** Unique `<title>` tag per newsletter
- [ ] **Expected:** Meta description present and unique
- [ ] **Expected:** Open Graph tags present:
  - `og:title`
  - `og:description`
  - `og:image` (hero image or default)
  - `og:url`
- [ ] **Expected:** Canonical URL present
- [ ] **Expected:** JSON-LD structured data present (if implemented)

#### 7. Test Social Sharing
- [ ] Copy URL and test in social media preview tools:
  - Facebook Sharing Debugger
  - Twitter Card Validator
  - LinkedIn Post Inspector
- [ ] **Expected:** Hero image displays in preview
- [ ] **Expected:** Title and description display correctly
- [ ] **Expected:** No broken images or missing data

#### 8. Test Newsletter Links
- [ ] Click internal links (events, articles)
- [ ] **Expected:** Links work and navigate correctly
- [ ] Click external links (if any)
- [ ] **Expected:** Links open in new tab (if configured)
- [ ] Click unsubscribe link (should NOT be visible on web version)
- [ ] **Expected:** Unsubscribe link hidden or shows generic message

#### 9. Test Static Generation
- [ ] Check page load speed
- [ ] **Expected:** Page loads quickly (< 1 second)
- [ ] Check Network tab in DevTools
- [ ] **Expected:** Page served as static HTML (not API fetch)
- [ ] Test revalidation:
  - Send new newsletter
  - Wait for revalidation period (1 hour)
  - Refresh archive index
  - **Expected:** New newsletter appears in list

### Performance Testing
- [ ] Run Lighthouse audit on archive index
- [ ] **Expected:** Performance score > 90
- [ ] **Expected:** Accessibility score > 90
- [ ] **Expected:** SEO score > 90
- [ ] Run Lighthouse on individual newsletter page
- [ ] **Expected:** Similar scores as index

### Pass Criteria
- Archive index lists all sent newsletters
- Individual pages render correctly
- SEO meta tags are complete and accurate
- Static generation improves performance
- Signup CTA present on all pages
- No draft/scheduled newsletters visible to public

---

## Test Plan 9.1.5: DotCloud Across All Pages

**Objective:** Verify DotCloud visual system is integrated correctly across all key pages with proper animations and performance.

### Prerequisites
- All 6 DotCloud subjects created and available
- DotCloud component integrated on 5+ pages
- Access to Chrome DevTools for performance testing

### Test Steps

#### 1. Homepage (/)
- [ ] Navigate to homepage
- [ ] **Expected:** One DotCloud instance visible
- [ ] **Expected:** Subject 1 (PEPE Dome logomark) used
- [ ] **Expected:** Large size
- [ ] **Expected:** Positioned in hero section (top-right or behind headline)
- [ ] **Expected:** Load animation plays on page load (0.3-0.6s)
- [ ] **Expected:** Idle motion (slow drift) continues after load
- [ ] **Expected:** DotCloud doesn't obscure primary text or CTA
- [ ] **Expected:** Safe margins maintained (40px from text, 20px from CTAs)

#### 2. Events Page (/events)
- [ ] Navigate to `/events`
- [ ] **Expected:** One DotCloud instance visible
- [ ] **Expected:** Subject 5 (Stage/spotlight icon) used
- [ ] **Expected:** Medium size
- [ ] **Expected:** Positioned near "Upcoming Shows" headline
- [ ] **Expected:** Scroll animation triggers when entering viewport
- [ ] **Expected:** Animation plays once (not on every scroll)
- [ ] **Expected:** Idle motion subtle (no distraction from content)

#### 3. News/Articles Page (/news)
- [ ] Navigate to `/news`
- [ ] **Expected:** One DotCloud instance visible
- [ ] **Expected:** Subject 3 (Theatre mask/performer) used
- [ ] **Expected:** Small size
- [ ] **Expected:** Positioned near page intro
- [ ] **Expected:** Scroll animation with gentle rotate
- [ ] **Expected:** Animation smooth and non-jarring

#### 4. Newsletter Archive (/newsletter)
- [ ] Navigate to `/newsletter`
- [ ] **Expected:** One DotCloud instance visible
- [ ] **Expected:** Subject 2 (Show logo/badge) or Subject 4 (Ticket symbol)
- [ ] **Expected:** Medium size
- [ ] **Expected:** Positioned near page title
- [ ] **Expected:** Scroll animation plays when visible

#### 5. About/Dome Page (/about)
- [ ] Navigate to `/about` or equivalent
- [ ] **Expected:** One DotCloud instance visible
- [ ] **Expected:** Subject 1 (logomark) or Subject 6 (Art/installations)
- [ ] **Expected:** Large to medium size
- [ ] **Expected:** Behind mission statement or quote
- [ ] **Expected:** Load animation with idle drift
- [ ] **Expected:** Z-index ensures text remains readable

#### 6. Mobile Responsive Testing
- [ ] Test all pages on mobile (resize browser to 375px width)
- [ ] **Expected:** DotCloud size reduced by ~50% on mobile
- [ ] **Expected:** DotCloud hidden if it obscures critical content
- [ ] **Expected:** Animations still smooth on mobile
- [ ] **Expected:** Safe margins maintained

#### 7. Animation Performance Testing
- [ ] Open Chrome DevTools > Performance tab
- [ ] Record performance while loading homepage
- [ ] **Expected:** No layout thrashing (no red bars in timeline)
- [ ] **Expected:** Animation uses GPU acceleration (composite layers)
- [ ] **Expected:** Frame rate stays at 60fps during animation
- [ ] Check Elements tab > Computed styles
- [ ] **Expected:** `will-change: transform` applied to animated instances
- [ ] **Expected:** Only CSS transforms used (translate, scale, rotate)

#### 8. Low-End Device Testing
- [ ] Enable CPU throttling in DevTools (6x slowdown)
- [ ] Reload pages with DotCloud
- [ ] **Expected:** Animations still smooth (no janky movement)
- [ ] **Expected:** Page remains responsive
- [ ] Test on actual low-end device (if available)
- [ ] **Expected:** No performance degradation

#### 9. Accessibility Testing
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] **Expected:** DotCloud is decorative and ignored by screen reader
- [ ] **Expected:** `aria-hidden="true"` or similar applied
- [ ] Test keyboard navigation
- [ ] **Expected:** DotCloud doesn't interfere with tab order

#### 10. Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] **Expected:** Animations work consistently across browsers
- [ ] **Expected:** No visual bugs or glitches

### Performance Metrics
- [ ] Run Lighthouse on each page with DotCloud
- [ ] **Expected:** Performance score remains > 90
- [ ] **Expected:** No "Avoid large layout shifts" warnings related to DotCloud
- [ ] Check bundle size
- [ ] **Expected:** DotCloud assets add < 50KB total

### Pass Criteria
- DotCloud integrated on 5+ key pages
- Each page has ONE DotCloud instance
- Correct subject used per page
- Animations smooth and performant (60fps)
- Safe margins respected (no text obstruction)
- Mobile responsive (reduced size or hidden)
- GPU-accelerated animations (transforms only)
- No performance degradation

---

## Test Execution Tracking

### Test Plan Status
- [ ] 9.1.1 - Subscriber Journey - Not Started / In Progress / Complete / Failed
- [ ] 9.1.2 - Newsletter Flow - Not Started / In Progress / Complete / Failed
- [ ] 9.1.3 - Webhook Tracking - Not Started / In Progress / Complete / Failed
- [ ] 9.1.4 - Archive Pages - Not Started / In Progress / Complete / Failed
- [ ] 9.1.5 - DotCloud Integration - Not Started / In Progress / Complete / Failed

### Issues Found
- Issue 1: [Description]
- Issue 2: [Description]
- Issue 3: [Description]

### Notes
- Add any observations or recommendations here
