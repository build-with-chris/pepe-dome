-- Baseline: der Stand, den die Produktions-Datenbank am 25.07.2026 hatte.
--
-- Die Datenbank war ueber `db push` bzw. von Hand entstanden, nicht ueber
-- Migrationen. Es gab deshalb keine `_prisma_migrations`-Tabelle, und Prisma
-- hielt saemtliche Migrationen fuer ausstehend: ein `migrate deploy` waere
-- beim ersten `CREATE TABLE` mit "already exists" abgebrochen.
--
-- Diese Datei ist mit `prisma migrate diff --from-empty --to-url <prod>` aus
-- der laufenden Datenbank erzeugt und in der Produktion per
-- `prisma migrate resolve --applied 0_init` als bereits angewendet vermerkt.
-- Sie ersetzt die drei fruehen Migrationen (init_newsletter_system,
-- add_events_articles, add_newsletter_intro_text), die denselben Stand in
-- Etappen aufgebaut haben und deshalb geloescht wurden.
--
-- Alles ab hier laeuft wieder normal ueber `prisma migrate dev` /
-- `migrate deploy`. Eine leere Datenbank ergibt mit dieser Datei plus den
-- nachfolgenden Migrationen denselben Stand wie die Produktion.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION');

-- CreateEnum
CREATE TYPE "public"."EventCategory" AS ENUM ('SHOW', 'PREMIERE', 'FESTIVAL', 'WORKSHOP', 'OPEN_TRAINING', 'KINDERTRAINING', 'BUSINESS', 'OPEN_AIR', 'EVENT');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "public"."NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT');

-- CreateEnum
CREATE TYPE "public"."RecurrencePattern" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "public"."distribution_channel" AS ENUM ('eventbrite', 'facebook_page', 'instagram_business', 'google_business_profile', 'rausgegangen_feed', 'jsonld_website');

-- CreateEnum
CREATE TYPE "public"."distribution_status" AS ENUM ('pending', 'success', 'failed', 'skipped');

-- CreateTable
CREATE TABLE "public"."article_events" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "image_url" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_interests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "course_slug" TEXT NOT NULL,
    "course_title" TEXT NOT NULL,
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_distributions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" TEXT NOT NULL,
    "channel" "public"."distribution_channel" NOT NULL,
    "status" "public"."distribution_status" NOT NULL DEFAULT 'pending',
    "external_id" TEXT,
    "external_url" TEXT,
    "error_message" TEXT,
    "attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "time" TEXT,
    "location" TEXT NOT NULL,
    "category" "public"."EventCategory" NOT NULL,
    "ticket_url" TEXT,
    "price" TEXT,
    "image_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recurrence" "public"."RecurrencePattern",
    "recurrence_end" TIMESTAMP(3),
    "parent_event_id" TEXT,
    "translations" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_content" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    "contentType" "public"."ContentType" NOT NULL,
    "content_id" TEXT,
    "section_heading" TEXT,
    "section_description" TEXT,
    "order_position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_events" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT,
    "subscriber_id" TEXT,
    "event_type" "public"."EventType" NOT NULL,
    "event_data" JSONB NOT NULL DEFAULT '{}',
    "resend_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_stats" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "delivered_count" INTEGER NOT NULL DEFAULT 0,
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "unique_open_count" INTEGER NOT NULL DEFAULT 0,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "unique_click_count" INTEGER NOT NULL DEFAULT 0,
    "bounce_count" INTEGER NOT NULL DEFAULT 0,
    "complaint_count" INTEGER NOT NULL DEFAULT 0,
    "unsubscribe_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletters" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "hero_image_url" TEXT,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "hero_cta_label" TEXT,
    "hero_cta_url" TEXT,
    "status" "public"."NewsletterStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intro_text" TEXT,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "status" "public"."SubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "interests" JSONB NOT NULL DEFAULT '[]',
    "double_opt_in_token" TEXT,
    "double_opt_in_sent_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),
    "unsubscribed_at" TIMESTAMP(3),
    "last_open_at" TIMESTAMP(3),
    "last_click_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_recipients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_events_article_id_event_id_key" ON "public"."article_events"("article_id" ASC, "event_id" ASC);

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "public"."articles"("category" ASC);

-- CreateIndex
CREATE INDEX "articles_featured_idx" ON "public"."articles"("featured" ASC);

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "public"."articles"("published_at" ASC);

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "public"."articles"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "public"."articles"("slug" ASC);

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "public"."articles"("status" ASC);

-- CreateIndex
CREATE INDEX "course_interests_course_slug_idx" ON "public"."course_interests"("course_slug" ASC);

-- CreateIndex
CREATE INDEX "course_interests_created_at_idx" ON "public"."course_interests"("created_at" ASC);

-- CreateIndex
CREATE INDEX "course_interests_email_idx" ON "public"."course_interests"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "event_distributions_event_id_channel_key" ON "public"."event_distributions"("event_id" ASC, "channel" ASC);

-- CreateIndex
CREATE INDEX "event_distributions_event_idx" ON "public"."event_distributions"("event_id" ASC);

-- CreateIndex
CREATE INDEX "event_distributions_status_idx" ON "public"."event_distributions"("status" ASC);

-- CreateIndex
CREATE INDEX "events_category_idx" ON "public"."events"("category" ASC);

-- CreateIndex
CREATE INDEX "events_date_idx" ON "public"."events"("date" ASC);

-- CreateIndex
CREATE INDEX "events_featured_idx" ON "public"."events"("featured" ASC);

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "public"."events"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "public"."events"("slug" ASC);

-- CreateIndex
CREATE INDEX "events_status_idx" ON "public"."events"("status" ASC);

-- CreateIndex
CREATE INDEX "newsletter_content_newsletter_id_idx" ON "public"."newsletter_content"("newsletter_id" ASC);

-- CreateIndex
CREATE INDEX "newsletter_content_newsletter_id_order_position_idx" ON "public"."newsletter_content"("newsletter_id" ASC, "order_position" ASC);

-- CreateIndex
CREATE INDEX "newsletter_events_created_at_idx" ON "public"."newsletter_events"("created_at" ASC);

-- CreateIndex
CREATE INDEX "newsletter_events_event_type_idx" ON "public"."newsletter_events"("event_type" ASC);

-- CreateIndex
CREATE INDEX "newsletter_events_newsletter_id_idx" ON "public"."newsletter_events"("newsletter_id" ASC);

-- CreateIndex
CREATE INDEX "newsletter_events_resend_event_id_idx" ON "public"."newsletter_events"("resend_event_id" ASC);

-- CreateIndex
CREATE INDEX "newsletter_events_subscriber_id_idx" ON "public"."newsletter_events"("subscriber_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_stats_newsletter_id_key" ON "public"."newsletter_stats"("newsletter_id" ASC);

-- CreateIndex
CREATE INDEX "newsletters_scheduled_at_idx" ON "public"."newsletters"("scheduled_at" ASC);

-- CreateIndex
CREATE INDEX "newsletters_slug_idx" ON "public"."newsletters"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_slug_key" ON "public"."newsletters"("slug" ASC);

-- CreateIndex
CREATE INDEX "newsletters_status_idx" ON "public"."newsletters"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_double_opt_in_token_key" ON "public"."subscribers"("double_opt_in_token" ASC);

-- CreateIndex
CREATE INDEX "subscribers_email_idx" ON "public"."subscribers"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "public"."subscribers"("email" ASC);

-- CreateIndex
CREATE INDEX "subscribers_interests_idx" ON "public"."subscribers"("interests" ASC);

-- CreateIndex
CREATE INDEX "subscribers_status_idx" ON "public"."subscribers"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "test_recipients_email_key" ON "public"."test_recipients"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."article_events" ADD CONSTRAINT "article_events_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_events" ADD CONSTRAINT "article_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_distributions" ADD CONSTRAINT "event_distributions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_parent_event_id_fkey" FOREIGN KEY ("parent_event_id") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."newsletter_content" ADD CONSTRAINT "newsletter_content_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."newsletter_events" ADD CONSTRAINT "newsletter_events_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."newsletter_events" ADD CONSTRAINT "newsletter_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."newsletter_stats" ADD CONSTRAINT "newsletter_stats_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

