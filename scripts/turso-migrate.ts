import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!url || !authToken) {
  console.error("❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in your .env file");
  process.exit(1);
}

async function migrate() {
  console.log("🚀 Initializing Turso Migration...");
  console.log("Target Database:", url);

  const client = createClient({ url, authToken });

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const migrationFolders = fs
    .readdirSync(migrationsDir)
    .filter((file) => fs.statSync(path.join(migrationsDir, file)).isDirectory())
    .sort();

  console.log(`Found ${migrationFolders.length} migration(s):`, migrationFolders);

  for (const folder of migrationFolders) {
    const migrationFile = path.join(migrationsDir, folder, "migration.sql");
    if (fs.existsSync(migrationFile)) {
      console.log(`\n⏳ Applying migration: ${folder}...`);
      const sql = fs.readFileSync(migrationFile, "utf-8");
      await client.executeMultiple(sql);
      console.log(`✅ Successfully applied: ${folder}`);
    }
  }

  // Create _prisma_migrations table to record applied migration
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT PRIMARY KEY,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 1
    );
  `);

  console.log("\n🎉 All migrations applied successfully to Turso!");

  // List created tables
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_libsql%';"
  );
  console.log("\n📋 Tables currently in Turso database:");
  for (const row of tables.rows) {
    console.log(` - ${row.name}`);
  }
}

migrate().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});

