"use client";

import { PieChart, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import type { CategoryBreakdownItem } from "@/app/actions/empreinte";

interface EmpreinteCategoryChartProps {
  categories: CategoryBreakdownItem[];
  totalValidatedKg: number;
}

export function EmpreinteCategoryChart({
  categories,
  totalValidatedKg,
}: EmpreinteCategoryChartProps) {
  const { lang, t } = useLang();

  return (
    <Card className="text-start border-border/70 shadow-xs h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart size={18} className="text-primary" />
              {t.empreinte.categoryDistribution}
            </CardTitle>
            <CardDescription>{t.empreinte.categoryDistributionSub}</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {categories.length} {lang === "ar" ? "فئات" : "matières"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {categories.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground space-y-2">
            <Info size={32} className="mx-auto opacity-40 text-muted-foreground" />
            <p className="text-sm">{t.empreinte.noCategoryData}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || "#10B981" }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono">
                      {cat.validatedKg} {t.common.kg}
                    </span>
                    <span className="font-bold text-foreground min-w-[3rem] text-end">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                {/* Animated progress bar */}
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || "#10B981",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                  <span>
                    {cat.operationsCount}{" "}
                    {lang === "ar" ? "عمليات معتمدة" : "collecte(s) validée(s)"}
                  </span>
                  <span>
                    ≈ {cat.co2AvoidedKg} {lang === "ar" ? "كغ CO₂ تم تفاديه" : "kg CO₂ évité"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
