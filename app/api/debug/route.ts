// app/api/debug/route.ts — postgres version
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [roleCount] = await sql`SELECT COUNT(*) as c FROM roles`;
    const [userCount] = await sql`SELECT COUNT(*) as c FROM "user"`;
    const [btCount] = await sql`SELECT COUNT(*) as c FROM business_types`;
    const [boCount] = await sql`SELECT COUNT(*) as c FROM business_owners`;
    const [bizCount] = await sql`SELECT COUNT(*) as c FROM businesses`;

    return Response.json({
      status: "ok",
      dbConnected: true,
      counts: {
        roles: parseInt(roleCount.c),
        users: parseInt(userCount.c),
        business_types: parseInt(btCount.c),
        business_owners: parseInt(boCount.c),
        businesses: parseInt(bizCount.c),
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
      hint: "Make sure DATABASE_URL is set and tables exist.",
    }, { status: 500 });
  }
}