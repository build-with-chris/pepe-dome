-- AlterTable: Event — add nullable English translation columns
ALTER TABLE "events"
  ADD COLUMN "title_en"       TEXT,
  ADD COLUMN "subtitle_en"    TEXT,
  ADD COLUMN "description_en" TEXT,
  ADD COLUMN "location_en"    TEXT,
  ADD COLUMN "price_en"       TEXT,
  ADD COLUMN "highlights_en"  JSONB;

-- AlterTable: Article — add nullable English translation columns
ALTER TABLE "articles"
  ADD COLUMN "title_en"   TEXT,
  ADD COLUMN "excerpt_en" TEXT,
  ADD COLUMN "content_en" TEXT;
