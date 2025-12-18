# PEPE Dome Newsletter System - Setup Guide

**Version:** 1.0
**Last Updated:** 2025-11-17

---

## Prerequisites

Before setting up the newsletter system, ensure you have:

- **Node.js:** v18.0.0 or higher
- **PostgreSQL:** v14 or higher
- **npm or yarn:** Latest version
- **Resend Account:** Sign up at https://resend.com
- **Domain Access:** For email sending verification

---

## Environment Variables

The newsletter system requires several environment variables to function correctly. All required variables are documented below.

### Required Variables

#### 1. DATABASE_URL
**Purpose:** PostgreSQL database connection string
**Format:** `postgresql://user:password@host:port/database?schema=public`

**Examples:**
```bash
# Local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/pepe_dome?schema=public"

# Neon (recommended for production)
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/pepe_dome?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.project-id.supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"
```

**Setup:**
1. Create PostgreSQL database
2. Copy connection string
3. Add to `.env.local` or Vercel environment variables

---

#### 2. RESEND_API_KEY
**Purpose:** Resend API key for sending emails
**Format:** `re_xxxxxxxxxxxxxxxx`

**Setup:**
1. Log in to Resend dashboard: https://resend.com/dashboard
2. Navigate to **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "PEPE Dome Production")
5. Copy the key (starts with `re_`)
6. Add to environment variables

**Example:**
```bash
RESEND_API_KEY="re_123456789abcdefghijklmnop"
```

**Note:** Keep this secret! Never commit to Git.

---

#### 3. RESEND_FROM_EMAIL
**Purpose:** Default sender email address for newsletters
**Format:** `"Display Name <email@domain.com>"`

**Setup:**
1. Verify your domain in Resend dashboard
   - Go to **Domains** → **Add Domain**
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually 5-10 minutes)
2. Choose sender email (e.g., `newsletter@pepe-dome.de`)
3. Add to environment variables

**Examples:**
```bash
RESEND_FROM_EMAIL="PEPE Dome <newsletter@pepe-dome.de>"
RESEND_FROM_EMAIL="PEPE Dome Newsletter <hello@pepe-dome.de>"
```

**Best Practices:**
- Use subdomain (e.g., `newsletter@`) for better deliverability
- Use recognizable display name
- Avoid no-reply@ (decreases engagement)

---

#### 4. NEXT_PUBLIC_BASE_URL
**Purpose:** Base URL for email links (confirmation, unsubscribe, web view)
**Format:** `https://domain.com` (no trailing slash)

**Setup:**
```bash
# Development
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Production
NEXT_PUBLIC_BASE_URL="https://pepe-dome.de"
```

**Note:** Must be `NEXT_PUBLIC_` prefix to be available in browser

---

### Optional Variables

#### 5. RESEND_WEBHOOK_SECRET
**Purpose:** Webhook signature verification secret
**Format:** `whsec_xxxxxxxxxxxxxxxx`

**Setup:**
1. Log in to Resend dashboard
2. Navigate to **Webhooks**
3. Click **Add Endpoint**
4. Enter webhook URL: `https://pepe-dome.de/api/webhooks/resend`
5. Select events: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`
6. Copy the signing secret (starts with `whsec_`)
7. Add to environment variables

**Example:**
```bash
RESEND_WEBHOOK_SECRET="whsec_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
```

**Note:** If not set, webhook signature verification is skipped (dev mode only)

---

#### 6. NODE_ENV
**Purpose:** Application environment mode
**Values:** `development`, `production`, `test`

**Setup:**
```bash
# Development
NODE_ENV="development"

# Production (automatically set by Vercel)
NODE_ENV="production"
```

---

#### 7. CRON_SECRET
**Purpose:** Secret token for securing cron job endpoints
**Format:** Random string (generate with: `openssl rand -hex 32`)

**Setup:**
```bash
CRON_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

**Usage:** Include in cron job URL or Authorization header

---

#### 8. File Storage (S3 - Future Enhancement)
**Purpose:** Store uploaded hero images (not implemented in v1)

```bash
S3_BUCKET="pepedome-newsletter-images"
S3_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

**Note:** v1 uses URLs only. Implement S3 upload in future version.

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/pepedome/pepe-dome.git
cd pepe-dome
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```bash
# Required
DATABASE_URL="postgresql://..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="PEPE Dome <newsletter@pepe-dome.de>"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional
RESEND_WEBHOOK_SECRET="whsec_..."
NODE_ENV="development"
CRON_SECRET="your-secret"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed test data
npx prisma db seed
```

### 5. Verify Resend Setup
Test Resend API key:
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "newsletter@pepe-dome.de",
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

Expected response:
```json
{
  "id": "re_123456789",
  "from": "newsletter@pepe-dome.de",
  "to": "test@example.com",
  "created_at": "2025-11-17T10:00:00.000Z"
}
```

### 6. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 7. Test Newsletter System
1. Navigate to homepage
2. Sign up for newsletter
3. Check email for confirmation
4. Confirm subscription
5. Go to `/admin/newsletters` (no auth in dev)
6. Create and send test newsletter

---

## Production Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Project
```bash
vercel link
```

### 4. Add Environment Variables
```bash
# Required
vercel env add DATABASE_URL production
vercel env add RESEND_API_KEY production
vercel env add RESEND_FROM_EMAIL production
vercel env add NEXT_PUBLIC_BASE_URL production

# Optional
vercel env add RESEND_WEBHOOK_SECRET production
vercel env add CRON_SECRET production
```

Or add via Vercel dashboard:
1. Go to project settings
2. Click **Environment Variables**
3. Add each variable

### 5. Deploy
```bash
vercel --prod
```

### 6. Setup Resend Webhook
1. Get production URL (e.g., `https://pepe-dome.de`)
2. In Resend dashboard, add webhook:
   - URL: `https://pepe-dome.de/api/webhooks/resend`
   - Events: All email events
   - Copy signing secret
3. Add `RESEND_WEBHOOK_SECRET` to Vercel environment variables
4. Redeploy: `vercel --prod`

### 7. Setup Cron Job for Scheduled Sends
**Option A: Vercel Cron (Recommended)**
1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/jobs/send-scheduled",
    "schedule": "*/5 * * * *"
  }]
}
```

**Option B: External Cron Service**
1. Use cron-job.org or EasyCron
2. Add job: `https://pepe-dome.de/api/jobs/send-scheduled`
3. Schedule: Every 5 minutes
4. Add Authorization header: `Bearer {CRON_SECRET}`

### 8. Verify Production Setup
1. Sign up for newsletter (production)
2. Confirm subscription
3. Create test newsletter
4. Send test email
5. Check stats update after opening email

---

## Troubleshooting

### Database Connection Error
**Symptom:** `Can't reach database server`
**Solutions:**
- Verify DATABASE_URL is correct
- Check database is running
- Ensure network allows connection
- For Neon/Supabase, check IP whitelist

### Resend API Error
**Symptom:** `401 Unauthorized` or `Invalid API key`
**Solutions:**
- Verify RESEND_API_KEY is correct (starts with `re_`)
- Check API key is active in Resend dashboard
- Ensure no extra whitespace in .env file

### Domain Not Verified
**Symptom:** Emails not sending, "Domain not verified" error
**Solutions:**
- Complete domain verification in Resend dashboard
- Add DNS records (SPF, DKIM, DMARC)
- Wait 5-10 minutes for DNS propagation
- Use Resend's test mode for development (no domain verification needed)

### Webhook Not Working
**Symptom:** Stats not updating, no webhook events
**Solutions:**
- Verify webhook URL is publicly accessible (not localhost)
- Check RESEND_WEBHOOK_SECRET is set correctly
- Review server logs for webhook errors
- Test with Resend webhook simulator

### Emails in Spam
**Symptom:** Test emails land in spam folder
**Solutions:**
- Complete domain verification (SPF, DKIM, DMARC)
- Use mail-tester.com to check spam score
- Avoid spam trigger words in subject
- Ensure proper unsubscribe link in footer
- Warm up domain gradually (don't send 1000s immediately)

### Migration Errors
**Symptom:** `Prisma migration failed`
**Solutions:**
- Ensure database is empty or backup first
- Run: `npx prisma migrate reset` (WARNING: deletes all data)
- Check PostgreSQL version (need v14+)
- Verify database user has CREATE permissions

---

## Security Checklist

Before going to production, ensure:

- [ ] All environment variables set in Vercel
- [ ] DATABASE_URL uses SSL (add `?sslmode=require`)
- [ ] RESEND_API_KEY is kept secret (not in Git)
- [ ] RESEND_WEBHOOK_SECRET is configured
- [ ] Admin authentication implemented (CRITICAL)
- [ ] CRON_SECRET is set and used in cron jobs
- [ ] Rate limiting is enabled on signup endpoint
- [ ] Domain is verified in Resend
- [ ] Privacy policy is up-to-date
- [ ] GDPR compliance verified

---

## Performance Optimization

### Database
- Ensure indexes are created (automatic with Prisma migrations)
- Use connection pooling (built into Prisma)
- Monitor slow queries with Prisma logging

### Email Sending
- Batch size: 50 (configured in code)
- Delay between batches: 1 second (configured in code)
- For large lists (1000+), consider dedicated worker

### Caching
- Static pages cached at CDN (Vercel edge)
- Newsletter archive uses ISR (revalidate: 3600)
- API routes cached where appropriate

---

## Monitoring & Logging

### Recommended Tools
- **Vercel Analytics:** Page views, performance
- **Sentry:** Error tracking
- **Prisma Pulse:** Database monitoring
- **Resend Dashboard:** Email delivery logs

### Key Metrics
- Subscriber growth rate
- Newsletter send success rate
- Open/click rates
- Bounce/complaint rates
- API response times

---

## Backup & Recovery

### Database Backups
**Neon:** Automatic daily backups (7-day retention)
**Supabase:** Automatic daily backups
**Self-hosted:** Use pg_dump

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Subscriber Export
Regular CSV exports via admin panel:
1. Go to `/admin/subscribers`
2. Click **"Export CSV"**
3. Store securely (contains PII)

---

## Support

### Documentation
- **Admin Guide:** `/docs/admin-newsletter-guide.md`
- **Developer Docs:** `/docs/newsletter-system.md`
- **API Reference:** Included in developer docs

### External Resources
- **Resend Docs:** https://resend.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

### Contact
- **Technical Support:** support@pepe-dome.de
- **Resend Support:** https://resend.com/support

---

## Next Steps

After setup:
1. ✅ Complete environment variable configuration
2. ✅ Run database migrations
3. ✅ Verify Resend integration
4. ✅ Test full subscriber journey
5. ✅ Send test newsletter
6. ✅ Configure webhook
7. ✅ Setup cron job
8. ✅ Deploy to production
9. ✅ Verify production setup
10. ⚠️ **IMPLEMENT ADMIN AUTHENTICATION** (critical before launch)

---

**Ready to launch!** 🚀
