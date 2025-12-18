-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'UNSUBSCRIBED');

-- CreateTable
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "test_recipients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_double_opt_in_token_key" ON "subscribers"("double_opt_in_token");

-- CreateIndex
CREATE INDEX "subscribers_email_idx" ON "subscribers"("email");

-- CreateIndex
CREATE INDEX "subscribers_status_idx" ON "subscribers"("status");

-- CreateIndex
CREATE INDEX "subscribers_interests_idx" ON "subscribers"("interests");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_slug_key" ON "newsletters"("slug");

-- CreateIndex
CREATE INDEX "newsletters_status_idx" ON "newsletters"("status");

-- CreateIndex
CREATE INDEX "newsletters_slug_idx" ON "newsletters"("slug");

-- CreateIndex
CREATE INDEX "newsletters_scheduled_at_idx" ON "newsletters"("scheduled_at");

-- CreateIndex
CREATE INDEX "newsletter_content_newsletter_id_idx" ON "newsletter_content"("newsletter_id");

-- CreateIndex
CREATE INDEX "newsletter_content_newsletter_id_order_position_idx" ON "newsletter_content"("newsletter_id", "order_position");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_stats_newsletter_id_key" ON "newsletter_stats"("newsletter_id");

-- CreateIndex
CREATE INDEX "newsletter_events_newsletter_id_idx" ON "newsletter_events"("newsletter_id");

-- CreateIndex
CREATE INDEX "newsletter_events_subscriber_id_idx" ON "newsletter_events"("subscriber_id");

-- CreateIndex
CREATE INDEX "newsletter_events_event_type_idx" ON "newsletter_events"("event_type");

-- CreateIndex
CREATE INDEX "newsletter_events_created_at_idx" ON "newsletter_events"("created_at");

-- AddForeignKey
ALTER TABLE "newsletter_content" ADD CONSTRAINT "newsletter_content_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_stats" ADD CONSTRAINT "newsletter_stats_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_events" ADD CONSTRAINT "newsletter_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
