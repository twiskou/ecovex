import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// ─── Global singleton to prevent multiple Prisma instances in dev (HMR) ───────
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const useTurso = isProduction || process.env.USE_TURSO === "true";

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // ── Turso Cloud (Production / USE_TURSO=true) ────────────────────────────
  if (useTurso && tursoUrl) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: isProduction ? ["error"] : ["query", "error", "warn"],
    });
  }

  // ── Local SQLite (Development) ───────────────────────────────────────────
  return new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances during Next.js Hot Module Replacement in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
