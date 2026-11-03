const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking categories in database...");
  const categories = await prisma.wasteCategory.findMany();
  console.log(`Found ${categories.length} categories.`);

  const algeriaPoints = [
    {
      name: "Centre de Tri ECOVEX Alger-Centre",
      address: "14 Boulevard Didouche Mourad",
      city: "Alger",
      latitude: 36.7538,
      longitude: 3.0588,
      description: "Centre urbain principal de tri sélectif avec bornes intelligentes pour verre, papier et plastique.",
    },
    {
      name: "Éco-Station Bab Ezzouar",
      address: "Pôle Universitaire & Quartier d'Affaires",
      city: "Alger",
      latitude: 36.7119,
      longitude: 3.1818,
      description: "Point de collecte automatisé équipé de balance connectée et compacteurs de bouteilles.",
    },
    {
      name: "Déchetterie Verte Sidi Abdellah",
      address: "Boulevard de l'Écologie, Ville Nouvelle",
      city: "Alger",
      latitude: 36.6710,
      longitude: 2.8790,
      description: "Grand centre de valorisation pour tout type de déchets ménagers, électroniques et cartons.",
    },
    {
      name: "Station Écologique Oran Akid Lotfi",
      address: "Avenue du Front de Mer, Akid Lotfi",
      city: "Oran",
      latitude: 35.7167,
      longitude: -0.6012,
      description: "Kiosque de dépôt rapide pour plastique, canettes en métal et emballages valorisables.",
    },
    {
      name: "Pôle de Recyclage Es-Sénia",
      address: "Zone d'Activité Économique",
      city: "Oran",
      latitude: 35.6480,
      longitude: -0.6270,
      description: "Dépôt gros volumes pour cartons, plastique rigide et métaux industriels.",
    },
    {
      name: "Éco-Kiosque Constantine Ali Mendjeli",
      address: "Nouvelle Ville UV 05",
      city: "Constantine",
      latitude: 36.2480,
      longitude: 6.5710,
      description: "Station moderne de collecte des plastiques, verre et cartons pour les résidents de la ville nouvelle.",
    },
    {
      name: "Déchetterie Urbaine Sidi Mabrouk",
      address: "Rue de la Fraternité",
      city: "Constantine",
      latitude: 36.3570,
      longitude: 6.6280,
      description: "Point de collecte historique réaménagé avec pesée assistée et bacs sélectifs.",
    },
    {
      name: "Point Vert Annaba - Cours de la Révolution",
      address: "Place de la Révolution",
      city: "Annaba",
      latitude: 36.9010,
      longitude: 7.7610,
      description: "Borne intelligente éco-citoyenne en plein centre-ville pour valoriser les déchets de proximité.",
    },
    {
      name: "Centre de Tri Sétif - 8 Mai 1945",
      address: "Boulevard 8 Mai 1945, Proche Parc Mall",
      city: "Sétif",
      latitude: 36.1912,
      longitude: 5.4080,
      description: "Station moderne avec conteneurs sélectifs et programme de récompense citoyenne.",
    },
    {
      name: "Station Verte Tlemcen - Imama",
      address: "Quartier Universitaire Imama",
      city: "Tlemcen",
      latitude: 34.8870,
      longitude: -1.3320,
      description: "Point de tri pour les étudiants et riverains avec priorité aux plastiques et papiers.",
    },
    {
      name: "Éco-Point Blida - Bab Essebt",
      address: "Place Bab Essebt",
      city: "Blida",
      latitude: 36.4710,
      longitude: 2.8310,
      description: "Centre de proximité pour collecte sélective des verres, cartons et métaux ménagers.",
    },
    {
      name: "Centre de Collecte Béjaïa - Port",
      address: "Avenue de la Liberté",
      city: "Béjaïa",
      latitude: 36.7510,
      longitude: 5.0680,
      description: "Point de tri axé sur la valorisation des plastiques marins et déchets côtiers.",
    },
    {
      name: "Pôle Environnement Batna - Tazoult",
      address: "Route Nationale 31",
      city: "Batna",
      latitude: 35.5560,
      longitude: 6.1820,
      description: "Centre de recyclage et de compostage au pied des massifs de l'Aurès.",
    },
    {
      name: "Station des Zibans Biskra",
      address: "Zone Ouest, Boulevard de la Palmeraie",
      city: "Biskra",
      latitude: 34.8510,
      longitude: 5.7280,
      description: "Borne de collecte solaire adaptée aux zones sahariennes pour emballages et bouteilles.",
    },
  ];

  console.log(`Adding ${algeriaPoints.length} collection points across Algeria...`);

  for (const pt of algeriaPoints) {
    // Check if point with same name exists
    const existing = await prisma.collectionPoint.findFirst({
      where: { name: pt.name },
    });

    let pointId;
    if (existing) {
      await prisma.collectionPoint.update({
        where: { id: existing.id },
        data: pt,
      });
      pointId = existing.id;
    } else {
      const created = await prisma.collectionPoint.create({
        data: pt,
      });
      pointId = created.id;
    }

    // Attach 2 to 4 categories to this point
    if (categories.length > 0) {
      // Pick common categories: Plastique, Verre, Papier / Carton, Métal
      const selectedCats = categories.filter((c) =>
        ["Plastique", "Papier / Carton", "Verre", "Métal"].includes(c.name)
      );

      for (const cat of selectedCats) {
        await prisma.collectionPointCategory.upsert({
          where: {
            collectionPointId_categoryId: {
              collectionPointId: pointId,
              categoryId: cat.id,
            },
          },
          update: {},
          create: {
            collectionPointId: pointId,
            categoryId: cat.id,
          },
        });
      }
    }
  }

  const totalPoints = await prisma.collectionPoint.count();
  console.log(`✅ Successfully seeded Algeria points. Total in DB: ${totalPoints}`);
}

main()
  .catch((e) => {
    console.error("Error seeding points:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
