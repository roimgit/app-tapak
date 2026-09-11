import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const countCache = new Map<string, { count: number; expiresAt: number }>();
const CACHE_TTL_MS = 30_000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const cached = countCache.get(email);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({ success: true, count: cached.count });
    }

    const count = await prisma.listing.count({
      where: {
        owner_email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    countCache.set(email, { count, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("[OWNER_COUNT_API] Error:", error);
    return NextResponse.json({ success: true, count: 0 });
  }
}
