import type { Metadata } from "next";
import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";

export const metadata: Metadata = {
  title: "Espace Authentification",
  description: "Connectez-vous ou créez votre compte citoyen sur ECOVEX.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background via-muted/15 to-muted/30 px-4 py-12 sm:py-16 md:py-20">
        <div className="w-full flex justify-center">{children}</div>
      </main>
      <PublicFooter />
    </>
  );
}
