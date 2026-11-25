-- AlterTable (additive, safe default: existing users unaffected)
ALTER TABLE "public"."User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
