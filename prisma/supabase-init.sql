-- Pepe Dome – Tabellen & Enums für Supabase (einmalig im SQL-Editor ausführen)
-- Entspricht dem Prisma-Schema inkl. aller Migrationen.

-- Enums
CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED');
CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT');
CREATE TYPE "ContentType" AS ENUM ('EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION');
CREATE TYPE "EventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'UNSUBSCRIBED');
CREATE TYPE "EventCategory" AS ENUM ('SHOW', 'PREMIERE', 'FESTIVAL', 'WORKSHOP', 'OPEN_TRAINING', 'KINDERTRAINING', 'BUSINESS', 'OPEN_AIR', 'EVENT');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "RecurrencePattern" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- Tabellen
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING',
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

CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "hero_image_url" TEXT,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "hero_cta_label" TEXT,
    "hero_cta_url" TEXT,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'DRAFT',
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

CREATE TABLE "newsletter_content" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "content_id" TEXT,
    "section_heading" TEXT,
    "section_description" TEXT,
    "order_position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "newsletter_stats" (
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

CREATE TABLE "newsletter_events" (
    "id" TEXT NOT NULL,
    "newsletter_id" TEXT,
    "subscriber_id" TEXT,
    "event_type" "EventType" NOT NULL,
    "event_data" JSONB NOT NULL DEFAULT '{}',
    "resend_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "test_recipients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_recipients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "time" TEXT,
    "location" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "ticket_url" TEXT,
    "price" TEXT,
    "image_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recurrence" "RecurrencePattern",
    "recurrence_end" TIMESTAMP(3),
    "parent_event_id" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "articles" (
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
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "article_events" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_events_pkey" PRIMARY KEY ("id")
);

-- Unique Constraints & Indizes
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
CREATE UNIQUE INDEX "subscribers_double_opt_in_token_key" ON "subscribers"("double_opt_in_token");
CREATE INDEX "subscribers_email_idx" ON "subscribers"("email");
CREATE INDEX "subscribers_status_idx" ON "subscribers"("status");
CREATE INDEX "subscribers_interests_idx" ON "subscribers"("interests");

CREATE UNIQUE INDEX "newsletters_slug_key" ON "newsletters"("slug");
CREATE INDEX "newsletters_status_idx" ON "newsletters"("status");
CREATE INDEX "newsletters_slug_idx" ON "newsletters"("slug");
CREATE INDEX "newsletters_scheduled_at_idx" ON "newsletters"("scheduled_at");

CREATE INDEX "newsletter_content_newsletter_id_idx" ON "newsletter_content"("newsletter_id");
CREATE INDEX "newsletter_content_newsletter_id_order_position_idx" ON "newsletter_content"("newsletter_id", "order_position");

CREATE UNIQUE INDEX "newsletter_stats_newsletter_id_key" ON "newsletter_stats"("newsletter_id");
CREATE INDEX "newsletter_events_newsletter_id_idx" ON "newsletter_events"("newsletter_id");
CREATE INDEX "newsletter_events_subscriber_id_idx" ON "newsletter_events"("subscriber_id");
CREATE INDEX "newsletter_events_event_type_idx" ON "newsletter_events"("event_type");
CREATE INDEX "newsletter_events_created_at_idx" ON "newsletter_events"("created_at");

CREATE UNIQUE INDEX "test_recipients_email_key" ON "test_recipients"("email");

CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE INDEX "events_slug_idx" ON "events"("slug");
CREATE INDEX "events_date_idx" ON "events"("date");
CREATE INDEX "events_category_idx" ON "events"("category");
CREATE INDEX "events_status_idx" ON "events"("status");
CREATE INDEX "events_featured_idx" ON "events"("featured");

CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_slug_idx" ON "articles"("slug");
CREATE INDEX "articles_category_idx" ON "articles"("category");
CREATE INDEX "articles_status_idx" ON "articles"("status");
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at");
CREATE INDEX "articles_featured_idx" ON "articles"("featured");

CREATE UNIQUE INDEX "article_events_article_id_event_id_key" ON "article_events"("article_id", "event_id");

-- Foreign Keys
ALTER TABLE "newsletter_content" ADD CONSTRAINT "newsletter_content_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_stats" ADD CONSTRAINT "newsletter_stats_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_parent_event_id_fkey" FOREIGN KEY ("parent_event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "article_events" ADD CONSTRAINT "article_events_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_events" ADD CONSTRAINT "article_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
