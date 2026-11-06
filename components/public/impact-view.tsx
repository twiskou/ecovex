"use client";

import { TrendingUp, Leaf, Recycle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export function ImpactView() {
  const { t } = useLang();

  const stats = [
    {
      icon: Recycle,
      label: t.impact.approvedOps,
      value: "0",
      description: t.impact.approvedOpsDesc,
    },
    {
      icon: Leaf,
      label: t.impact.pointsDistributed,
      value: "0",
      description: t.impact.pointsDistributedDesc,
    },
    {
      icon: Globe,
      label: t.impact.citizensEngaged,
      value: "0",
      description: t.impact.citizensEngagedDesc,
    },
  ];

  const reasons = [
    {
      icon: Recycle,
      title: t.impact.why1Title,
      description: t.impact.why1Desc,
    },
    {
      icon: Leaf,
      title: t.impact.why2Title,
      description: t.impact.why2Desc,
    },
    {
      icon: Globe,
      title: t.impact.why3Title,
      description: t.impact.why3Desc,
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-eco-orange/30 text-eco-orange">
            {t.impact.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t.impact.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.impact.sub}
          </p>
        </div>

        {/* Public stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {stats.map((stat, idx) => {
            const isHighlight = idx === 1;
            return (
              <Card key={stat.label} className={isHighlight ? "border-eco-orange/30 bg-card shadow-xs" : ""}>
                <CardHeader className="text-start">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${
                      isHighlight ? "bg-eco-orange/15 text-eco-orange" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <stat.icon size={20} />
                  </div>
                  <CardTitle className={`text-3xl font-bold ${isHighlight ? "text-eco-orange" : ""}`}>
                    {stat.value}
                  </CardTitle>
                  <CardDescription className={`font-medium text-sm ${isHighlight ? "text-eco-orange/90 font-semibold" : "text-foreground/80"}`}>
                    {stat.label}
                  </CardDescription>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Notice */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-8 text-center">
          <TrendingUp size={32} className="text-eco-orange mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-3">
            <span className="text-eco-orange">{t.impact.realTimeTitle}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.impact.realTimeDesc}
          </p>
        </div>

        {/* Why it matters */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            {t.impact.whyTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {reasons.map((item, idx) => {
              const isAccent = idx === 1;
              return (
                <div key={item.title} className="flex gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                      isAccent ? "bg-eco-orange/15 text-eco-orange" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <item.icon size={20} />
                  </div>
                  <div className="text-start">
                    <h3 className={`font-semibold mb-1 ${isAccent ? "text-eco-orange font-bold" : "text-foreground"}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

