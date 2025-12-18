# PEPE Dome Newsletter Admin Guide

**Version:** 1.0
**Last Updated:** 2025-11-17
**Audience:** PEPE Dome Marketing Team & Administrators

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing the Admin Panel](#accessing-the-admin-panel)
3. [Creating a Newsletter](#creating-a-newsletter)
4. [Selecting Content](#selecting-content)
5. [Uploading Hero Images](#uploading-hero-images)
6. [Previewing Your Newsletter](#previewing-your-newsletter)
7. [Sending Test Emails](#sending-test-emails)
8. [Scheduling a Newsletter](#scheduling-a-newsletter)
9. [Sending a Newsletter Now](#sending-a-newsletter-now)
10. [Viewing Newsletter Stats](#viewing-newsletter-stats)
11. [Managing Subscribers](#managing-subscribers)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)

---

## Overview

The PEPE Dome Newsletter System allows you to create, customize, and send beautiful email newsletters to your subscribers. This guide will walk you through every step of the process.

### What You Can Do
- Create monthly or event-based newsletters
- Select events, articles, and custom content
- Upload hero images and customize titles
- Send test emails before going live
- Schedule newsletters for specific dates
- Track opens, clicks, and engagement

### What the System Does Automatically
- Collects subscribers via website forms
- Handles double opt-in confirmation
- Manages unsubscribes
- Tracks email engagement (opens, clicks)
- Ensures GDPR compliance

---

## Accessing the Admin Panel

1. Navigate to: `https://pepe-dome.de/admin/newsletters`
2. Log in with your admin credentials
3. You'll see the Newsletter Dashboard

### Newsletter Dashboard
The dashboard shows:
- **Draft Newsletters:** Newsletters you're working on
- **Scheduled Newsletters:** Newsletters set to send in the future
- **Sent Newsletters:** Past newsletters with stats
- **Subscriber Count:** Total active subscribers

---

## Creating a Newsletter

### Step 1: Start a New Newsletter
1. Click the **"Create Newsletter"** button
2. You'll be taken to the newsletter creation form

### Step 2: Fill in Basic Information

#### Subject Line (Required)
- This is what subscribers see in their inbox
- Keep it short and engaging (max 60 characters)
- Examples:
  - "November Shows im PEPE Dome"
  - "Neue Comedy-Acts + Behind the Scenes"
  - "Dein Monatsupdate vom PEPE Dome"

**Tips:**
- Use emojis sparingly (🎭 🎪 ✨)
- Avoid spam words (FREE, URGENT, BUY NOW)
- Mention the month or event name

#### Preheader (Optional but Recommended)
- The preview text shown after the subject line
- Max 100 characters
- Examples:
  - "Comedy, Circus & Community - Das erwartet dich"
  - "3 neue Shows + exklusive Backstage-Einblicke"

#### Hero Title (Optional)
- Large headline at the top of the email
- Examples:
  - "November im PEPE Dome"
  - "Showtime im Dezember"

#### Hero Subtitle (Optional)
- Supporting text under the hero title
- Examples:
  - "Comedy, Circus & Community"
  - "Deine Highlights diesen Monat"

#### Hero CTA Label & URL (Optional)
- Call-to-action button in hero section
- Examples:
  - Label: "Alle Events ansehen" → URL: `/events`
  - Label: "Tickets sichern" → URL: `/events/comedy-night`

### Step 3: Save as Draft
- Click **"Save Draft"** to save your progress
- You can return to edit anytime
- Draft newsletters are not visible to subscribers

---

## Selecting Content

### Step 1: Open Content Selector
- Click **"Add Content"** or **"Select Content"**
- The content selector panel opens

### Step 2: Filter Content
Use filters to find relevant content:
- **Date Range:** Select start and end dates (e.g., current month)
- **Category:** Shows, Workshops, Corporate, News, Backstage
- **Status:** Published (ready to include)
- **Tags:** family, circus, kids, late night, etc.

### Step 3: Select Items
- Check the box next to each item you want to include
- Selected items appear in the preview panel
- You can select events, articles, and custom content

### Step 4: Add to Newsletter
- Click **"Add to Newsletter"**
- Items are added to your draft

### Step 5: Reorder Content
- Drag and drop items to reorder
- The order determines how they appear in the email

### Step 6: Organize into Sections
- Edit section headings (e.g., "Kommende Shows", "Aus dem Dome")
- Add section descriptions (optional)
- Inline editing: Click heading/description to edit

**Section Examples:**
- **"Kommende Shows"** → Upcoming events
- **"Workshops & Community"** → Training and workshops
- **"Behind the Scenes"** → Backstage articles
- **"Nicht verpassen"** → Featured content

---

## Uploading Hero Images

### Step 1: Prepare Your Image
**Recommended Specs:**
- **Dimensions:** 1200px × 600px (2:1 aspect ratio)
- **Format:** JPG or PNG
- **Size:** Under 500KB
- **Content:** Safe central focus (text won't be cropped on mobile)

### Step 2: Upload
1. Click **"Upload Hero Image"**
2. Select your image file
3. The system validates aspect ratio

### Step 3: Preview
- Live preview shows how the image will look
- If aspect ratio is off, you'll see a warning
- You can still upload, but image may be letterboxed

**Tips:**
- Use high-quality event photos
- Avoid text in images (use hero title instead)
- Test on mobile (safe zone is center 80%)

---

## Previewing Your Newsletter

### Browser Preview
1. Click **"Preview"** button
2. Newsletter opens in new tab or modal
3. Check:
   - Hero image displays correctly
   - Content sections in correct order
   - All links work
   - Footer includes unsubscribe and legal info

### Mobile Preview
- Resize browser window to mobile width (375px)
- Or use browser DevTools device emulation
- Verify:
   - Single-column layout
   - Text is readable (16px+)
   - Buttons are easy to tap

---

## Sending Test Emails

### Why Send Test Emails?
- See exactly how subscribers will receive it
- Test in your actual email client (Gmail, Outlook, etc.)
- Catch typos and formatting issues

### Step 1: Configure Test Recipients
Test recipient emails are pre-configured by your admin. Common setup:
- Your own email
- Marketing team emails
- Test accounts in different email clients

### Step 2: Send Test
1. Click **"Send Test Email"** button
2. Confirmation dialog appears
3. Click **"Send"** to confirm
4. Check your inbox (usually arrives in 1-2 minutes)

### Step 3: Review
- Open email in your client
- Click all links to verify they work
- Check on mobile device
- Verify hero image loads

**Note:** Test sends do NOT change the newsletter status. You can send multiple tests.

---

## Scheduling a Newsletter

### When to Schedule
- Send on specific day/time (e.g., first Monday of month at 10 AM)
- Schedule for optimal open rates (Tuesday-Thursday, 9-11 AM)

### Step 1: Click "Schedule"
- **"Schedule"** button in editor
- Scheduling modal opens

### Step 2: Select Date & Time
- Use date/time picker
- Must be a future date (cannot schedule in the past)
- Time is in your local timezone

### Step 3: Confirm
- Review recipient count
- Click **"Schedule Newsletter"**
- Status changes to **SCHEDULED**

### What Happens Next
- Newsletter appears in "Scheduled" section of dashboard
- Background job picks it up at scheduled time
- Emails sent automatically
- Status changes to **SENT**

### Cancel a Scheduled Send
- Navigate to scheduled newsletter
- Click **"Cancel Scheduling"** or **"Edit"**
- Status reverts to **DRAFT**

---

## Sending a Newsletter Now

### When to Send Now
- Time-sensitive announcements
- Last-minute event promotions
- You've tested and are ready to go

### Step 1: Click "Send Now"
- **"Send Now"** button in editor
- Confirmation modal opens

### Step 2: Review Confirmation
- Shows recipient count (e.g., "Send to 247 subscribers?")
- Shows last 5 test send results
- If no subscribers, button is disabled

### Step 3: Final Check
- **IMPORTANT:** This cannot be undone
- Make sure you've:
  - Previewed the newsletter
  - Sent and reviewed test emails
  - Double-checked all content and links

### Step 4: Confirm Send
- Click **"Yes, Send Newsletter"**
- Sending begins immediately
- Status changes to **SENT**

### What Happens
- Emails sent in batches (50 at a time)
- Takes 2-5 minutes for 500 subscribers
- Sent newsletters appear in "Sent" section with stats

---

## Viewing Newsletter Stats

### Where to Find Stats
1. Navigate to **Newsletter Dashboard**
2. Sent newsletters show basic stats
3. Click newsletter to view detailed stats

### Available Metrics

#### Sent Count
- Total emails successfully sent
- Excludes bounces and failures

#### Delivered Count
- Emails that reached inboxes
- Updated via webhooks (may take a few minutes)

#### Open Rate
- **Opens:** Total times newsletter was opened
- **Unique Opens:** Number of unique subscribers who opened
- **Open Rate:** (Unique Opens / Delivered) × 100%

**Note:** Open rate requires image loading (tracking pixel). Some email clients block images, so actual opens may be higher.

#### Click Rate
- **Clicks:** Total clicks on any link
- **Unique Clicks:** Number of unique subscribers who clicked
- **Click Rate:** (Unique Clicks / Unique Opens) × 100%

#### Bounce & Complaint
- **Bounces:** Emails that failed to deliver (hard/soft)
- **Complaints:** Subscribers who marked as spam

### Stats Update Timing
- Delivered: 1-5 minutes after send
- Opens: Real-time (as subscribers open)
- Clicks: Real-time (as subscribers click)
- Bounces: 1-30 minutes after send

### Good Benchmarks
- Open Rate: 20-30% (good), 30-40% (excellent)
- Click Rate: 2-5% (good), 5-10% (excellent)
- Bounce Rate: < 2% (healthy list)
- Complaint Rate: < 0.1% (acceptable)

---

## Managing Subscribers

### Viewing Subscribers
1. Navigate to **Admin Dashboard**
2. Click **"Subscribers"** or go to `/admin/subscribers`

### Subscriber List
Shows:
- Email address
- Name (if provided)
- Status (Active, Pending, Unsubscribed)
- Interests (Shows, Workshops, Corporate)
- Confirmed date
- Last opened/clicked

### Filtering & Sorting
- Filter by status (Active, Pending, Unsubscribed)
- Filter by interests
- Sort by date, last activity
- Search by email

### Exporting Subscribers
1. Click **"Export CSV"**
2. Downloads CSV file with all subscriber data
3. Use for reporting or backup

### CSV Includes:
- Email, Name, Status, Interests
- Confirmation date, Unsubscribe date
- Last open, Last click
- Created date

### Manually Adding Subscribers
**Not recommended** (violates GDPR without consent)
- Subscribers should sign up via website forms
- If you must add manually, ensure you have explicit consent

### Removing Subscribers
- Subscribers can unsubscribe via email link
- Admins can manually unsubscribe if requested
- **Important:** Document consent withdrawal

---

## Best Practices

### Content Strategy
- **Consistency:** Send monthly or bi-weekly
- **Value:** Mix promotions with valuable content (behind-the-scenes, tips)
- **Balance:** 3-5 content items per newsletter (not too overwhelming)
- **Urgency:** Include upcoming events prominently

### Subject Lines
- ✅ **Good:** "November Shows im PEPE Dome"
- ✅ **Good:** "Letzte Tickets: Comedy Night am 20.11"
- ❌ **Avoid:** "Newsletter #47"
- ❌ **Avoid:** "FREE TICKETS BUY NOW!!!" (spam trigger)

### Sending Times
- **Best Days:** Tuesday, Wednesday, Thursday
- **Best Times:** 9-11 AM or 7-9 PM
- **Avoid:** Monday mornings, Friday afternoons, weekends
- **Test:** A/B test different times for your audience

### Email Design
- **Hero Image:** Use high-quality event photos
- **Content:** 3-5 sections maximum
- **CTAs:** 1-2 primary calls-to-action
- **Mobile:** Always preview on mobile before sending

### List Health
- **Clean Regularly:** Remove bounced emails
- **Engagement:** Remove subscribers who haven't opened in 6+ months (optional)
- **Growth:** Promote signup forms on website, social media
- **Quality > Quantity:** Better to have 200 engaged subscribers than 1000 inactive

### Legal & GDPR
- **Always include:** Unsubscribe link, company address, privacy policy
- **Never:** Buy email lists, add people without consent
- **Honor:** Unsubscribe requests immediately
- **Document:** Keep records of consent (double opt-in)

---

## Troubleshooting

### "No subscribers found" error
**Problem:** Trying to send to empty list
**Solution:**
- Check subscriber count in dashboard
- Filter for "Active" status
- Verify subscribers have confirmed (double opt-in)

### Hero image not displaying in email
**Problem:** Image hosting or format issue
**Solution:**
- Use JPG or PNG format
- Ensure image URL is publicly accessible
- Check image size (< 500KB recommended)
- Test in multiple email clients

### Test email not arriving
**Problem:** Email delivery delay or spam filter
**Solution:**
- Wait 2-5 minutes (can be delayed)
- Check spam/junk folder
- Verify test recipient email is correct
- Check Resend dashboard for send status

### Newsletter stuck in "Scheduled"
**Problem:** Background job not running
**Solution:**
- Contact technical support
- Check server logs for errors
- Verify scheduled time has passed
- May need to manually trigger send

### Low open rates
**Problem:** Engagement or deliverability issue
**Solution:**
- **Subject Line:** Make it more compelling
- **Sending Time:** Try different days/times
- **List Quality:** Remove inactive subscribers
- **Spam Score:** Check spam folder placement
- **From Address:** Use recognizable sender name

### High bounce rate
**Problem:** Invalid emails or deliverability issue
**Solution:**
- Remove bounced emails from list
- Check domain authentication (SPF, DKIM)
- Verify "from" address is authenticated
- Contact support if persistent

### Subscribers not receiving newsletter
**Problem:** Various possible causes
**Solution:**
1. Check subscriber status (must be ACTIVE)
2. Verify newsletter status is SENT
3. Check recipient count matches active subscribers
4. Look for bounce events in stats
5. Ask subscriber to check spam folder
6. Verify Resend sending quota not exceeded

### "Already sent" error
**Problem:** Trying to resend sent newsletter
**Solution:**
- Cannot resend sent newsletters
- Duplicate the newsletter to create new draft
- Edit and send as new newsletter

---

## Need Help?

### Support Resources
- **Technical Support:** support@pepe-dome.de
- **Resend Dashboard:** https://resend.com/dashboard (for delivery logs)
- **Privacy Policy:** https://pepe-dome.de/privacy

### Common Questions
**Q: How often should I send newsletters?**
A: Monthly is recommended. Avoid more than 2x per month.

**Q: Can I edit a sent newsletter?**
A: No, sent newsletters cannot be edited. You can send a correction or updated version.

**Q: What if someone wants their data deleted?**
A: Use the unsubscribe link, then contact admin to request full data deletion.

**Q: Can I import subscribers from another system?**
A: Not recommended without verified consent. Use signup forms instead.

**Q: How do I know if my newsletter is spam?**
A: Test at mail-tester.com. Aim for score of 8+/10.

---

## Checklist Before Sending

Use this checklist before every send:

- [ ] Subject line is compelling and under 60 characters
- [ ] Preheader text is engaging
- [ ] Hero image uploaded and displays correctly
- [ ] 3-5 content items selected and ordered
- [ ] Section headings are clear
- [ ] All links tested and working
- [ ] Previewed in browser (desktop and mobile)
- [ ] Test email sent and reviewed
- [ ] Recipient count is correct
- [ ] Scheduled for optimal send time
- [ ] Unsubscribe link present in footer

**Ready to send?** You're good to go! 🚀

---

**Happy Newslettering! 📧**

*The PEPE Dome Team*
