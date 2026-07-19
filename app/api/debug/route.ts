export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();

    // Test a simple query
    const roleCount = await prisma.role.count();
    const userCount = await prisma.user.count();

    return Response.json({
      status: "ok",
      dbConnected: true,
      counts: {
        roles: roleCount,
        users: userCount,
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
      errorName: error.name,
      stack: error.stack?.split("\n").slice(0, 5),
    }, { status: 500 });
  }
}