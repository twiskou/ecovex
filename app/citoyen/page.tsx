import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenDashboardView } from "@/components/citoyen/citoyen-dashboard-view";

export default async function CitoyenDashboardPage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  // Fetch real user data
  const [user, submissions, recentTransactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    prisma.collectionSubmission.findMany({
      where: { citizenId: session.userId },
      include: {
        category: true,
        collectionPoint: true,
      },
      orderBy: { submittedAt: "desc" },
      take: 5,
    }),
    prisma.pointTransaction.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalPoints = user?.profile?.totalPoints ?? 0;
  const pendingCount = await prisma.collectionSubmission.count({
    where: { citizenId: session.userId, status: "PENDING" },
  });
  const approvedCount = await prisma.collectionSubmission.count({
    where: { citizenId: session.userId, status: "APPROVED" },
  });

  return (
    <CitoyenDashboardView
      user={user}
      submissions={submissions}
      recentTransactions={recentTransactions}
      totalPoints={totalPoints}
      pendingCount={pendingCount}
      approvedCount={approvedCount}
    />
  );
}
