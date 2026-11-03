import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificateurHistoriqueView } from "@/components/verificateur/verificateur-historique-view";

export const metadata = {
  title: "Historique des décisions | ECOVEX",
};

export default async function VerificateurHistoriquePage() {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) redirect("/connexion");

  const verifications = await prisma.verification.findMany({
    where: { verifierId: session.userId },
    include: {
      submission: {
        include: {
          category: true,
          citizen: { include: { profile: true } },
          pointTransaction: true,
        },
      },
    },
    orderBy: { verifiedAt: "desc" },
  });

  return <VerificateurHistoriqueView verifications={verifications} />;
}
