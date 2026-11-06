"use client";

import Link from "next/link";
import { Users, MapPin, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import type { LocalComparisonData } from "@/app/actions/empreinte";

interface EmpreinteLocalComparisonProps {
  comparison: LocalComparisonData;
}

export function EmpreinteLocalComparison({ comparison }: EmpreinteLocalComparisonProps) {
  const { lang, t } = useLang();

  return (
    <Card className="text-start border-border/70 shadow-xs bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Users size={18} className="text-primary" />
              {t.empreinte.comparisonTitle}
            </CardTitle>
            <CardDescription>{t.empreinte.comparisonSub}</CardDescription>
          </div>
          {comparison.hasCity && comparison.cityName && (
            <Badge variant="secondary" className="gap-1 self-start sm:self-auto text-xs font-medium">
              <MapPin size={12} className="text-primary" />
              {comparison.cityName}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Case 1: No city in user profile */}
        {!comparison.hasCity ? (
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t.empreinte.noCitySet}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.empreinte.setCityPrompt}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 text-xs font-medium">
              <Link href="/citoyen/profil">{t.citoyen.profile}</Link>
            </Button>
          </div>
        ) : !comparison.hasEnoughData ? (
          /* Case 2: City set, but not enough real data (< 2 citizens with approved collections) */
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 flex items-start gap-3.5">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {t.empreinte.insufficientData} ({comparison.cityName})
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.empreinte.insufficientDataDesc}
              </p>
            </div>
          </div>
        ) : (
          /* Case 3: Valid community data available */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* User Validated */}
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground">
                  {t.empreinte.myTotal}
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {comparison.userValidatedKg}{" "}
                  <span className="text-xs font-normal text-muted-foreground">kg</span>
                </p>
              </div>

              {/* City Average */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <p className="text-xs font-medium text-muted-foreground">
                  {t.empreinte.communityAvg}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {comparison.cityAvgValidatedKg}{" "}
                  <span className="text-xs font-normal text-muted-foreground">kg</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {comparison.cityCitizenCount} {lang === "ar" ? "مواطنون مساهمون" : "citoyens actifs"}
                </p>
              </div>

              {/* Difference */}
              <div
                className={`p-3.5 rounded-xl border ${
                  comparison.differenceKg >= 0
                    ? "bg-secondary/40 border-primary/25 text-primary"
                    : "bg-[#E99A45]/15 border-[#E99A45]/30 text-[#B86815] dark:text-[#E99A45]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.empreinte.difference}
                  </p>
                  {comparison.differenceKg >= 0 ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                </div>
                <p className="text-2xl font-bold mt-1">
                  {comparison.differenceKg >= 0 ? `+${comparison.differenceKg}` : comparison.differenceKg}{" "}
                  <span className="text-xs font-normal">kg</span>
                </p>
                <p className="text-[10px] mt-0.5">
                  {comparison.percentageDiff >= 0
                    ? `+${comparison.percentageDiff}%`
                    : `${comparison.percentageDiff}%`}{" "}
                  {lang === "ar" ? "مقارنة بالمتوسط" : "vs moyenne"}
                </p>
              </div>
            </div>

            {/* Assessment message */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>
                {comparison.differenceKg >= 0
                  ? t.empreinte.betterThanAvg
                  : t.empreinte.belowAvg}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

