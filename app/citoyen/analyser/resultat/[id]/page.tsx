import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenResultatAnalyseView } from "@/components/citoyen/citoyen-resultat-analyse-view";

export const metadata = {
  title: "Résultat d'analyse | ECOVEX",
};

export default async function ResultatAnalysePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const { id } = await params;
  const classification = await prisma.aIClassification.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!classification || classification.submittedById !== session.userId) {
    notFound();
  }

  return <CitoyenResultatAnalyseView classification={classification} />;
}
