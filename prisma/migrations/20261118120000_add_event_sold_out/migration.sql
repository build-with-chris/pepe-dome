-- AlterTable
-- IF NOT EXISTS: siehe 20261107120000_add_newsletter_content_show_image.
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "sold_out" BOOLEAN NOT NULL DEFAULT false;
