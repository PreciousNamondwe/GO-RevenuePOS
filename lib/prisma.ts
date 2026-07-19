// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}