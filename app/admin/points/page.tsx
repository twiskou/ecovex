import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPointsView } from "@/components/admin/admin-points-view";

export const metadata = {
  title: "Gestion des points | ECOVEX Administration",
};

export default async function AdminPointsPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const [transactions, totalPoints] = await Promise.all([
    prisma.pointTransaction.findMany({
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pointTransaction.aggregate({ _sum: { amount: true } }),
  ]);

  const earnedPoints = transactions
    .filter((t) => t.type === "EARNED")
    .reduce((sum, t) => sum + t.amount, 0);

  const adjustedPoints = transactions
    .filter((t) => t.type === "ADJUSTED")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AdminPointsView
      transactions={transactions}
      totalPointsCount={totalPoints._sum.amount || 0}
      earnedPoints={earnedPoints}
      adjustedPoints={adjustedPoints}
    />
  );
}
