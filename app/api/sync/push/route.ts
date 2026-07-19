import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { table, records } = await req.json();
    if (!table || !Array.isArray(records)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const syncedIds: number[] = [];
    const failedIds: number[] = [];

    for (const r of records) {
      try {
        switch (table) {
          case "roles":
            await sql`INSERT INTO roles (role_key, role_label, description, color, is_synced, created_at) VALUES (${r.role_key}, ${r.role_label}, ${r.description}, ${r.color}, 1, ${r.created_at}) ON CONFLICT (role_key) DO UPDATE SET role_label=EXCLUDED.role_label, description=EXCLUDED.description, color=EXCLUDED.color, is_synced=1`;
            syncedIds.push(r.id);
            break;
          case "user":
            await sql`INSERT INTO "user" (user_id, full_name, role, pin_hash, biometric_key, is_active, is_synced, last_login, created_at, updated_at) VALUES (${r.user_id}, ${r.full_name}, ${r.role}, ${r.pin_hash}, ${r.biometric_key||null}, ${r.is_active}, 1, ${r.last_login?new Date(r.last_login):null}, ${r.created_at}, ${r.updated_at}) ON CONFLICT (user_id) DO UPDATE SET full_name=EXCLUDED.full_name, role=EXCLUDED.role, pin_hash=EXCLUDED.pin_hash, biometric_key=EXCLUDED.biometric_key, is_active=EXCLUDED.is_active, is_synced=1, last_login=EXCLUDED.last_login, updated_at=NOW()`;
            syncedIds.push(r.id);
            break;
          case "sessions":
            await sql`INSERT INTO sessions (user_id, jwt_token, refresh_token, expires_at, is_offline, is_synced, created_at) VALUES (${r.user_id}, ${r.jwt_token||null}, ${r.refresh_token||null}, ${r.expires_at}, ${r.is_offline||0}, 1, ${r.created_at}) ON CONFLICT (id) DO UPDATE SET jwt_token=EXCLUDED.jwt_token, refresh_token=EXCLUDED.refresh_token, expires_at=EXCLUDED.expires_at, is_offline=EXCLUDED.is_offline, is_synced=1`;
            syncedIds.push(r.id);
            break;
          case "audit_logs":
            await sql`INSERT INTO audit_logs (user_id, action, details, is_synced, created_at) VALUES (${r.user_id}, ${r.action}, ${r.details||null}, 1, ${r.created_at}) ON CONFLICT (id) DO UPDATE SET action=EXCLUDED.action, details=EXCLUDED.details, is_synced=1`;
            syncedIds.push(r.id);
            break;
          case "business_types":
            await sql`INSERT INTO business_types (name, description, amount_charge, is_synced, created_at) VALUES (${r.name}, ${r.description}, ${r.amount_charge}, 1, ${r.created_at}) ON CONFLICT (name) DO UPDATE SET description=EXCLUDED.description, amount_charge=EXCLUDED.amount_charge, is_synced=1`;
            syncedIds.push(r.id);
            break;
          case "business_owners":
            await sql`INSERT INTO business_owners (id, full_name, national_id, location, date_of_birth, allow_multiple_businesses, max_businesses_count, is_synced, created_at) VALUES (${r.id}, ${r.full_name}, ${r.national_id||null}, ${r.location||null}, ${r.date_of_birth?new Date(r.date_of_birth):null}, ${r.allow_multiple_businesses}, ${r.max_businesses_count}, 1, ${r.created_at}) ON CONFLICT (id) DO UPDATE SET full_name=EXCLUDED.full_name, national_id=EXCLUDED.national_id, location=EXCLUDED.location, date_of_birth=EXCLUDED.date_of_birth, allow_multiple_businesses=EXCLUDED.allow_multiple_businesses, max_businesses_count=EXCLUDED.max_businesses_count, is_synced=1`;
            syncedIds.push(r.id);
            break;
          case "businesses":
            await sql`INSERT INTO businesses (id, business_name, registration_number, business_type_id, owner_id, address, phone, email, tax_number, is_active, is_synced, created_at) VALUES (${r.id}, ${r.business_name}, ${r.registration_number||null}, ${r.business_type_id}, ${r.owner_id}, ${r.address||null}, ${r.phone||null}, ${r.email||null}, ${r.tax_number||null}, ${r.is_active}, 1, ${r.created_at}) ON CONFLICT (id) DO UPDATE SET business_name=EXCLUDED.business_name, registration_number=EXCLUDED.registration_number, business_type_id=EXCLUDED.business_type_id, owner_id=EXCLUDED.owner_id, address=EXCLUDED.address, phone=EXCLUDED.phone, email=EXCLUDED.email, tax_number=EXCLUDED.tax_number, is_active=EXCLUDED.is_active, is_synced=1`;
            syncedIds.push(r.id);
            break;
          default:
            failedIds.push(r.id);
        }
      } catch (err: any) {
        console.error(`Push ${table} ${r.id} failed:`, err.message);
        failedIds.push(r.id);
      }
    }

    return NextResponse.json({ syncedIds, failedIds });
  } catch (e: any) {
    console.error("Push error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}