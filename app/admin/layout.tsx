import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration | ECOVEX",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("ADMIN");

  if (!session) {
    redirect("/acces-interdit");
  }

  return (
    <AdminShell userEmail={session.email}>
      {children}
    </AdminShell>
  );
}
