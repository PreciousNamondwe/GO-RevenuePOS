// app/api/sync/check-deleted/route.ts
// Check if a record is marked as deleted (is_deleted = 1) on the server

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";

const TABLE_MAP: Record<string, string> = {
  roles: "roles",
  user: "\"user\"",
  sessions: "sessions",
  audit_logs: "audit_logs",
  business_types: "business_types",
  business_owners: "business_owners",
  businesses: "businesses",
};

const IDENTITY_COLUMNS: Record<string, string[]> = {
  roles: ["role_key", "id"],
  user: ["user_id", "id"],
  business_types: ["name", "id"],
  business_owners: ["national_id", "id"],
  businesses: ["registration_number", "id"],
  sessions: ["id"],
  audit_logs: ["id"],
};

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");

    if (!table) {
      return NextResponse.json({ error: "Table parameter required" }, { status: 400 });
    }

    const pgTable = TABLE_MAP[table];
    if (!pgTable) {
      return NextResponse.json({ error: "Unknown table" }, { status: 400 });
    }

    // Try to find by any of the identity columns
    const idColumns = IDENTITY_COLUMNS[table] || ["id"];
    let record: any = null;

    for (const col of idColumns) {
      const value = searchParams.get(col);
      if (value) {
        const results = col === "id"
          ? await sql`SELECT is_deleted FROM ${sql.unsafe(pgTable)} WHERE id = ${Number(value)} LIMIT 1`
          : await sql`SELECT is_deleted FROM ${sql.unsafe(pgTable)} WHERE ${sql.unsafe(col)} = ${value} LIMIT 1`;

        if (results.length > 0) {
          record = results[0];
          break;
        }
      }
    }

    if (!record) {
      return NextResponse.json({
        success: true,
        is_deleted: 0,
        found: false,
        message: "Record not found on server",
      });
    }

    return NextResponse.json({
      success: true,
      is_deleted: record.is_deleted || 0,
      found: true,
    });
  } catch (error: any) {
    console.error("[SYNC CHECK-DELETED] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}