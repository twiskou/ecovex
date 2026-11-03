import type { Metadata } from "next";
import { TermsView } from "@/components/public/terms-view";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme ECOVEX.",
};

export default function ConditionsPage() {
  return <TermsView />;
}
