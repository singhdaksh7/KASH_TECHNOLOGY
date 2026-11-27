import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getShowcaseSettings } from "@/lib/server/showcase-admin";

export const revalidate = 60; // 1-minute public ISR cache with on-demand refresh

export async function GET() {
  try {
    const [settings, reviews, clients] = await Promise.all([
      getShowcaseSettings(),
      prisma.clientReview.findMany({
        where: {
          isPublished: true,
          isApproved: true,
          showInTicker: true,
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.client.findMany({
        where: {
          isApproved: true,
          isArchived: false,
          showInMarquee: true,
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json({
      settings,
      reviews,
      clients,
    });
  } catch (error) {
    console.error("Public showcase API error:", error);
    return NextResponse.json({
      settings: null,
      reviews: [],
      clients: [],
    });
  }
}
