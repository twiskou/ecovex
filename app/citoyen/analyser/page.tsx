import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { CitoyenAnalyserView } from "@/components/citoyen/citoyen-analyser-view";

export const metadata = {
  title: "Analyser un déchet | ECOVEX",
};

export default async function CitoyenAnalyserPage() {
  const session = await requireAuth();
  if (!session) redirect("/connexion");

  return <CitoyenAnalyserView />;
}
