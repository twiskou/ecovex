const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking categories in database...");
  const categories = await prisma.wasteCategory.findMany();
  console.log(`Found ${categories.length} categories.`);

  const saharaPoints = [
    {
      name: "Station Écologique de la Vallée du M'zab",
      address: "Route Nationale 1, Zone Théniet El-Makhzen",
      city: "Ghardaïa",
      latitude: 32.4909,
      longitude: 3.6735,
      description: "Station solaire de collecte et tri sélectif dans la Vallée du M'zab, adaptée à la valorisation du plastique, carton et verre.",
    },
    {
      name: "Centre de Tri Saharien Ouargla - Sidi Khouiled",
      address: "Zone d'Activité, Route de Touggourt",
      city: "Ouargla",
      latitude: 31.9539,
      longitude: 5.3283,
      description: "Centre de valorisation doté de compacteurs automatiques pour bouteilles plastiques et canettes en métal.",
    },
    {
      name: "Éco-Station de la Saoura Béchar",
      address: "Boulevard de l'ALN, Centre-Ville",
      city: "Béchar",
      latitude: 31.6167,
      longitude: -2.2167,
      description: "Point de tri et collecte éco-responsable des cartons, plastiques et déchets d'équipements électriques.",
    },
    {
      name: "Pôle Vert du Touat Adrar",
      address: "Avenue de l'Indépendance, Cité Administrative",
      city: "Adrar",
      latitude: 27.8743,
      longitude: -0.2939,
      description: "Installation écologique pilote 100% solaire pour le tri des plastiques agricoles et déchets ménagers.",
    },
    {
      name: "Centre de Valorisation Hoggar Tamanrasset",
      address: "Boulevard Émir Abdelkader, Route de l'Assekrem",
      city: "Tamanrasset",
      latitude: 22.7850,
      longitude: 5.5228,
      description: "Centre majeur du Grand Sud pour la protection des écosystèmes sahariens et la valorisation des bouteilles et emballages.",
    },
    {
      name: "Point Éco-Dunes El Oued",
      address: "Quartier 19 Mars, Boulevard de la Palmeraie",
      city: "El Oued",
      latitude: 33.3683,
      longitude: 6.8674,
      description: "Borne de collecte sélective moderne pour le plastique, le papier et les métaux dans la région du Souf.",
    },
    {
      name: "Éco-Kiosque de l'Oasis Rouge Timimoun",
      address: "Centre Urbain, Proche du Ksar",
      city: "Timimoun",
      latitude: 29.2639,
      longitude: 0.2310,
      description: "Point de tri pour préserver l'oasis et recycler les déchets d'emballages, verre et matières plastiques.",
    },
    {
      name: "Station Éco-Tassili Djanet",
      address: "Avenue Tin-Khatma, Centre Djanet",
      city: "Djanet",
      latitude: 24.5534,
      longitude: 9.4853,
      description: "Point de collecte écologique dédié à la préservation de la réserve de biosphère du Tassili n'Ajjer.",
    },
    {
      name: "Point Vert du Tassili Illizi",
      address: "Boulevard 1er Novembre, Illizi Centre",
      city: "Illizi",
      latitude: 26.4833,
      longitude: 8.4667,
      description: "Station de tri sélectif adaptée aux zones arides pour les plastiques, canettes et cartons.",
    },
    {
      name: "Borne Écologique Tindouf",
      address: "Boulevard Principal, Tindouf Centre",
      city: "Tindouf",
      latitude: 27.6744,
      longitude: -8.1478,
      description: "Point de tri éco-citoyen pour la valorisation du plastique et des emballages métalliques.",
    },
  ];

  console.log(`Adding ${saharaPoints.length} Saharan collection points across Algeria...`);

  for (const pt of saharaPoints) {
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

    if (categories.length > 0) {
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
  console.log(`✅ Successfully seeded Saharan points! Total in DB: ${totalPoints}`);
}

main()
  .catch((e) => {
    console.error("Error seeding Saharan points:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

