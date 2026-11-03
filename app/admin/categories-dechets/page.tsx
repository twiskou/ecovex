import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = {
  title: "Catégories de déchets | ECOVEX Administration",
};

export default async function AdminCategoriesPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const categories = await prisma.wasteCategory.findMany({
    include: {
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return <CategoriesManager categories={categories} />;
}
