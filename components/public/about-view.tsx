"use client";

import Image from "next/image";
import { Leaf, Target, Eye, Heart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";

export function AboutView() {
  const { t, lang } = useLang();

  const cards = [
    {
      icon: Target,
      title: t.about.missionTitle,
      description: t.about.missionDesc,
    },
    {
      icon: Eye,
      title: t.about.visionTitle,
      description: t.about.visionDesc,
    },
    {
      icon: Heart,
      title: t.about.valuesTitle,
      description: t.about.valuesDesc,
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t.about.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t.about.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.about.sub}
          </p>
        </div>

        {/* Showcase Image Banner */}
        <div className="relative mb-20 max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border/80 shadow-2xl group">
          <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px]">
            <Image
              src="/about-community.jpg"
              alt={lang === "ar" ? "مبادرة إيكوفيكس المجتمعية للفرز والتدوير الذكي" : "Initiative communautaire de tri intelligent ECOVEX"}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

            {/* Floating glass badge inside image */}
            <div className="absolute bottom-6 start-6 end-6 sm:end-auto flex items-center gap-3 bg-background/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/20 shadow-lg text-xs font-semibold text-foreground">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Leaf size={20} />
              </div>
              <div className="text-start">
                <p className="font-bold text-foreground text-sm">
                  {lang === "ar" ? "تكنولوجيا متطورة لبيئة مستدامة" : "La technologie au service de la planète"}
                </p>
                <p className="text-xs text-muted-foreground font-normal">
                  {lang === "ar" ? "مجتمع فاعل، ذكاء اصطناعي ونقاط بيئية محفزة" : "Communauté engagée, IA & valorisation citoyenne"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-20">
          {cards.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {item.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Concept */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {t.about.conceptTitle}
          </h2>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 text-start">
            <p>{t.about.conceptP1}</p>
            <p>{t.about.conceptP2}</p>
            <p>{t.about.conceptP3}</p>
            <p>{t.about.conceptP4}</p>
          </div>
        </div>

        {/* Tech transparency */}
        <div className="mt-16 rounded-2xl border border-border bg-muted/20 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Leaf size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {t.about.transparencyTitle}
            </h2>
          </div>
          <p className="text-muted-foreground text-start">
            {t.about.transparencyDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

