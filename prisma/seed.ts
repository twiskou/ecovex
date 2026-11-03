import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create waste categories
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

  for (const cat of categories) {
    await prisma.wasteCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Created ${categories.length} waste categories`);

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecovex.app" },
    update: {},
    create: {
      email: "admin@ecovex.app",
      passwordHash: adminPassword,
      role: "ADMIN",
      isActive: true,
      profile: {
        create: {
          firstName: "Admin",
          lastName: "ECOVEX",
          totalPoints: 0,
        },
      },
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // Create verifier user
  const verifierPassword = await bcrypt.hash("Verif@123456", 12);
  const verifier = await prisma.user.upsert({
    where: { email: "verificateur@ecovex.app" },
    update: {},
    create: {
      email: "verificateur@ecovex.app",
      passwordHash: verifierPassword,
      role: "VERIFIER",
      isActive: true,
      profile: {
        create: {
          firstName: "Vérificateur",
          lastName: "ECOVEX",
          totalPoints: 0,
        },
      },
    },
  });
  console.log(`✅ Created verifier user: ${verifier.email}`);

  // Create sample collection points
  const collectionPoints = [
    { name: "Centre de tri Nord", address: "123 Rue du Recyclage", city: "Alger", latitude: 36.7372, longitude: 3.0863 },
    { name: "Point vert Central", address: "45 Avenue des Palmiers", city: "Oran", latitude: 35.6987, longitude: -0.6349 },
    { name: "Déchetterie Sud", address: "78 Boulevard de l'Environnement", city: "Constantine", latitude: 36.3650, longitude: 6.6147 },
  ];

  for (const cp of collectionPoints) {
    await prisma.collectionPoint.upsert({
      where: { id: cp.name },
      update: {},
      create: cp,
    });
  }
  console.log(`✅ Created ${collectionPoints.length} collection points`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\nDefault credentials:");
  console.log("  Admin:        admin@ecovex.app / Admin@123456");
  console.log("  Vérificateur: verificateur@ecovex.app / Verif@123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

