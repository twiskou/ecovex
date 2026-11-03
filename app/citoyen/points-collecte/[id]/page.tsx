import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenPointCollecteDetailView } from "@/components/citoyen/citoyen-point-collecte-detail-view";

export const metadata = {
  title: "Détails du point de collecte | ECOVEX",
};

export default async function PointCollecteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const { id } = await params;
  const point = await prisma.collectionPoint.findUnique({
    where: { id },
    include: {
      acceptedCategories: {
        include: { category: true },
      },
    },
  });

  if (!point) notFound();

  return <CitoyenPointCollecteDetailView point={point} />;
}
