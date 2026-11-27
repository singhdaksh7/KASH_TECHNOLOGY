-- Client Showcase migration: Client, ClientReview, and ShowcaseSettings
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "logoUrl" TEXT,
    "photoUrl" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "websiteUrl" TEXT,
    "showInMarquee" BOOLEAN NOT NULL DEFAULT true,
    "showInTicker" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."ClientReview" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "companyName" TEXT,
    "location" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "photoUrl" TEXT,
    "fullReview" TEXT NOT NULL,
    "shortReview" TEXT,
    "rating" INTEGER DEFAULT 5,
    "source" TEXT NOT NULL DEFAULT 'Verified Delivery',
    "reviewDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "showInTicker" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClientReview_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClientReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "public"."ShowcaseSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tickerEnabled" BOOLEAN NOT NULL DEFAULT true,
    "tickerSpeed" INTEGER NOT NULL DEFAULT 30,
    "tickerDirection" TEXT NOT NULL DEFAULT 'rtl',
    "tickerPauseHover" BOOLEAN NOT NULL DEFAULT true,
    "showCountryFlags" BOOLEAN NOT NULL DEFAULT true,
    "showStarRatings" BOOLEAN NOT NULL DEFAULT true,
    "showPhotographs" BOOLEAN NOT NULL DEFAULT true,
    "marqueeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marqueeSpeed" INTEGER NOT NULL DEFAULT 25,
    "marqueeHeading" TEXT NOT NULL DEFAULT 'Trusted by businesses we work with.',
    "marqueeGrayscale" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShowcaseSettings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Client_showInMarquee_isApproved_isArchived_idx" ON "public"."Client"("showInMarquee", "isApproved", "isArchived");
CREATE INDEX "Client_showInTicker_isApproved_isArchived_idx" ON "public"."Client"("showInTicker", "isApproved", "isArchived");
CREATE INDEX "Client_displayOrder_idx" ON "public"."Client"("displayOrder");

CREATE INDEX "ClientReview_isPublished_isApproved_showInTicker_idx" ON "public"."ClientReview"("isPublished", "isApproved", "showInTicker");
CREATE INDEX "ClientReview_displayOrder_idx" ON "public"."ClientReview"("displayOrder");
CREATE INDEX "ClientReview_clientId_idx" ON "public"."ClientReview"("clientId");
