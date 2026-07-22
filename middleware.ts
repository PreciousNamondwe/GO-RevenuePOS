// ============================================================
// middleware.ts — Route protection
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// Public routes that don't require auth
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/login",
  "/",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check API routes
  if (pathname.startsWith("/api/")) {
    const token =
      request.cookies.get("auth_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const verification = verifyToken(token);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: verification.error },
        { status: 401 }
      );
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", verification.payload.sub);
    requestHeaders.set("x-user-role", verification.payload.role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};