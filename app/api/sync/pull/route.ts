// app/api/sync/pull/route.ts — with is_deleted soft-delete sync support
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const since = searchParams.get("since") || "1970-01-01T00:00:00.000Z";
    if (!table) return NextResponse.json({ error: "Table required" }, { status: 400 });

    let records: any[] = [];
    switch (table) {
      case "roles":
        records = await sql`
          SELECT id, role_key, role_label, description, color, is_deleted, is_synced, created_at
          FROM roles
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      case "user":
        records = await sql`
          SELECT id, user_id, full_name, role, pin_hash, biometric_key, is_active, is_deleted, is_synced, last_login, created_at, updated_at
          FROM "user"
          WHERE updated_at >= ${since}
          ORDER BY updated_at
        `;
        break;

      case "sessions":
        records = await sql`
          SELECT id, user_id, jwt_token, refresh_token, expires_at, is_offline, is_deleted, is_synced, created_at
          FROM sessions
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      case "audit_logs":
        records = await sql`
          SELECT id, user_id, action, details, is_deleted, is_synced, created_at
          FROM audit_logs
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      case "business_types":
        records = await sql`
          SELECT id, name, description, amount_charge::text, is_deleted, is_synced, created_at
          FROM business_types
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      case "business_owners":
        records = await sql`
          SELECT id, full_name, national_id, location, date_of_birth, allow_multiple_businesses, max_businesses_count, is_deleted, is_synced, created_at
          FROM business_owners
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      case "businesses":
        records = await sql`
          SELECT id, business_name, registration_number, business_type_id, owner_id, address, phone, email, tax_number, is_active, is_deleted, is_synced, created_at
          FROM businesses
          WHERE created_at >= ${since}
          ORDER BY created_at
        `;
        break;

      default:
        return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 });
    }

    const serialized = records.map(r => ({
      ...r,
      created_at: r.created_at?.toISOString?.() || r.created_at,
      updated_at: r.updated_at?.toISOString?.() || r.updated_at,
      last_login: r.last_login?.toISOString?.() || r.last_login,
      date_of_birth: r.date_of_birth?.toISOString?.() || r.date_of_birth,
      expires_at: r.expires_at?.toISOString?.() || r.expires_at,
    }));
    return NextResponse.json({ records: serialized });
  } catch (e: any) {
    console.error("Pull error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}