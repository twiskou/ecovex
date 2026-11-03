import { redirect, notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminUserDetailView } from "@/components/admin/admin-user-detail-view";

export const metadata = {
  title: "Fiche utilisateur | ECOVEX Administration",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      submissions: {
        include: { category: true, collectionPoint: true },
        orderBy: { submittedAt: "desc" },
        take: 5,
      },
      pointTransactions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) notFound();

  return <AdminUserDetailView user={user} />;
}
