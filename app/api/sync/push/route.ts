// ============================================================
// app/api/sync/push/route.ts — Raw SQL (NO PRISMA)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { table, records } = await req.json();

    if (!table || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const syncedIds: number[] = [];
    const failedIds: number[] = [];

    for (const record of records) {
      try {
        switch (table) {
          case "roles": {
            const upsertSql = `
              INSERT INTO roles (role_key, role_label, description, color, is_synced, created_at)
              VALUES ($1, $2, $3, $4, 1, $5)
              ON CONFLICT (role_key) 
              DO UPDATE SET 
                role_label = EXCLUDED.role_label,
                description = EXCLUDED.description,
                color = EXCLUDED.color,
                is_synced = 1
              RETURNING id;
            `;
            const res = await query(upsertSql, [
              record.role_key,
              record.role_label,
              record.description,
              record.color,
              new Date(record.created_at),
            ]);
            syncedIds.push(record.id);
            break;
          }

          case "user": {
            const upsertSql = `
              INSERT INTO "user" (user_id, full_name, role, pin_hash, biometric_key, 
                                  is_active, is_synced, last_login, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8, $9)
              ON CONFLICT (user_id) 
              DO UPDATE SET 
                full_name = EXCLUDED.full_name,
                role = EXCLUDED.role,
                pin_hash = EXCLUDED.pin_hash,
                biometric_key = EXCLUDED.biometric_key,
                is_active = EXCLUDED.is_active,
                is_synced = 1,
                last_login = EXCLUDED.last_login,
                updated_at = NOW()
              RETURNING id;
            `;
            const res = await query(upsertSql, [
              record.user_id,
              record.full_name,
              record.role,
              record.pin_hash,
              record.biometric_key || null,
              record.is_active,
              record.last_login ? new Date(record.last_login) : null,
              new Date(record.created_at),
              new Date(record.updated_at),
            ]);
            syncedIds.push(record.id);
            break;
          }

          case "business_types": {
            const upsertSql = `
              INSERT INTO business_types (name, description, amount_charge, is_synced, created_at)
              VALUES ($1, $2, $3, 1, $4)
              ON CONFLICT (name) 
              DO UPDATE SET 
                description = EXCLUDED.description,
                amount_charge = EXCLUDED.amount_charge,
                is_synced = 1
              RETURNING id;
            `;
            const res = await query(upsertSql, [
              record.name,
              record.description,
              record.amount_charge,
              new Date(record.created_at),
            ]);
            syncedIds.push(record.id);
            break;
          }

          case "business_owners": {
            const upsertSql = `
              INSERT INTO business_owners (id, full_name, national_id, location, date_of_birth,
                allow_multiple_businesses, max_businesses_count, is_synced, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8)
              ON CONFLICT (id) 
              DO UPDATE SET 
                full_name = EXCLUDED.full_name,
                national_id = EXCLUDED.national_id,
                location = EXCLUDED.location,
                date_of_birth = EXCLUDED.date_of_birth,
                allow_multiple_businesses = EXCLUDED.allow_multiple_businesses,
                max_businesses_count = EXCLUDED.max_businesses_count,
                is_synced = 1
              RETURNING id;
            `;
            const res = await query(upsertSql, [
              record.id,
              record.full_name,
              record.national_id || null,
              record.location || null,
              record.date_of_birth ? new Date(record.date_of_birth) : null,
              record.allow_multiple_businesses,
              record.max_businesses_count,
              new Date(record.created_at),
            ]);
            syncedIds.push(record.id);
            break;
          }

          case "businesses": {
            const upsertSql = `
              INSERT INTO businesses (id, business_name, registration_number, business_type_id, 
                owner_id, address, phone, email, tax_number, is_active, is_synced, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, $11)
              ON CONFLICT (id) 
              DO UPDATE SET 
                business_name = EXCLUDED.business_name,
                registration_number = EXCLUDED.registration_number,
                business_type_id = EXCLUDED.business_type_id,
                owner_id = EXCLUDED.owner_id,
                address = EXCLUDED.address,
                phone = EXCLUDED.phone,
                email = EXCLUDED.email,
                tax_number = EXCLUDED.tax_number,
                is_active = EXCLUDED.is_active,
                is_synced = 1
              RETURNING id;
            `;
            const res = await query(upsertSql, [
              record.id,
              record.business_name,
              record.registration_number || null,
              record.business_type_id,
              record.owner_id,
              record.address || null,
              record.phone || null,
              record.email || null,
              record.tax_number || null,
              record.is_active,
              new Date(record.created_at),
            ]);
            syncedIds.push(record.id);
            break;
          }

          default:
            failedIds.push(record.id);
            continue;
        }

      } catch (err: any) {
        console.error(`Failed to sync ${table} record ${record.id}:`, err.message);
        failedIds.push(record.id);
      }
    }

    return NextResponse.json({ syncedIds, failedIds });

  } catch (error: any) {
    console.error("Push error:", error.message);
    return NextResponse.json(
      { error: error.message, detail: error.detail || null },
      { status: 500 }
    );
  }
}