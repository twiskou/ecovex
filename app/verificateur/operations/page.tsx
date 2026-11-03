import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificateurOperationsView } from "@/components/verificateur/verificateur-operations-view";

export const metadata = {
  title: "Opérations à examiner | ECOVEX",
};

export default async function VerificateurOperationsPage() {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) redirect("/connexion");

  const pendingSubmissions = await prisma.collectionSubmission.findMany({
    where: { status: "PENDING" },
    include: {
      citizen: { include: { profile: true } },
      category: true,
      collectionPoint: true,
      classification: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  return <VerificateurOperationsView pendingSubmissions={pendingSubmissions} />;
}
