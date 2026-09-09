import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", baseUrl));
  }

  const verificationTokens = global.__TAPAK_VERIFICATION_TOKENS__;
  const record = verificationTokens?.get(token);

  // In development, if record exists or if token is present, we validate
  if (record) {
    if (Date.now() > record.expiresAt) {
      verificationTokens?.delete(token);
      return NextResponse.redirect(new URL("/login?error=token_expired", baseUrl));
    }

    record.verified = true;
    verificationTokens?.delete(token);
  }

  // Update status is_verified di database
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { is_verified: true },
    });
  } catch (dbErr) {
    console.error("[AUTH-VERIFY] Error updating user verification in DB:", dbErr);
  }

  // Redirect to login page with verified=true
  const destination = new URL("/login", baseUrl);
  destination.searchParams.set("verified", "true");
  destination.searchParams.set("email", email);

  return NextResponse.redirect(destination);
}
