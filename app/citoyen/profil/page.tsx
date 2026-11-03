import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenProfilView } from "@/components/citoyen/citoyen-profil-view";

export const metadata = {
  title: "Mon profil | ECOVEX",
};

export default async function CitoyenProfilPage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user) redirect("/connexion");

  const initialData = {
    email: user.email,
    role: user.role,
    firstName: user.profile?.firstName || "",
    lastName: user.profile?.lastName || "",
    phone: user.profile?.phone || null,
    city: user.profile?.city || null,
    totalPoints: user.profile?.totalPoints || 0,
    createdAt: user.createdAt.toISOString(),
  };

  return <CitoyenProfilView initialData={initialData} />;
}
