import { redirect, notFound } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificateurOperationDetailView } from "@/components/verificateur/verificateur-operation-detail-view";

export const metadata = {
  title: "Examen d'opération | ECOVEX",
};

export default async function ExamenOperationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) redirect("/connexion");

  const { id } = await params;

  const submission = await prisma.collectionSubmission.findUnique({
    where: { id },
    include: {
      citizen: { include: { profile: true } },
      category: true,
      collectionPoint: true,
      classification: true,
      verification: {
        include: { verifier: { include: { profile: true } } },
      },
      pointTransaction: true,
    },
  });

  if (!submission) notFound();

  // Calcul prévisionnel des points
  const basePoints = submission.category?.pointValue || 10;
  const factor = submission.quantityKg && submission.quantityKg > 0
    ? Math.max(1, Math.round(submission.quantityKg))
    : 1;
  const pointsToAward = basePoints * factor;

  return (
    <VerificateurOperationDetailView
      submission={submission}
      pointsToAward={pointsToAward}
    />
  );
}
