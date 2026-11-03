import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminAuditView } from "@/components/admin/admin-audit-view";

export const metadata = {
  title: "Journal d'audit | ECOVEX Administration",
};

export default async function AdminAuditLogsPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const logs = await prisma.auditLog.findMany({
    include: {
      user: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AdminAuditView logs={logs} />;
}
