import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { CitoyenShell } from "@/components/citoyen/citoyen-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Espace Citoyen",
};

export default async function CitoyenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <CitoyenShell userEmail={session.email}>
      {children}
    </CitoyenShell>
  );
}
