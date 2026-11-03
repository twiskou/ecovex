import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminStatistiquesView } from "@/components/admin/admin-statistiques-view";

export const metadata = {
  title: "Statistiques et rapports | ECOVEX Administration",
};

export default async function AdminStatistiquesPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const [
    totalSubmissions,
    approvedCount,
    rejectedCount,
    pendingCount,
    categories,
    weightAggregate,
    pointsAggregate,
  ] = await Promise.all([
    prisma.collectionSubmission.count(),
    prisma.collectionSubmission.count({ where: { status: "APPROVED" } }),
    prisma.collectionSubmission.count({ where: { status: "REJECTED" } }),
    prisma.collectionSubmission.count({ where: { status: "PENDING" } }),
    prisma.wasteCategory.findMany({
      include: {
        _count: { select: { submissions: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.collectionSubmission.aggregate({
      where: { status: "APPROVED" },
      _sum: { quantityKg: true },
    }),
    prisma.pointTransaction.aggregate({
      _sum: { amount: true },
    }),
  ]);

  const totalEvaluated = approvedCount + rejectedCount;
  const approvalRate = totalEvaluated > 0 ? Math.round((approvedCount / totalEvaluated) * 100) : 0;
  const totalWeightKg = weightAggregate._sum.quantityKg || 0;

  return (
    <AdminStatistiquesView
      totalSubmissions={totalSubmissions}
      approvedCount={approvedCount}
      rejectedCount={rejectedCount}
      pendingCount={pendingCount}
      approvalRate={approvalRate}
      totalWeightKg={totalWeightKg}
      pointsDistributed={pointsAggregate._sum.amount || 0}
      categories={categories}
    />
  );
}
