// ============================================================
// app/api/auth/refresh/route.ts — POST /api/auth/refresh
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided." },
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

    const user = await getUserById(verification.payload.sub);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Issue new token
    const newToken = jwt.sign(
      {
        sub: user.user_id,
        id: user.id,
        role: user.role,
        name: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user,
      message: "Token refreshed.",
    });

    response.cookies.set({
      name: "auth_token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}