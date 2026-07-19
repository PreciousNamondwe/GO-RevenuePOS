// lib/db.ts — Raw PostgreSQL Client (NO PRISMA)
// ============================================================

import { Pool } from "pg";

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // SSL config for Vercel/serverless
  const sslConfig = process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false;

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

const globalForDb = globalThis as unknown as { dbPool: Pool | undefined };

export function getPoolInstance(): Pool {
  if (!globalForDb.dbPool) {
    globalForDb.dbPool = getPool();
  }
  return globalForDb.dbPool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPoolInstance();
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}