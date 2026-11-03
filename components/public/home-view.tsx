"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Leaf,
  MapPin,
  Star,
  Shield,
  Camera,
  Users,
  Recycle,
  CheckCircle,
  BarChart3,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import { PWADownloadSection } from "@/components/public/pwa-download-section";

interface HomeViewProps {
  statsData: {
    operations: string;
    points: string;
    pointsCollecte: string;
    citoyens: string;
  };
}

export function HomeView({ statsData }: HomeViewProps) {
  const { t, lang } = useLang();

  const featureIcons = [Camera, MapPin, Star, Shield, BarChart3, Recycle];

  const steps = [
    { step: "01", icon: Users, title: t.home.step1Title, desc: t.home.step1Desc },
    { step: "02", icon: Camera, title: t.home.step2Title, desc: t.home.step2Desc },
    { step: "03", icon: ClipboardCheck, title: t.home.step3Title, desc: t.home.step3Desc },
    { step: "04", icon: Star, title: t.home.step4Title, desc: t.home.step4Desc },
  ];

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-eco-50 via-background to-background py-20 sm:py-28 lg:py-36">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 ltr:-right-24 rtl:-left-24 w-[480px] h-[480px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-1/2 ltr:-left-24 rtl:-right-24 w-[320px] h-[320px] rounded-full bg-eco-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5">
              <Leaf size={12} className="text-primary" />
              {t.home.badge}
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              {t.home.title1}{" "}
              <span className="text-primary">{t.home.title2}</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              {t.home.sub}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/inscription">
                  {t.home.ctaStart}
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/fonctionnalites">{t.home.ctaFeatures}</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{t.home.proofFree}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{t.home.proofVerified}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{t.home.proofBilingual}</span>
              </div>
            </div>


          </div>

          {/* Hero Visual Image (Real, Clean, Transparent Background) */}
          <div className="relative mx-auto mt-14 sm:mt-20 max-w-5xl px-2 sm:px-4">
            {/* Ambient soft glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-b from-primary/15 via-emerald-500/10 to-transparent blur-3xl opacity-70"
            />

            <div className="relative flex justify-center items-center">
              <Image
                src="/hero-recycling.png"
                alt={lang === "ar" ? "محطة تجميع وفرز النفايات الذكية إيكوفيكس" : "Station intelligente de tri sélectif ECOVEX"}
                width={1024}
                height={413}
                priority
                className="w-full max-w-4xl h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
              />

              {/* Floating Pro Badge 1 - Left / Start */}
              <div className="hidden sm:flex absolute -bottom-4 start-2 sm:start-6 items-center gap-3 bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-primary/20 shadow-xl text-xs font-semibold text-foreground">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Recycle size={18} />
                </div>
                <div className="text-start">
                  <p className="font-bold text-foreground">
                    {lang === "ar" ? "فرز ذكي ومعتمد" : "Tri sélectif certifié"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal">
                    {lang === "ar" ? "ورق وكرتون • بلاستيك • زجاج" : "Papier & Carton • Plastique • Verre"}
                  </p>
                </div>
              </div>

              {/* Floating Pro Badge 2 - Right / End */}
              <div className="hidden sm:flex absolute -top-4 end-2 sm:end-6 items-center gap-3 bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-primary/20 shadow-xl text-xs font-semibold text-foreground">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Star size={18} />
                </div>
                <div className="text-start">
                  <p className="font-bold text-primary">
                    {lang === "ar" ? "+50 نقطة لكل عملية" : "+50 pts par dépôt"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal">
                    {lang === "ar" ? "مكافأة معتمدة فورية" : "Récompense écologique"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: t.home.statOps, value: statsData.operations, icon: ClipboardCheck },
              { label: t.home.statPoints, value: statsData.points, icon: Star },
              { label: t.home.statPointsCollecte, value: statsData.pointsCollecte, icon: MapPin },
              { label: t.home.statCitizens, value: statsData.citoyens, icon: Users },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            {t.home.realDataNotice}
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              {t.home.featBadge}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.home.featTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home.featSub}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.features.map((feature, idx) => {
              const Icon = featureIcons[idx] ?? Recycle;
              return (
                <Card
                  key={feature.title}
                  className="group hover:ring-primary/30 transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2 group-hover:bg-primary/20 transition-colors">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/fonctionnalites">
                {t.home.seeAllFeatures}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              {t.home.howBadge}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.home.howTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {index < 3 && (
                  <div
                    aria-hidden="true"
                    className="hidden md:block absolute top-5 ltr:left-[calc(50%+2rem)] rtl:right-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border"
                  />
                )}

                <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4">
                  {item.step}
                </div>
                <div className="flex justify-center mb-3">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PWA Download Section ──────────────────────────────────────── */}
      <PWADownloadSection />

      {/* ─── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-emerald-950/25 px-8 py-16 sm:px-16 sm:py-20 text-center group">
            {/* Background Image */}
            <Image
              src="/cta-banner-bg.jpg"
              alt={lang === "ar" ? "خلفية مبادرة إيكوفيكس البيئية" : "Arrière-plan initiative ECOVEX"}
              fill
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Cinematic Gradient & Glass Overlay for contrast and readability */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-emerald-950/92 via-emerald-900/85 to-teal-950/92 backdrop-blur-[1px]"
            />

            {/* Ambient Lighting Accents */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -top-24 ltr:-right-24 rtl:-left-24 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute -bottom-24 ltr:-left-24 rtl:-right-24 w-80 h-80 rounded-full bg-teal-300/15 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xl shadow-emerald-950/40 mb-6">
                <Leaf size={28} className="text-emerald-300" />
              </div>

              <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight leading-tight drop-shadow-md">
                {t.home.ctaBannerTitle}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-emerald-50/90 leading-relaxed max-w-xl mx-auto drop-shadow-sm font-normal">
                {t.home.ctaBannerSub}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="gap-2 bg-white text-emerald-950 hover:bg-white/95 hover:shadow-xl hover:shadow-white/25 transition-all font-bold px-7 h-12 rounded-xl text-sm"
                >
                  <Link href="/inscription">
                    {t.home.ctaBannerBtn}
                    <ArrowRight size={18} className="rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md px-7 h-12 rounded-xl transition-all font-semibold text-sm"
                >
                  <Link href="/a-propos">{t.home.ctaBannerLearn}</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-100/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  {t.home.proofFree}
                </span>
                <span className="hidden sm:inline opacity-40">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  {t.home.proofVerified}
                </span>
                <span className="hidden sm:inline opacity-40">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  {t.home.proofBilingual}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

