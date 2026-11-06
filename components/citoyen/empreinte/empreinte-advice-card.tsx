"use client";

import { Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import type { EcologicalAdvice } from "@/app/actions/empreinte";

interface EmpreinteAdviceCardProps {
  advice: EcologicalAdvice[];
}

export function EmpreinteAdviceCard({ advice }: EmpreinteAdviceCardProps) {
  const { lang, t } = useLang();

  return (
    <Card className="text-start border-border/70 shadow-xs bg-card">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb size={18} className="text-[#E99A45]" />
            {t.empreinte.adviceTitle}
          </CardTitle>
          <CardDescription>{t.empreinte.adviceSub}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advice.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {lang === "ar" ? item.titleAr : item.titleFr}
                  </h4>
                  {item.topCategoryName && (
                    <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                      {item.topCategoryName}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "ar" ? item.descriptionAr : item.descriptionFr}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs font-medium text-primary">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                <span>{lang === "ar" ? item.actionAr : item.actionFr}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

