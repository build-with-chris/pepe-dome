# PEPE Dome Newsletter System - Deployment Checklist

**Version:** 1.0
**Last Updated:** 2025-11-17

---

## Pre-Deployment Checklist

### Code & Testing
- [ ] All feature tests passing (57-78 tests)
- [ ] Integration tests completed successfully
- [ ] Manual test plans executed (see `/docs/testing/manual-test-plans.md`)
- [ ] Code review completed
- [ ] No console.log statements in production code
- [ ] Error handling tested
- [ ] Edge cases handled

### Security & Compliance
- [ ] **CRITICAL:** Admin authentication implemented
- [ ] Webhook signature verification using HMAC-SHA256
- [ ] Rate limiting verified on signup endpoint (5/hour per IP)
- [ ] CSRF protection implemented on admin forms
- [ ] Input validation with Zod on all API endpoints
- [ ] SQL injection protected (Prisma handles this)
- [ ] XSS protection verified (React handles this)
- [ ] GDPR compliance verified (see audit report)
- [ ] Privacy policy updated with:
  - Newsletter processing purpose
  - Data retention policy
  - Third-party processors (Resend)
  - Subscriber rights (access, deletion, portability)
- [ ] Legal footer in emails includes:
  - Company name and address
  - Unsubscribe link
  - Privacy policy link

### Database
- [ ] PostgreSQL v14+ provisioned
- [ ] Database connection string secured
- [ ] SSL/TLS enabled (`?sslmode=require` in DATABASE_URL)
- [ ] Connection pooling configured
- [ ] Backups enabled (automatic daily backups)
- [ ] Migrations tested on staging
- [ ] Indexes verified (automatic with Prisma)

### Resend Configuration
- [ ] Resend account created
- [ ] Domain added and verified in Resend dashboard
  - [ ] SPF record added to DNS
  - [ ] DKIM record added to DNS
  - [ ] DMARC record added to DNS
  - [ ] Verification status: ✅ Verified
- [ ] API key created and copied
- [ ] From email configured (e.g., `newsletter@pepe-dome.de`)
- [ ] Webhook endpoint configured:
  - URL: `https://pepe-dome.de/api/webhooks/resend`
  - Events selected: All (sent, delivered, opened, clicked, bounced, complained)
  - Signing secret copied
- [ ] Test email sent successfully
- [ ] Deliverability tested (mail-tester.com score 8+/10)
- [ ] Emails tested in multiple clients:
  - [ ] Gmail (desktop & mobile)
  - [ ] Outlook (desktop & mobile)
  - [ ] Apple Mail (desktop & mobile)
- [ ] Dark mode tested in iOS Mail and Outlook

### Environment Variables
- [ ] All required variables set in production:
  - [ ] `DATABASE_URL`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`
  - [ ] `NEXT_PUBLIC_BASE_URL`
  - [ ] `RESEND_WEBHOOK_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `CRON_SECRET`
- [ ] No secrets committed to Git
- [ ] `.env.example` up to date
- [ ] Environment variables documented in `/docs/setup.md`

### Email Templates
- [ ] All email templates render correctly
- [ ] Hero images display properly
- [ ] Unsubscribe link present in all newsletters
- [ ] Footer includes company address and legal info
- [ ] Links tested (confirmation, unsubscribe, events, articles)
- [ ] Mobile responsive (single-column layout)
- [ ] Text size readable (16px+ body text)
- [ ] Touch targets adequate (44px+ buttons)
- [ ] Dark mode rendering acceptable

### Admin UI
- [ ] Newsletter dashboard displays correctly
- [ ] Create newsletter flow works end-to-end
- [ ] Content selection and reordering functional
- [ ] Hero image upload works
- [ ] Preview renders correctly
- [ ] Test send works
- [ ] Schedule functionality tested
- [ ] Send now functionality tested
- [ ] Stats display correctly after webhooks
- [ ] Subscriber management works
- [ ] CSV export functional

### Public Pages
- [ ] Newsletter signup forms on all pages:
  - [ ] Homepage hero
  - [ ] Global footer
  - [ ] Event pages (end-of-content)
  - [ ] Article pages (end-of-content)
  - [ ] `/newsletter` page (extended form)
- [ ] Confirmation success page (`/newsletter/confirm`)
- [ ] Unsubscribe confirmation page (`/newsletter/unsubscribed`)
- [ ] Newsletter archive index (`/newsletter`)
- [ ] Individual newsletter pages (`/newsletter/[slug]`)
- [ ] SEO meta tags present and unique per page
- [ ] Open Graph images configured
- [ ] Canonical URLs set
- [ ] Static generation working
- [ ] DotCloud animations on all pages:
  - [ ] Homepage (Subject 1, large, hero)
  - [ ] Events page (Subject 5, medium, intro)
  - [ ] News page (Subject 3, small, intro)
  - [ ] Newsletter archive (Subject 2/4, medium, intro)
  - [ ] About page (Subject 1/6, large, behind text)

### Performance
- [ ] DotCloud animations GPU-accelerated (CSS transforms only)
- [ ] No layout shift issues (CLS < 0.1)
- [ ] Page load times < 2 seconds
- [ ] Lighthouse scores:
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
- [ ] Database queries optimized with indexes
- [ ] Batch sending tested with 100+ subscribers
- [ ] Mobile performance tested (6x CPU throttling)

### Monitoring & Logging
- [ ] Error tracking configured (Sentry or similar)
- [ ] Logging set up for:
  - [ ] Email send attempts
  - [ ] Webhook event processing
  - [ ] API errors
  - [ ] Authentication failures
- [ ] Alerts configured for:
  - [ ] High bounce rate (> 5%)
  - [ ] High complaint rate (> 0.5%)
  - [ ] Failed webhook processing
  - [ ] Database connection issues
  - [ ] Cron job failures

---

## Deployment Steps

### 1. Pre-Deploy Verification
- [ ] All checklist items above completed
- [ ] Staging environment tested successfully
- [ ] Team notified of deployment window
- [ ] Rollback plan prepared

### 2. Database Migration
```bash
# Backup production database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Run migrations
npx prisma migrate deploy

# Verify migrations
npx prisma migrate status
```

### 3. Deploy to Vercel
```bash
# Build and deploy
vercel --prod

# Or via Git push (if connected)
git push origin main
```

### 4. Post-Deploy Verification
- [ ] Homepage loads without errors
- [ ] Newsletter signup form works
- [ ] Confirmation email arrives
- [ ] Admin dashboard accessible
- [ ] Create test newsletter
- [ ] Send test email
- [ ] Webhook endpoint receiving events
- [ ] Stats updating correctly

### 5. Configure Cron Job

**Option A: Vercel Cron (Recommended)**
- [ ] `vercel.json` committed with cron configuration
- [ ] Cron job appears in Vercel dashboard
- [ ] Test scheduled newsletter (schedule for 5 minutes ahead)
- [ ] Verify send executes at scheduled time

**Option B: External Cron Service**
- [ ] Create cron job at cron-job.org or EasyCron
- [ ] URL: `https://pepe-dome.de/api/jobs/send-scheduled`
- [ ] Schedule: Every 5 minutes (`*/5 * * * *`)
- [ ] Authorization header: `Bearer {CRON_SECRET}`
- [ ] Test job executes successfully

### 6. Resend Webhook Configuration
- [ ] Webhook URL: `https://pepe-dome.de/api/webhooks/resend`
- [ ] All events selected
- [ ] Signing secret set in Vercel environment variables
- [ ] Test webhook:
  - Send test newsletter
  - Verify webhook events logged
  - Check stats update after opening email

### 7. DNS & Domain
- [ ] Domain pointed to Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] SPF record verified: `v=spf1 include:resend.com ~all`
- [ ] DKIM record verified (from Resend dashboard)
- [ ] DMARC record verified: `v=DMARC1; p=none; rua=mailto:dmarc@pepe-dome.de`

### 8. Final Testing
- [ ] Sign up for newsletter (real email)
- [ ] Confirm subscription
- [ ] Create real newsletter
- [ ] Send to small test group (10-20 subscribers)
- [ ] Monitor delivery
- [ ] Check open/click tracking
- [ ] Test unsubscribe
- [ ] Verify all stats update

---

## Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Monitor error logs for first 24 hours
- [ ] Check email deliverability
- [ ] Verify webhook events processing
- [ ] Confirm cron job executed
- [ ] Test all critical user flows
- [ ] Check performance metrics

### Week 1
- [ ] Review subscriber growth
- [ ] Check bounce/complaint rates
- [ ] Monitor database performance
- [ ] Verify backup jobs running
- [ ] Send first real newsletter
- [ ] Analyze engagement metrics

### Month 1
- [ ] Generate subscriber analytics report
- [ ] Review open/click rates (compare to benchmarks)
- [ ] Check system performance and optimization needs
- [ ] Gather user feedback
- [ ] Plan v2 features

---

## Rollback Plan

If critical issues occur:

### 1. Immediate Rollback
```bash
# Revert to previous deployment
vercel rollback
```

### 2. Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup_YYYYMMDD.sql

# Or use database provider's restore feature
```

### 3. Communication
- [ ] Notify team of rollback
- [ ] Update status page
- [ ] Communicate to users if necessary

---

## Known Issues & Limitations

Document any known issues to watch:

- [ ] Admin authentication not implemented (CRITICAL - must fix)
- [ ] Hero image upload endpoint deferred (uses URLs only for v1)
- [ ] Recurring scheduling not supported (one-time only)
- [ ] Data deletion functionality partial (no subscriber-facing deletion)
- [ ] Webhook signature verification uses simple comparison (needs HMAC)

---

## Contact & Support

### Deployment Team
- **Technical Lead:** [Name]
- **DevOps:** [Name]
- **QA:** [Name]

### External Support
- **Vercel Support:** https://vercel.com/support
- **Resend Support:** https://resend.com/support
- **Database Provider:** [Support link]

---

## Sign-Off

### Pre-Deployment Approval
- [ ] **Technical Lead:** _________________ Date: _______
- [ ] **Product Owner:** _________________ Date: _______
- [ ] **Security Review:** _________________ Date: _______

### Deployment Completion
- [ ] **Deployed By:** _________________ Date: _______
- [ ] **Verified By:** _________________ Date: _______

---

## Post-Deployment Notes

_Add any observations, issues encountered, or lessons learned:_

---

## Deployment History

| Version | Date | Deployed By | Notes |
|---------|------|-------------|-------|
| 1.0.0 | 2025-11-__ | [Name] | Initial production deployment |

---

## Next Release Planning

### v1.1 - Critical Fixes (Target: 2 weeks)
- [ ] Implement admin authentication (CRITICAL)
- [ ] Fix webhook signature verification (HMAC-SHA256)
- [ ] Add data deletion endpoint
- [ ] Document retention policy

### v1.2 - Enhancements (Target: 1 month)
- [ ] Hero image upload endpoint (S3)
- [ ] Improved dark mode support
- [ ] CSRF protection
- [ ] Rate limiting on all admin endpoints

### v2.0 - Major Features (Target: 3 months)
- [ ] A/B testing for subject lines
- [ ] Recurring scheduled sends
- [ ] Advanced subscriber segmentation
- [ ] In-browser image cropping
- [ ] Newsletter archive search

---

**Deployment Status:** ⏸️ NOT READY

**Blocking Issues:**
1. ❌ Admin authentication not implemented
2. ⚠️ Weak webhook signature verification
3. ⚠️ Rate limiting not verified

**Ready for deployment once blocking issues resolved.**

---

_This checklist should be reviewed and updated after each deployment._
