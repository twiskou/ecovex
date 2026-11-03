import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenPointsView } from "@/components/citoyen/citoyen-points-view";

export const metadata = {
  title: "Mes points écologiques | ECOVEX",
};

export default async function CitoyenPointsPage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    prisma.pointTransaction.findMany({
      where: { userId: session.userId },
      include: { submission: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPoints = user?.profile?.totalPoints || 0;

  return (
    <CitoyenPointsView
      totalPoints={totalPoints}
      transactions={transactions}
    />
  );
}
