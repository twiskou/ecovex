import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminOperationsView } from "@/components/admin/admin-operations-view";

export const metadata = {
  title: "Suivi des opérations | ECOVEX Administration",
};

export default async function AdminOperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const { status } = await searchParams;

  const whereClause: { status?: string } = {};
  if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    whereClause.status = status;
  }

  const submissions = await prisma.collectionSubmission.findMany({
    where: whereClause,
    include: {
      citizen: { include: { profile: true } },
      category: true,
      collectionPoint: true,
      verification: {
        include: { verifier: { include: { profile: true } } },
      },
      pointTransaction: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return <AdminOperationsView submissions={submissions} currentStatus={status} />;
}
