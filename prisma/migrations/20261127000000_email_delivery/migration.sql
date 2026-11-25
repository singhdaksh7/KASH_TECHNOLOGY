-- Additive only: new tables + one nullable column. Existing data untouched.
ALTER TABLE "public"."Lead" ADD COLUMN "budget" TEXT;

CREATE TYPE "public"."EmailDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "public"."EmailSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "provider" TEXT NOT NULL DEFAULT 'resend',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "sendVisitorConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "sendInternalNotification" BOOLEAN NOT NULL DEFAULT true,
    "fromName" TEXT,
    "fromEmail" TEXT,
    "replyToEmail" TEXT,
    "internalRecipient" TEXT,
    "visitorReplyEmail" TEXT,
    "testRecipient" TEXT,
    "encryptedApiKey" TEXT,
    "apiKeyLast4" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmailSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."EmailDelivery" (
    "id" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'resend',
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "status" "public"."EmailDeliveryStatus" NOT NULL DEFAULT 'QUEUED',
    "providerMessageId" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "dedupeKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmailDelivery_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EmailDelivery_dedupeKey_key" ON "public"."EmailDelivery"("dedupeKey");
CREATE INDEX "EmailDelivery_entityType_entityId_idx" ON "public"."EmailDelivery"("entityType", "entityId");
CREATE INDEX "EmailDelivery_status_createdAt_idx" ON "public"."EmailDelivery"("status", "createdAt");
CREATE INDEX "EmailDelivery_createdAt_idx" ON "public"."EmailDelivery"("createdAt");
