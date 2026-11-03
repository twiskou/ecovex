import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPointsCollecteView } from "@/components/admin/admin-points-collecte-view";

export const metadata = {
  title: "Gestion des points de collecte | ECOVEX Administration",
};

export default async function AdminPointsCollectePage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const points = await prisma.collectionPoint.findMany({
    include: {
      acceptedCategories: {
        include: { category: true },
      },
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { city: "asc" },
  });

  return <AdminPointsCollecteView points={points} />;
}
