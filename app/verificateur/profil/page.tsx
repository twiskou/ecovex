import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificateurProfilView } from "@/components/verificateur/verificateur-profil-view";

export const metadata = {
  title: "Profil vérificateur | ECOVEX",
};

export default async function VerificateurProfilPage() {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) redirect("/connexion");

  const [user, totalDecisions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    prisma.verification.count({
      where: { verifierId: session.userId },
    }),
  ]);

  if (!user) redirect("/connexion");

  return <VerificateurProfilView user={user} totalDecisions={totalDecisions} />;
}
