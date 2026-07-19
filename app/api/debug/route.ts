// ============================================================
// app/api/debug/route.ts — Raw SQL (NO PRISMA)
// ============================================================

import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const roleCount = await query("SELECT COUNT(*) as c FROM roles");
    const userCount = await query("SELECT COUNT(*) as c FROM \"user\"");
    const btCount = await query("SELECT COUNT(*) as c FROM business_types");
    const boCount = await query("SELECT COUNT(*) as c FROM business_owners");
    const bizCount = await query("SELECT COUNT(*) as c FROM businesses");

    return Response.json({
      status: "ok",
      dbConnected: true,
      counts: {
        roles: parseInt(roleCount.rows[0].c),
        users: parseInt(userCount.rows[0].c),
        business_types: parseInt(btCount.rows[0].c),
        business_owners: parseInt(boCount.rows[0].c),
        businesses: parseInt(bizCount.rows[0].c),
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
    });
  } catch (error: any) {
    return Response.json({
      status: "error",
      dbConnected: false,
      error: error.message,
      hint: "Make sure DATABASE_URL is set and tables exist. Run: npx prisma db push",
    }, { status: 500 });
  }
}