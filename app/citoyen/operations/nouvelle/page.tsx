import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenNouvelleOperationView } from "@/components/citoyen/citoyen-nouvelle-operation-view";

export const metadata = {
  title: "Nouvelle collecte | ECOVEX",
};

export default async function NouvelleCollectePage({
  searchParams,
}: {
  searchParams: Promise<{ pointId?: string; categoryId?: string; classificationId?: string }>;
}) {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const { pointId, categoryId, classificationId } = await searchParams;

  const [categories, collectionPoints] = await Promise.all([
    prisma.wasteCategory.findMany({
      where: { isActive: true },
      select: { id: true, name: true, pointValue: true },
      orderBy: { name: "asc" },
    }),
    prisma.collectionPoint.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { city: "asc" },
    }),
  ]);

  return (
    <CitoyenNouvelleOperationView
      categories={categories}
      collectionPoints={collectionPoints}
      preselectedPointId={pointId}
      preselectedCategoryId={categoryId}
      classificationId={classificationId}
    />
  );
}
