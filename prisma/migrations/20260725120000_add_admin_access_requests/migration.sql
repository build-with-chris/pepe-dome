-- CreateEnum
CREATE TYPE "AdminAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "admin_access_requests" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "AdminAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "token_expires" TIMESTAMP(3) NOT NULL,
    "granted_role" TEXT,
    "decided_at" TIMESTAMP(3),
    "decided_by" TEXT,
    "notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_access_requests_clerk_user_id_key" ON "admin_access_requests"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_access_requests_token_key" ON "admin_access_requests"("token");

-- CreateIndex
CREATE INDEX "admin_access_requests_status_idx" ON "admin_access_requests"("status");

-- CreateIndex
CREATE INDEX "admin_access_requests_email_idx" ON "admin_access_requests"("email");
