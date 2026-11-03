import type { Metadata } from "next";
import { CookiesView } from "@/components/public/cookies-view";

export const metadata: Metadata = {
  title: "Politique des cookies",
  description: "Politique relative aux cookies utilisés par ECOVEX.",
};

export default function CookiesPage() {
  return <CookiesView />;
}
