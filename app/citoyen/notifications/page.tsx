import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenNotificationsView } from "@/components/citoyen/citoyen-notifications-view";

export const metadata = {
  title: "Notifications | ECOVEX",
};

export default async function CitoyenNotificationsPage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const submissions = await prisma.collectionSubmission.findMany({
    where: { citizenId: session.userId },
    include: {
      category: true,
      verification: true,
      pointTransaction: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return <CitoyenNotificationsView submissions={submissions} />;
}
