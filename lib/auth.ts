// ============================================================
// lib/auth.ts — Authentication utilities
// ============================================================

import { sql } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface AuthUser {
  id: number;
  user_id: string;
  full_name: string;
  role: string;
  is_active: number;
}

export interface LoginCredentials {
  user_id: string;
  pin: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message: string;
}

/**
 * Validate user credentials against database
 */
export async function validateCredentials(
  credentials: LoginCredentials
): Promise<LoginResult> {
  try {
    const { user_id, pin } = credentials;

    if (!user_id?.trim() || !pin?.trim()) {
      return { success: false, message: "User ID and PIN are required." };
    }

    // Fetch user from database (case-insensitive user_id)
    const users = await sql`
      SELECT id, user_id, full_name, role, pin_hash, is_active, is_deleted
      FROM "user"
      WHERE LOWER(user_id) = LOWER(${user_id.trim()})
      AND is_deleted = 0
      LIMIT 1
    `;

    if (users.length === 0) {
      return { success: false, message: "Invalid User ID or PIN." };
    }

    const user = users[0];

    // Check if account is active
    if (user.is_active !== 1) {
      return { success: false, message: "Account is deactivated. Contact admin." };
    }

    // Verify PIN using bcrypt
    const isPinValid = await bcrypt.compare(pin.trim(), user.pin_hash);

    if (!isPinValid) {
      return { success: false, message: "Invalid User ID or PIN." };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.user_id,
        id: user.id,
        role: user.role,
        name: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last_login timestamp
    await sql`
      UPDATE "user"
      SET last_login = NOW()
      WHERE id = ${user.id}
    `;

    const authUser: AuthUser = {
      id: user.id,
      user_id: user.user_id,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
    };

    return {
      success: true,
      user: authUser,
      token,
      message: "Login successful.",
    };
  } catch (error) {
    console.error("Auth validation error:", error);
    return { success: false, message: "Authentication failed. Please try again." };
  }
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, error: "Token expired." };
    }
    return { valid: false, error: "Invalid token." };
  }
}

/**
 * Hash a PIN for new user creation
 */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin.trim(), 12);
}

/**
 * Get user by ID from database
 */
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const users = await sql`
      SELECT id, user_id, full_name, role, is_active
      FROM "user"
      WHERE user_id = ${userId}
      AND is_deleted = 0
      AND is_active = 1
      LIMIT 1
    `;

    if (users.length === 0) return null;

    return {
      id: users[0].id,
      user_id: users[0].user_id,
      full_name: users[0].full_name,
      role: users[0].role,
      is_active: users[0].is_active,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}