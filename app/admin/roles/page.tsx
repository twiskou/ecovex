import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminRolesView } from "@/components/admin/admin-roles-view";

export const metadata = {
  title: "Rôles et permissions | ECOVEX Administration",
};

export default async function AdminRolesPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  const [citizenCount, verifierCount, adminCount] = await Promise.all([
    prisma.user.count({ where: { role: "CITIZEN" } }),
    prisma.user.count({ where: { role: "VERIFIER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return (
    <AdminRolesView
      citizenCount={citizenCount}
      verifierCount={verifierCount}
      adminCount={adminCount}
    />
  );
}
