-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('MIETE', 'ANGEBOT');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ENTWURF', 'VERSCHICKT', 'UNTERSCHRIEBEN', 'BEZAHLT');

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "type" "ContractType" NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'ENTWURF',
    "title" TEXT NOT NULL,
    "partner_name" TEXT NOT NULL,
    "partner_email" TEXT,
    "partner_phone" TEXT,
    "partner_address" TEXT,
    "event_date" DATE,
    "data" JSONB NOT NULL,
    "snapshot" JSONB,
    "sent_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contracts_type_created_at_idx" ON "contracts"("type", "created_at");

