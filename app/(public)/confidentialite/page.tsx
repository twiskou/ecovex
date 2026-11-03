import type { Metadata } from "next";
import { PrivacyView } from "@/components/public/privacy-view";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles d'ECOVEX.",
};

export default function ConfidentialitePage() {
  return <PrivacyView />;
}
