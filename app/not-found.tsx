"use client";

import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { LanguageToggle } from "@/components/shared/language-toggle";

export default function NotFound() {
  const { lang, t } = useLang();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/20 text-center relative">
      <div className="absolute top-6 end-6">
        <LanguageToggle />
      </div>

      <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-sm">
        <Compass size={40} strokeWidth={2} />
      </div>

      <span className="text-sm font-semibold tracking-wider text-primary uppercase">
        {lang === "ar" ? "خطأ 404" : "Erreur 404"}
      </span>

      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mt-3">
        {lang === "ar" ? "الصفحة غير موجودة" : "Page introuvable"}
      </h1>

      <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
        {lang === "ar"
          ? "الصفحة التي تبحث عنها غير موجودة، قد تم نقلها أو لم تعد متاحة حالياً."
          : "La page que vous recherchez n'existe pas, a été déplacée ou n'est plus disponible."}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="gap-2 font-medium">
          <Link href="/">
            <Home size={18} />
            {t.common.home}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="gap-2 font-medium">
          <Link href="/points-collecte">
            <ArrowLeft size={18} className="rtl:rotate-180" />
            {t.nav.collectionPoints}
          </Link>
        </Button>
      </div>
    </div>
  );
}
