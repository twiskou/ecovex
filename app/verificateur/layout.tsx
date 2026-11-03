import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth";
import { VerificateurShell } from "@/components/verificateur/verificateur-shell";

export const metadata = {
  title: "Espace Vérificateur | ECOVEX",
};

export default async function VerificateurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);

  if (!session) {
    redirect("/connexion");
  }

  return (
    <VerificateurShell userEmail={session.email}>
      {children}
    </VerificateurShell>
  );
}

