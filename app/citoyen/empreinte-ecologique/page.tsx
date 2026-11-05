import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getFootprintDataAction } from "@/app/actions/empreinte";
import { CitoyenEmpreinteView } from "@/components/citoyen/empreinte/citoyen-empreinte-view";

export const metadata = {
  title: "Empreinte écologique | ECOVEX",
  description: "Suivez votre impact environnemental, consultez vos statistiques de tri et définissez vos objectifs écologiques.",
};

export default async function CitoyenEmpreintePage() {
  const session = await requireAuth();
  if (!session) {
    redirect("/connexion");
  }

  const res = await getFootprintDataAction();

  if (!res.success || !res.data) {
    return (
      <div className="text-center py-16 text-muted-foreground space-y-4">
        <p className="text-destructive font-medium">
          {res.error || "Impossible de charger les données d'empreinte écologique."}
        </p>
      </div>
    );
  }

  return <CitoyenEmpreinteView data={res.data} />;
}
