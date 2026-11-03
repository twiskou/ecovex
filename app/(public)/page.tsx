import { prisma } from "@/lib/prisma";
import { HomeView } from "@/components/public/home-view";

async function getStats() {
  try {
    const [operationsCount, pointsAgg, collectionPointsCount, citizensCount] =
      await Promise.all([
        prisma.collectionSubmission.count({ where: { status: "APPROVED" } }),
        prisma.pointTransaction.aggregate({
          _sum: { amount: true },
          where: { type: "EARNED" },
        }),
        prisma.collectionPoint.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: "CITIZEN" } }),
      ]);

    return {
      operations: operationsCount.toString(),
      points: (pointsAgg._sum.amount ?? 0).toString(),
      pointsCollecte: collectionPointsCount.toString(),
      citoyens: citizensCount.toString(),
    };
  } catch {
    return {
      operations: "0",
      points: "0",
      pointsCollecte: "0",
      citoyens: "0",
    };
  }
}

export default async function HomePage() {
  const statsData = await getStats();
  return <HomeView statsData={statsData} />;
}
