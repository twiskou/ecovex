import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { AdminSettingsView } from "@/components/admin/admin-settings-view";

export const metadata = {
  title: "Paramètres de l'application | ECOVEX Administration",
};

export default async function AdminParametresPage() {
  const session = await requireRole("ADMIN");
  if (!session) redirect("/acces-interdit");

  return <AdminSettingsView />;
}
