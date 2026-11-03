import type { Metadata } from "next";
import { AboutView } from "@/components/public/about-view";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission et la vision d'ECOVEX, application de gestion intelligente des déchets.",
};

export default function AProposPage() {
  return <AboutView />;
}
