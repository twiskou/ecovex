import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PointsCollecteView } from "@/components/citoyen/points-collecte-view";

export const metadata = {
  title: "Points de collecte | ECOVEX",
};

export default async function CitoyenPointsCollectePage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const points = await prisma.collectionPoint.findMany({
    where: { isActive: true },
    include: {
      acceptedCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              pointValue: true,
            },
          },
        },
      },
    },
    orderBy: { city: "asc" },
  });

  return <PointsCollecteView points={points} />;
}
