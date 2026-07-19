// ============================================================
// app/api/sync/pull/route.ts — Server: Send server data to device
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

// Force dynamic — prevents Next.js from evaluating Prisma at build time
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const prisma = getPrisma();

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

    const sinceDate = new Date(since);
    let records: any[] = [];

    switch (table) {
      case "roles":
        records = await prisma.role.findMany({
          where: { createdAt: { gte: sinceDate } },
          select: {
            id: true,
            roleKey: true,
            roleLabel: true,
            description: true,
            color: true,
            isSynced: true,
            createdAt: true,
          },
        });
        break;

      case "user":
        records = await prisma.user.findMany({
          where: { updatedAt: { gte: sinceDate } },
          select: {
            id: true,
            userId: true,
            fullName: true,
            role: true,
            pinHash: true,
            biometricKey: true,
            isActive: true,
            isSynced: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        break;

      case "business_types":
        records = await prisma.businessType.findMany({
          where: { createdAt: { gte: sinceDate } },
          select: {
            id: true,
            name: true,
            description: true,
            amountCharge: true,
            isSynced: true,
            createdAt: true,
          },
        });
        break;

      case "business_owners":
        records = await prisma.businessOwner.findMany({
          where: { createdAt: { gte: sinceDate } },
          select: {
            id: true,
            fullName: true,
            nationalId: true,
            location: true,
            dateOfBirth: true,
            allowMultipleBusinesses: true,
            maxBusinessesCount: true,
            isSynced: true,
            createdAt: true,
          },
        });
        break;

      case "businesses":
        records = await prisma.business.findMany({
          where: { createdAt: { gte: sinceDate } },
          select: {
            id: true,
            businessName: true,
            registrationNumber: true,
            businessTypeId: true,
            ownerId: true,
            address: true,
            phone: true,
            email: true,
            taxNumber: true,
            isActive: true,
            isSynced: true,
            createdAt: true,
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Unknown table" }, { status: 400 });
    }

    const serializedRecords = records.map((r) => ({
      ...r,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: (r as any).updatedAt?.toISOString(),
      lastLogin: (r as any).lastLogin?.toISOString(),
      dateOfBirth: (r as any).dateOfBirth?.toISOString(),
      amountCharge: (r as any).amountCharge?.toString(),
    }));

    return NextResponse.json({ records: serializedRecords });
  } catch (error: any) {
    console.error("Pull error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}