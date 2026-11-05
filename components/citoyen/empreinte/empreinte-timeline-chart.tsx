"use client";

import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import type { TimelinePoint } from "@/app/actions/empreinte";

interface EmpreinteTimelineChartProps {
  timeline: {
    week: TimelinePoint[];
    month: TimelinePoint[];
    year: TimelinePoint[];
  };
}

export function EmpreinteTimelineChart({ timeline }: EmpreinteTimelineChartProps) {
  const { lang, t } = useLang();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const currentPoints = timeline[period] || [];
  const maxKg = Math.max(...currentPoints.map((p) => Math.max(p.validatedKg, p.declaredKg)), 1);

  return (
    <Card className="text-start border-border/70 shadow-xs h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              {t.empreinte.evolutionTitle}
            </CardTitle>
            <CardDescription>{t.empreinte.evolutionSub}</CardDescription>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60 self-start sm:self-auto">
            <Button
              variant={period === "week" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs font-medium"
              onClick={() => setPeriod("week")}
            >
              {t.empreinte.week}
            </Button>
            <Button
              variant={period === "month" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs font-medium"
              onClick={() => setPeriod("month")}
            >
              {t.empreinte.month}
            </Button>
            <Button
              variant={period === "year" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs font-medium"
              onClick={() => setPeriod("year")}
            >
              {t.empreinte.year}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end pt-4">
        {currentPoints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">{t.empreinte.noTimelineData}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>{t.empreinte.totalValidated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-400/60" />
                <span>{t.empreinte.totalDeclared}</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-border/60">
              {currentPoints.map((pt, idx) => {
                const valHeight = Math.max(4, Math.round((pt.validatedKg / maxKg) * 100));
                const decHeight = Math.max(4, Math.round((pt.declaredKg / maxKg) * 100));
                const labelText = lang === "ar" ? pt.labelAr : pt.label;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-foreground text-background text-[11px] py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                      <p className="font-semibold">{labelText}</p>
                      <p className="text-emerald-300">
                        {pt.validatedKg} kg {lang === "ar" ? "معتمد" : "validé"}
                      </p>
                      {pt.declaredKg > pt.validatedKg && (
                        <p className="text-amber-300">
                          {pt.declaredKg} kg {lang === "ar" ? "مصرّح" : "déclaré"}
                        </p>
                      )}
                    </div>

                    {/* Bars pair */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Declared bar */}
                      <div
                        className="w-2.5 sm:w-4 bg-amber-400/50 hover:bg-amber-400/70 rounded-t-xs transition-all duration-500"
                        style={{ height: `${decHeight}%` }}
                      />
                      {/* Validated bar */}
                      <div
                        className="w-2.5 sm:w-4 bg-emerald-500 hover:bg-emerald-600 rounded-t-xs transition-all duration-500 shadow-xs"
                        style={{ height: `${valHeight}%` }}
                      />
                    </div>

                    {/* Label below */}
                    <span className="text-[10px] sm:text-xs text-muted-foreground mt-2 truncate max-w-full text-center">
                      {labelText.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
