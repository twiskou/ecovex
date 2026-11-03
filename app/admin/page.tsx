import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export default async function AdminDashboardPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const [
    totalUsers,
    totalSubmissions,
    totalPointsGiven,
    activePointsCount,
    recentAudits,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.collectionSubmission.count(),
    prisma.pointTransaction.aggregate({ _sum: { amount: true } }),
    prisma.collectionPoint.count({ where: { isActive: true } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { include: { profile: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { profile: true },
    }),
  ]);

  return (
    <AdminDashboardView
      totalUsers={totalUsers}
      totalSubmissions={totalSubmissions}
      totalPointsGiven={totalPointsGiven._sum.amount || 0}
      activePointsCount={activePointsCount}
      recentAudits={recentAudits}
      recentUsers={recentUsers}
    />
  );
}
