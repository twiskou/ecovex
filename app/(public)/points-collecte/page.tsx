import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CollectionPointsView } from "@/components/public/collection-points-view";

export const metadata: Metadata = {
  title: "Points de collecte",
  description:
    "Trouvez les points de collecte de déchets disponibles près de chez vous.",
};

async function getCollectionPoints() {
  try {
    return await prisma.collectionPoint.findMany({
      where: { isActive: true },
      include: {
        acceptedCategories: {
          include: { category: true },
        },
      },
      orderBy: { city: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function PointsCollectePage() {
  const points = await getCollectionPoints();
  return <CollectionPointsView points={points} />;
}
