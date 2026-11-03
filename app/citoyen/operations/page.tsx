import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CitoyenOperationsView } from "@/components/citoyen/citoyen-operations-view";

export const metadata = {
  title: "Mes opérations | ECOVEX",
};

export default async function CitoyenOperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  const { status } = await searchParams;

  const whereClause: { citizenId: string; status?: string } = {
    citizenId: session.userId,
  };
  if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    whereClause.status = status;
  }

  const submissions = await prisma.collectionSubmission.findMany({
    where: whereClause,
    include: {
      category: true,
      collectionPoint: true,
      pointTransaction: true,
      verification: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <CitoyenOperationsView
      submissions={submissions}
      currentStatus={status}
    />
  );
}
