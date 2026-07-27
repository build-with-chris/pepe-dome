-- Contentplan: Reels und die eine Zeile Einstellungen dazu.
--
-- Rein additiv. Keine bestehende Tabelle wird angefasst, insbesondere nicht
-- "event_distributions" — die Zeilen darin sind die Belege dafür, welches Event
-- auf welchem Kanal schon steht, und ein Verlust wäre nicht rekonstruierbar.
--
-- "content_plan_config" hat eine feste Id 1. Das ist der einfachste Weg, eine
-- zweite Zeile auszuschließen: Ein zweiter Insert ohne Id läuft in den
-- Primärschlüssel. Ein Trigger dafür wäre mehr Maschinerie als Nutzen.

-- CreateEnum
CREATE TYPE "public"."reel_status" AS ENUM ('PLANNED', 'FILMED', 'EDITED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "public"."content_reels" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "artist" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "status" "public"."reel_status" NOT NULL DEFAULT 'PLANNED',
    "shoot_date" TIMESTAMP(3),
    "edited_at" TIMESTAMP(3),
    "planned_for" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "shares_48h" INTEGER,
    "saves_48h" INTEGER,
    "shares_72h" INTEGER,
    "saves_72h" INTEGER,
    "budget_released_at" TIMESTAMP(3),
    "spend_cents" INTEGER,
    "results" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_reels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_plan_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "baseline_median" INTEGER,
    "threshold" INTEGER,
    "fixed_at" TIMESTAMP(3),
    "prior_median" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_plan_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_reels_position_key" ON "public"."content_reels"("position");

-- CreateIndex
CREATE INDEX "content_reels_status_idx" ON "public"."content_reels"("status");

-- CreateIndex
CREATE INDEX "content_reels_planned_for_idx" ON "public"."content_reels"("planned_for");
