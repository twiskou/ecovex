import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificateurDashboardView } from "@/components/verificateur/verificateur-dashboard-view";

export default async function VerificateurDashboardPage() {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) redirect("/connexion");

  const [pendingCount, myDecisions, pendingSubmissions] = await Promise.all([
    prisma.collectionSubmission.count({
      where: { status: "PENDING" },
    }),
    prisma.verification.findMany({
      where: { verifierId: session.userId },
      select: { decision: true },
    }),
    prisma.collectionSubmission.findMany({
      where: { status: "PENDING" },
      include: {
        citizen: { include: { profile: true } },
        category: true,
        collectionPoint: true,
      },
      orderBy: { submittedAt: "asc" },
      take: 6,
    }),
  ]);

  const approvedCount = myDecisions.filter((d) => d.decision === "APPROVED").length;
  const rejectedCount = myDecisions.filter((d) => d.decision === "REJECTED").length;
  const totalVerified = myDecisions.length;
  const approvalRate = totalVerified > 0 ? Math.round((approvedCount / totalVerified) * 100) : 0;

  return (
    <VerificateurDashboardView
      pendingCount={pendingCount}
      totalVerified={totalVerified}
      approvedCount={approvedCount}
      rejectedCount={rejectedCount}
      approvalRate={approvalRate}
      pendingSubmissions={pendingSubmissions}
    />
  );
}
