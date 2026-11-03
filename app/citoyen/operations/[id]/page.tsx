import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenOperationDetailView } from "@/components/citoyen/citoyen-operation-detail-view";

export const metadata = {
  title: "Détails de l'opération | ECOVEX",
};

export default async function CitoyenOperationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const { id } = await params;

  const submission = await prisma.collectionSubmission.findUnique({
    where: { id },
    include: {
      category: true,
      collectionPoint: true,
      pointTransaction: true,
      verification: {
        include: {
          verifier: {
            include: { profile: true },
          },
        },
      },
      classification: true,
    },
  });

  if (!submission || submission.citizenId !== session.userId) {
    notFound();
  }

  return <CitoyenOperationDetailView submission={submission} />;
}
