import type { Metadata } from "next";
import { ImpactView } from "@/components/public/impact-view";

export const metadata: Metadata = {
  title: "Notre impact",
  description:
    "Découvrez l'impact environnemental de la communauté ECOVEX et les statistiques de collecte.",
};

export default function ImpactPage() {
  return <ImpactView />;
}
