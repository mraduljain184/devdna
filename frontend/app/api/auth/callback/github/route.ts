import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  return NextResponse.redirect(
    `${backendUrl}/api/auth/github/callback?code=${encodeURIComponent(code)}`,
  );
}
