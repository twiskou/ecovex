"use client";

import Link from "next/link";
import { Leaf, PlusCircle, Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { EmpreinteKpiCards } from "./empreinte-kpi-cards";
import { EmpreinteCategoryChart } from "./empreinte-category-chart";
import { EmpreinteTimelineChart } from "./empreinte-timeline-chart";
import { EmpreinteLocalComparison } from "./empreinte-local-comparison";
import { EmpreinteGoalsCard } from "./empreinte-goals-card";
import { EmpreinteAdviceCard } from "./empreinte-advice-card";
import type { FootprintFullData } from "@/app/actions/empreinte";

interface CitoyenEmpreinteViewProps {
  data: FootprintFullData;
}

export function CitoyenEmpreinteView({ data }: CitoyenEmpreinteViewProps) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-8 text-start">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-background p-6 rounded-2xl border border-emerald-500/20 shadow-xs">
        <div>
          <Badge variant="outline" className="mb-2 text-xs font-semibold gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
            <Leaf size={12} />
            {t.empreinte.badge}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.empreinte.title}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl leading-relaxed">
            {t.empreinte.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild size="sm" className="gap-2 font-medium">
            <Link href="/citoyen/operations/nouvelle">
              <PlusCircle size={16} />
              {t.citoyen.newOp}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2 font-medium">
            <Link href="/citoyen/analyser">
              <Camera size={16} />
              {t.citoyen.analyze}
            </Link>
          </Button>
        </div>
      </div>

      {/* Row 1: KPI Metrics */}
      <EmpreinteKpiCards summary={data.summary} />

      {/* Row 2: Charts (Category breakdown & Timeline evolution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmpreinteCategoryChart
          categories={data.categories}
          totalValidatedKg={data.summary.totalValidatedKg}
        />
        <EmpreinteTimelineChart timeline={data.timeline} />
      </div>

      {/* Row 3: Local Comparison & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmpreinteLocalComparison comparison={data.comparison} />
        <EmpreinteGoalsCard goal={data.goal} />
      </div>

      {/* Row 4: Personalized Ecological Advice */}
      <EmpreinteAdviceCard advice={data.advice} />
    </div>
  );
}

