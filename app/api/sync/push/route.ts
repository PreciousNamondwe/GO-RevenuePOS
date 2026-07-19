// ============================================================
// app/api/sync/push/route.ts — Server: Receive pushed data from device
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const prisma = getPrisma();

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
          case "roles":
            await prisma.role.upsert({
              where: { roleKey: record.role_key },
              update: {
                roleLabel: record.role_label,
                description: record.description,
                color: record.color,
                isSynced: 1,
              },
              create: {
                roleKey: record.role_key,
                roleLabel: record.role_label,
                description: record.description,
                color: record.color,
                isSynced: 1,
                createdAt: new Date(record.created_at),
              },
            });
            break;

          case "user":
            await prisma.user.upsert({
              where: { userId: record.user_id },
              update: {
                fullName: record.full_name,
                role: record.role,
                pinHash: record.pin_hash,
                biometricKey: record.biometric_key,
                isActive: record.is_active,
                isSynced: 1,
                lastLogin: record.last_login ? new Date(record.last_login) : null,
                updatedAt: new Date(),
              },
              create: {
                userId: record.user_id,
                fullName: record.full_name,
                role: record.role,
                pinHash: record.pin_hash,
                biometricKey: record.biometric_key,
                isActive: record.is_active,
                isSynced: 1,
                lastLogin: record.last_login ? new Date(record.last_login) : null,
                createdAt: new Date(record.created_at),
                updatedAt: new Date(record.updated_at),
              },
            });
            break;

          case "business_types":
            await prisma.businessType.upsert({
              where: { name: record.name },
              update: {
                description: record.description,
                amountCharge: record.amount_charge,
                isSynced: 1,
              },
              create: {
                name: record.name,
                description: record.description,
                amountCharge: record.amount_charge,
                isSynced: 1,
                createdAt: new Date(record.created_at),
              },
            });
            break;

          case "business_owners":
            await prisma.businessOwner.upsert({
              where: { id: record.id },
              update: {
                fullName: record.full_name,
                nationalId: record.national_id,
                location: record.location,
                dateOfBirth: record.date_of_birth ? new Date(record.date_of_birth) : null,
                allowMultipleBusinesses: record.allow_multiple_businesses,
                maxBusinessesCount: record.max_businesses_count,
                isSynced: 1,
              },
              create: {
                id: record.id,
                fullName: record.full_name,
                nationalId: record.national_id,
                location: record.location,
                dateOfBirth: record.date_of_birth ? new Date(record.date_of_birth) : null,
                allowMultipleBusinesses: record.allow_multiple_businesses,
                maxBusinessesCount: record.max_businesses_count,
                isSynced: 1,
                createdAt: new Date(record.created_at),
              },
            });
            break;

          case "businesses":
            await prisma.business.upsert({
              where: { id: record.id },
              update: {
                businessName: record.business_name,
                registrationNumber: record.registration_number,
                businessTypeId: record.business_type_id,
                ownerId: record.owner_id,
                address: record.address,
                phone: record.phone,
                email: record.email,
                taxNumber: record.tax_number,
                isActive: record.is_active,
                isSynced: 1,
              },
              create: {
                id: record.id,
                businessName: record.business_name,
                registrationNumber: record.registration_number,
                businessTypeId: record.business_type_id,
                ownerId: record.owner_id,
                address: record.address,
                phone: record.phone,
                email: record.email,
                taxNumber: record.tax_number,
                isActive: record.is_active,
                isSynced: 1,
                createdAt: new Date(record.created_at),
              },
            });
            break;

          default:
            failedIds.push(record.id);
            continue;
        }

        syncedIds.push(record.id);
      } catch (err: any) {
        console.error(`Failed to sync ${table} record ${record.id}:`, err.message);
        failedIds.push(record.id);
      }
    }

    return NextResponse.json({ syncedIds, failedIds });
  } catch (error: any) {
    console.error("Push error:", error.message);
    return NextResponse.json({ error: error.message, name: error.name }, { status: 500 });
  }
}