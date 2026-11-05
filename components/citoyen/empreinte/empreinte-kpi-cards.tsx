"use client";

import { Scale, CheckCircle2, Leaf, Trees, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import type { FootprintSummary } from "@/app/actions/empreinte";

interface EmpreinteKpiCardsProps {
  summary: FootprintSummary;
}

export function EmpreinteKpiCards({ summary }: EmpreinteKpiCardsProps) {
  const { lang, t } = useLang();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Déchets Déclarés */}
      <Card className="hover:ring-primary/20 transition-all text-start border-border/70 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.empreinte.totalDeclared}
          </CardTitle>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <Scale size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">
            {summary.totalDeclaredKg}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {t.common.kg}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalOperationsCount}{" "}
            {lang === "ar" ? "عملية مودعة إجمالاً" : "opération(s) déclarée(s)"}
          </p>
        </CardContent>
      </Card>

      {/* 2. Déchets Validés */}
      <Card className="hover:ring-primary/20 transition-all text-start border-border/70 shadow-xs bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.empreinte.totalValidated}
          </CardTitle>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {summary.totalValidatedKg}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {t.common.kg}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.approvedOperationsCount}{" "}
            {lang === "ar" ? "عملية معتمدة من المحقق" : "collecte(s) certifiée(s)"}
          </p>
        </CardContent>
      </Card>

      {/* 3. CO2 Évité Estimé */}
      <Card className="hover:ring-primary/20 transition-all text-start border-border/70 shadow-xs bg-gradient-to-br from-sky-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.empreinte.co2Avoided}
          </CardTitle>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
            <Leaf size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            {summary.estimatedCo2AvoidedKg}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {lang === "ar" ? "كغ CO₂" : "kg CO₂e"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "انبعاثات تم تفاديها بفضل الفرز"
              : "Émissions évitées via le tri"}
          </p>
        </CardContent>
      </Card>

      {/* 4. Équivalences Écologiques */}
      <Card className="hover:ring-primary/20 transition-all text-start border-border/70 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {lang === "ar" ? "المكافئ البيئي" : "Équivalences concrètes"}
          </CardTitle>
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Trees size={20} />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Trees size={14} className="text-emerald-500 shrink-0" />
            <span>
              ≈ {summary.treesEquivalent}{" "}
              {lang === "ar" ? "شجرة تمتص لمدة سنة" : "arbre(s) / an"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Car size={14} className="text-sky-500 shrink-0" />
            <span>
              ≈ {summary.carKmEquivalent}{" "}
              {lang === "ar" ? "كم بالسيارة تم تجنبها" : "km en voiture évités"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
