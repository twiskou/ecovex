"use client";

import { Badge } from "@/components/ui/badge";
import { WasteAnalyzerForm } from "@/components/citoyen/waste-analyzer-form";
import { useLang } from "@/lib/i18n";

export function CitoyenAnalyserView() {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "المساعد الذكي للفرز" : "Aide au tri sélectif"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.citoyen.analyzerTitle}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t.citoyen.analyzerSub}
        </p>
      </div>

      <WasteAnalyzerForm />
    </div>
  );
}

