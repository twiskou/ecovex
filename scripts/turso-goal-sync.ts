import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!url || !authToken) {
  console.log("No Turso env set, skipping Turso sync.");
  process.exit(0);
}

const client = createClient({ url, authToken });

async function run() {
  console.log("Syncing EcologicalGoal table with Turso Cloud...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "EcologicalGoal" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "targetKg" REAL NOT NULL,
      "period" TEXT NOT NULL DEFAULT 'MONTHLY',
      "categoryId" TEXT,
      "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "EcologicalGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  await client.execute(`CREATE INDEX IF NOT EXISTS "EcologicalGoal_userId_idx" ON "EcologicalGoal"("userId");`);
  console.log("✅ EcologicalGoal table successfully created/verified in Turso!");
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Turso sync error:", e);
    process.exit(1);
  });

