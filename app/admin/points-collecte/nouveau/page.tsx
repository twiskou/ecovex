import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNouveauPointView } from "@/components/admin/admin-nouveau-point-view";

export const metadata = {
  title: "Nouveau point de collecte | ECOVEX Administration",
};

export default async function NouveauPointCollectePage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const categories = await prisma.wasteCategory.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <AdminNouveauPointView categories={categories} />;
}
