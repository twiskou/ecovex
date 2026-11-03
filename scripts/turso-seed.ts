/**
 * turso-seed.ts
 * Seeds (or upserts) the two default accounts in Turso Cloud:
 *   - admin@ecovex.app / Admin@123456 (role: ADMIN)
 *   - verificateur@ecovex.app / Verif@123456 (role: VERIFIER)
 */

import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const TURSO_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN!;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error("❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env");
  process.exit(1);
}

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

function cuid(): string {
  // Simple cuid-like id generator (good enough for seeding)
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `c${timestamp}${random}`;
}

interface SeedUser {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
}

async function upsertUser(user: SeedUser): Promise<void> {
  const { email, password, role, firstName, lastName } = user;

  // Check if user already exists
  const existing = await client.execute({
    sql: "SELECT id, email, role FROM User WHERE email = ?",
    args: [email],
  });

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    const userId = row[0] as string;
    console.log(`🔄 User "${email}" already exists (id: ${userId}, role: ${row[2]}). Updating password & role…`);

    await client.execute({
      sql: "UPDATE User SET passwordHash = ?, role = ?, updatedAt = ? WHERE id = ?",
      args: [passwordHash, role, new Date().toISOString(), userId],
    });

    // Ensure profile exists
    const profile = await client.execute({
      sql: "SELECT id FROM UserProfile WHERE userId = ?",
      args: [userId],
    });
    if (profile.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO UserProfile (id, userId, firstName, lastName, totalPoints, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, 0, ?, ?)`,
        args: [cuid(), userId, firstName, lastName, new Date().toISOString(), new Date().toISOString()],
      });
      console.log(`   ✅ Created profile for ${email}`);
    } else {
      console.log(`   ℹ️ Profile already exists for ${email}`);
    }
  } else {
    const userId = cuid();
    const now = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO User (id, email, passwordHash, role, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 1, ?, ?)`,
      args: [userId, email, passwordHash, role, now, now],
    });

    await client.execute({
      sql: `INSERT INTO UserProfile (id, userId, firstName, lastName, totalPoints, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 0, ?, ?)`,
      args: [cuid(), userId, firstName, lastName, now, now],
    });

    console.log(`✅ Created new user "${email}" (id: ${userId}, role: ${role})`);
  }
}

async function main(): Promise<void> {
  console.log("🌱 Seeding Turso Cloud database…");
  console.log(`📡 URL: ${TURSO_URL}\n`);

  // Show current users
  const currentUsers = await client.execute("SELECT email, role FROM User");
  console.log(`📋 Current users in Turso (${currentUsers.rows.length} total):`);
  currentUsers.rows.forEach((row) => {
    console.log(`   - ${row[0]} (${row[1]})`);
  });
  console.log("");

  const usersToSeed: SeedUser[] = [
    {
      email: "admin@ecovex.app",
      password: "Admin@123456",
      role: "ADMIN",
      firstName: "Admin",
      lastName: "ECOVEX",
    },
    {
      email: "verificateur@ecovex.app",
      password: "Verif@123456",
      role: "VERIFIER",
      firstName: "Vérificateur",
      lastName: "ECOVEX",
    },
  ];

  for (const user of usersToSeed) {
    await upsertUser(user);
  }

  // Seed Waste Categories if empty
  const existingCategories = await client.execute("SELECT COUNT(*) as count FROM WasteCategory");
  const catCount = Number(existingCategories.rows[0][0]);
  if (catCount === 0) {
    console.log("\n📦 Seeding Waste Categories...");
    const categories = [
      { name: "Plastique", description: "Bouteilles, emballages plastiques", color: "#3B82F6", iconName: "bottle", pointValue: 10 },
      { name: "Papier / Carton", description: "Journaux, cartons d'emballage", color: "#F59E0B", iconName: "newspaper", pointValue: 8 },
      { name: "Verre", description: "Bouteilles et bocaux en verre", color: "#10B981", iconName: "glass-water", pointValue: 12 },
      { name: "Métal", description: "Canettes, boîtes de conserve", color: "#6B7280", iconName: "box", pointValue: 15 },
      { name: "Organique", description: "Déchets alimentaires et végétaux", color: "#84CC16", iconName: "leaf", pointValue: 6 },
      { name: "Électronique", description: "Appareils électroniques usagés", color: "#8B5CF6", iconName: "smartphone", pointValue: 25 },
      { name: "Textile", description: "Vêtements et tissus usagés", color: "#EC4899", iconName: "shirt", pointValue: 10 },
      { name: "Dangereux", description: "Piles, produits chimiques", color: "#EF4444", iconName: "alert-triangle", pointValue: 20 },
    ];

    const now = new Date().toISOString();
    for (const cat of categories) {
      await client.execute({
        sql: `INSERT INTO WasteCategory (id, name, description, color, iconName, pointValue, isActive, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        args: [cuid(), cat.name, cat.description, cat.color, cat.iconName, cat.pointValue, now],
      });
    }
    console.log(`✅ Created ${categories.length} waste categories in Turso`);
  }

  // Seed Collection Points if empty
  const existingCP = await client.execute("SELECT COUNT(*) as count FROM CollectionPoint");
  const cpCount = Number(existingCP.rows[0][0]);
  if (cpCount === 0) {
    console.log("\n📍 Seeding Collection Points...");
    const points = [
      { name: "Centre de tri Nord", address: "123 Rue du Recyclage", city: "Alger", lat: 36.7372, lng: 3.0863 },
      { name: "Point vert Central", address: "45 Avenue des Palmiers", city: "Oran", lat: 35.6987, lng: -0.6349 },
      { name: "Déchetterie Sud", address: "78 Boulevard de l'Environnement", city: "Constantine", lat: 36.3650, lng: 6.6147 },
    ];

    const now = new Date().toISOString();
    for (const pt of points) {
      await client.execute({
        sql: `INSERT INTO CollectionPoint (id, name, address, city, latitude, longitude, description, isActive, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, 'Point de collecte certifié ECOVEX', 1, ?, ?)`,
        args: [cuid(), pt.name, pt.address, pt.city, pt.lat, pt.lng, now, now],
      });
    }
    console.log(`✅ Created ${points.length} collection points in Turso`);
  }

  // Final state
  const finalUsers = await client.execute("SELECT email, role, isActive FROM User");
  console.log(`\n✅ Done! Final state (${finalUsers.rows.length} users in Turso):`);
  finalUsers.rows.forEach((row) => {
    console.log(`   - ${row[0]} | role: ${row[1]} | active: ${row[2]}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

