// app/api/sync/permanent-delete/route.ts
// Permanently delete a record from PostgreSQL when both offline+online is_deleted = 1

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

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { table, id } = body;

    if (!table || !id) {
      return NextResponse.json({ error: "Table and id required" }, { status: 400 });
    }

    const pgTable = TABLE_MAP[table];
    if (!pgTable) {
      return NextResponse.json({ error: "Unknown table" }, { status: 400 });
    }

    // First verify the record is actually marked as deleted
    const checkResult = await sql`SELECT is_deleted FROM ${sql.unsafe(pgTable)} WHERE id = ${Number(id)} LIMIT 1`;

    if (checkResult.length === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (checkResult[0].is_deleted !== 1) {
      return NextResponse.json(
        { error: "Record is not marked for deletion (is_deleted != 1)" },
        { status: 400 }
      );
    }

    // PERMANENTLY DELETE from PostgreSQL
    await sql`DELETE FROM ${sql.unsafe(pgTable)} WHERE id = ${Number(id)}`;

    console.log(`[SYNC PERMANENT-DELETE] Deleted ${table}#${id} from PostgreSQL`);

    return NextResponse.json({
      success: true,
      message: `Record ${table}#${id} permanently deleted`,
    });
  } catch (error: any) {
    console.error("[SYNC PERMANENT-DELETE] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}