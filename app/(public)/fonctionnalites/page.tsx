import type { Metadata } from "next";
import { FeaturesView } from "@/components/public/features-view";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description:
    "Découvrez toutes les fonctionnalités d'ECOVEX : analyse de déchets, points de collecte, système de points écologiques et plus encore.",
};

export default function FonctionnalitesPage() {
  return <FeaturesView />;
}
