// ============================================================
// app/api/auth/login/route.ts — POST /api/auth/login
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, pin } = body;

    const result = await validateCredentials({ user_id, pin });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Set HTTP-only cookie with token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: result.message,
    });

    // Set JWT as HTTP-only cookie
    response.cookies.set({
      name: "auth_token",
      value: result.token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}