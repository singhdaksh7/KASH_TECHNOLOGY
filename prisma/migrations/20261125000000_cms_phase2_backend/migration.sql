-- CreateEnum
CREATE TYPE "public"."LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('NEW_LEAD', 'PAGE_REVIEW', 'PAGE_CHANGES_REQUESTED', 'PAGE_APPROVED', 'PAGE_SCHEDULED', 'PAGE_PUBLISHED', 'PAGE_PUBLISH_FAILED', 'PAGE_UNPUBLISHED', 'FORM_SUBMISSION', 'TASK_ASSIGNED', 'LEAD_ASSIGNED', 'SEO_WARNING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."TaskRelationType" AS ENUM ('LEAD', 'PAGE', 'ARTICLE', 'PORTFOLIO');

-- CreateEnum
CREATE TYPE "public"."TemplateCategory" AS ENUM ('BLANK', 'SERVICE', 'LANDING_PAGE', 'PORTFOLIO', 'LOCATION', 'CAMPAIGN', 'ABOUT', 'CONTACT', 'CUSTOM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PageStatus" ADD VALUE 'IN_REVIEW';
ALTER TYPE "public"."PageStatus" ADD VALUE 'CHANGES_REQUESTED';
ALTER TYPE "public"."PageStatus" ADD VALUE 'APPROVED';
ALTER TYPE "public"."PageStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "publishAt" TIMESTAMP(3),
ADD COLUMN     "unpublishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "createLead" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sendNotification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "successMessage" TEXT,
ADD COLUMN     "successRedirectUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."FormField" ADD COLUMN     "conditionalRules" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "step" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "estimatedValue" DECIMAL(12,2),
ADD COLUMN     "lastActivityAt" TIMESTAMP(3),
ADD COLUMN     "nextFollowUpAt" TIMESTAMP(3),
ADD COLUMN     "priority" "public"."LeadPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."MediaAsset" ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."Page" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "publishAt" TIMESTAMP(3),
ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "submittedById" TEXT,
ADD COLUMN     "submittedForReviewAt" TIMESTAMP(3),
ADD COLUMN     "unpublishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."PageSection" ADD COLUMN     "globalBlockId" TEXT;

-- AlterTable
ALTER TABLE "public"."PortfolioProject" ADD COLUMN     "publishAt" TIMESTAMP(3),
ADD COLUMN     "unpublishAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."PageTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "category" "public"."TemplateCategory" NOT NULL DEFAULT 'CUSTOM',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlobalBlock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "description" TEXT,
    "content" JSONB NOT NULL,
    "style" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "public"."LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "assignedToId" TEXT,
    "createdById" TEXT,
    "relatedType" "public"."TaskRelationType",
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "link" TEXT,
    "dedupeKey" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PortfolioTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageTemplate_slug_key" ON "public"."PageTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalBlock_slug_key" ON "public"."GlobalBlock"("slug");

-- CreateIndex
CREATE INDEX "Task_assignedToId_status_idx" ON "public"."Task"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "Task_relatedType_relatedId_idx" ON "public"."Task"("relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "Task_dueAt_idx" ON "public"."Task"("dueAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "public"."Notification"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_dedupeKey_key" ON "public"."Notification"("userId", "dedupeKey");

-- CreateIndex
CREATE INDEX "MediaFolder_parentId_idx" ON "public"."MediaFolder"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolder_parentId_name_key" ON "public"."MediaFolder"("parentId", "name");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_createdAt_idx" ON "public"."LeadActivity"("leadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_key_key" ON "public"."EmailTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "FormTemplate_key_key" ON "public"."FormTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioTemplate_key_key" ON "public"."PortfolioTemplate"("key");

-- CreateIndex
CREATE INDEX "Lead_assignedToId_idx" ON "public"."Lead"("assignedToId");

-- CreateIndex
CREATE INDEX "Lead_priority_idx" ON "public"."Lead"("priority");

-- CreateIndex
CREATE INDEX "Lead_nextFollowUpAt_idx" ON "public"."Lead"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "MediaAsset_folderId_idx" ON "public"."MediaAsset"("folderId");

-- CreateIndex
CREATE INDEX "Page_status_publishAt_idx" ON "public"."Page"("status", "publishAt");

-- CreateIndex
CREATE INDEX "Page_status_unpublishAt_idx" ON "public"."Page"("status", "unpublishAt");

-- CreateIndex
CREATE INDEX "PageSection_globalBlockId_idx" ON "public"."PageSection"("globalBlockId");

-- AddForeignKey
ALTER TABLE "public"."PageSection" ADD CONSTRAINT "PageSection_globalBlockId_fkey" FOREIGN KEY ("globalBlockId") REFERENCES "public"."GlobalBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."MediaFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaFolder" ADD CONSTRAINT "MediaFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."MediaFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

