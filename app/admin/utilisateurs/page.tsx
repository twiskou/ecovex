import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const metadata = {
  title: "Gestion des utilisateurs | ECOVEX",
};

export default async function AdminUtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const { role } = await searchParams;

  const whereClause: { role?: string } = {};
  if (role && ["CITIZEN", "VERIFIER", "ADMIN"].includes(role)) {
    whereClause.role = role;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      profile: true,
      _count: {
        select: {
          submissions: true,
          pointTransactions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersView users={users} currentRole={role} />;
}
