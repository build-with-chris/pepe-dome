-- CreateEnum
CREATE TYPE "course_target" AS ENUM ('kinder', 'teens', 'erwachsene');

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub" TEXT,
    "description" TEXT NOT NULL,
    "inhalte" JSONB NOT NULL DEFAULT '[]',
    "alter" TEXT,
    "fuer_wen" TEXT NOT NULL,
    "target" "course_target" NOT NULL,
    "trainer" TEXT NOT NULL,
    "booking_url" TEXT,
    "booking_label" TEXT,
    "booking_note" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_slots" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "course_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_notes" (
    "weekday" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_notes_pkey" PRIMARY KEY ("weekday")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_slug_idx" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "courses_target_idx" ON "courses"("target");

-- CreateIndex
CREATE INDEX "course_slots_course_id_idx" ON "course_slots"("course_id");

-- CreateIndex
CREATE INDEX "course_slots_weekday_idx" ON "course_slots"("weekday");

-- AddForeignKey
ALTER TABLE "course_slots" ADD CONSTRAINT "course_slots_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

