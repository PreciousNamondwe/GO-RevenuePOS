// ============================================================
// app/api/sync/pull/route.ts — Raw SQL (NO PRISMA)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const since = searchParams.get("since") || "1970-01-01T00:00:00.000Z";

    if (!table) {
      return NextResponse.json({ error: "Table name required" }, { status: 400 });
    }

    let sql = "";
    let records: any[] = [];

    switch (table) {
      case "roles":
        sql = `SELECT id, role_key, role_label, description, color, is_synced, created_at 
               FROM roles WHERE created_at >= $1 ORDER BY created_at ASC`;
        break;

      case "user":
        sql = `SELECT id, user_id, full_name, role, pin_hash, biometric_key, 
                      is_active, is_synced, last_login, created_at, updated_at
               FROM "user" WHERE updated_at >= $1 ORDER BY updated_at ASC`;
        break;

      case "business_types":
        sql = `SELECT id, name, description, amount_charge::text, is_synced, created_at 
               FROM business_types WHERE created_at >= $1 ORDER BY created_at ASC`;
        break;

      case "business_owners":
        sql = `SELECT id, full_name, national_id, location, date_of_birth,
                      allow_multiple_businesses, max_businesses_count, is_synced, created_at
               FROM business_owners WHERE created_at >= $1 ORDER BY created_at ASC`;
        break;

      case "businesses":
        sql = `SELECT id, business_name, registration_number, business_type_id, 
                      owner_id, address, phone, email, tax_number, is_active, is_synced, created_at
               FROM businesses WHERE created_at >= $1 ORDER BY created_at ASC`;
        break;

      default:
        return NextResponse.json({ error: "Unknown table" }, { status: 400 });
    }

    const result = await query(sql, [since]);
    records = result.rows;

    // Serialize dates and decimals for JSON
    const serializedRecords = records.map((r) => ({
      ...r,
      created_at: r.created_at?.toISOString?.() || r.created_at,
      updated_at: r.updated_at?.toISOString?.() || r.updated_at,
      last_login: r.last_login?.toISOString?.() || r.last_login,
      date_of_birth: r.date_of_birth?.toISOString?.() || r.date_of_birth,
    }));

    return NextResponse.json({ records: serializedRecords });

  } catch (error: any) {
    console.error("Pull error:", error.message);
    return NextResponse.json(
      { error: error.message, detail: error.detail || null },
      { status: 500 }
    );
  }
}