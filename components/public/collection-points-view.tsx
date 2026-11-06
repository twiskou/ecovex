"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Navigation,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle,
  PlusCircle,
  Sparkles,
  Recycle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import type { MapPoint } from "@/components/public/algeria-collection-map";
import {
  getPointLocalized,
  getCategoryLocalized,
  getCityLocalized,
} from "@/lib/collection-points-i18n";

// Dynamic import with SSR disabled to prevent Leaflet window/document SSR issues
const AlgeriaCollectionMap = dynamic(
  () =>
    import("@/components/public/algeria-collection-map").then(
      (mod) => mod.AlgeriaCollectionMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] sm:h-[620px] rounded-3xl bg-muted/40 animate-pulse flex flex-col items-center justify-center border border-border/80">
        <MapPin size={40} className="text-primary/40 animate-bounce mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">
          Chargement de la carte interactive d&apos;Algérie...
        </p>
      </div>
    ),
  }
);

type PointWithCategories = MapPoint;

interface CollectionPointsViewProps {
  points: PointWithCategories[];
}

export function CollectionPointsView({ points }: CollectionPointsViewProps) {
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Extract unique cities
  const cities = Array.from(new Set(points.map((p) => p.city))).sort();

  // Filter points based on search & city (supports bilingual search FR & AR)
  const filteredPoints = points.filter((p) => {
    const loc = getPointLocalized(p, lang);
    const searchLower = search.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      p.name.toLowerCase().includes(searchLower) ||
      loc.name.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower) ||
      loc.address.toLowerCase().includes(searchLower) ||
      p.city.toLowerCase().includes(searchLower) ||
      loc.city.toLowerCase().includes(searchLower) ||
      p.acceptedCategories.some((c) => {
        const catFr = c.category.name.toLowerCase();
        const catAr = getCategoryLocalized(c.category.name, "ar").toLowerCase();
        return catFr.includes(searchLower) || catAr.includes(searchLower);
      });

    const matchesCity = selectedCity === "all" || p.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleSelectPointCard = (point: MapPoint) => {
    setSelectedPointId(point.id);
    const mapElement = document.getElementById("algeria-map-section");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="py-12 sm:py-20 text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 gap-1.5 border-eco-orange/30 text-eco-orange">
            <Compass size={13} className="text-eco-orange" />
            {lang === "ar" ? "الشبكة الوطنية للفرز" : t.collectionPointsPage.badge}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {lang === "ar" ? (
              <>
                مراكز ونقاط التجميع في <span className="text-eco-orange">الجزائر</span>
              </>
            ) : (
              <>
                {t.collectionPointsPage.title}{" "}
                <span className="text-eco-orange">en Algérie</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "استكشف الخريطة التفاعلية الحقيقية لمراكز التجميع ومحطات الفرز المنتشرة عبر مختلف ولايات الوطن، وحدد أقرب نقطة لإيداع وتثمين نفاياتك."
              : t.collectionPointsPage.sub}
          </p>
        </div>

        {/* Real Interactive Map Section */}
        <div id="algeria-map-section" className="scroll-mt-24 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Navigation size={20} className="text-primary" />
                {lang === "ar" ? "الخريطة التفاعلية لمراكز التجميع" : "Carte interactive des points de collecte"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "ar"
                  ? "انقر على أي مؤشر لاستعراض تفاصيل النقطة والنفايات المقبولة، أو اختر الولاية للتقريب المباشر."
                  : "Cliquez sur un marqueur pour inspecter les déchets acceptés ou zoomez directement par wilaya."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-eco-orange/15 text-eco-orange border border-eco-orange/30">
                {points.length} {lang === "ar" ? "نقطة تجميع مسجلة" : "points de collecte"}
              </span>
            </div>
          </div>

          {/* Map Component */}
          <AlgeriaCollectionMap
            points={points}
            selectedPointId={selectedPointId}
            onSelectPoint={(pt) => setSelectedPointId(pt.id)}
            depositUrlTemplate={() => "/connexion"}
          />
        </div>

        {/* Search, Filter & List Header */}
        <div className="pt-8 border-t border-border/70 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {lang === "ar" ? "قائمة المواقع والمراكز المعتمدة" : "Liste des sites et centres conventionnés"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredPoints.length} {lang === "ar" ? "موقع متاح حالياً" : t.collectionPointsPage.availableCount}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder={
                  lang === "ar"
                    ? "ابحث بالاسم، الولاية أو العنوان..."
                    : "Rechercher par nom, wilaya ou adresse..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 text-start rounded-xl"
              />
            </div>
          </div>

          {/* City / Wilaya Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant={selectedCity === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity("all")}
              className="rounded-xl text-xs font-semibold"
            >
              {lang === "ar" ? "جميع الولايات" : t.common.all} ({points.length})
            </Button>
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity(city)}
                className="rounded-xl text-xs font-semibold whitespace-nowrap"
              >
                {getCityLocalized(city, lang)} ({points.filter((p) => p.city === city).length})
              </Button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredPoints.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
              <MapPin size={48} className="text-muted-foreground/40 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-1">
                {lang === "ar" ? "لم يتم العثور على أي نقطة تجميع" : t.collectionPointsPage.noPointsTitle}
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {lang === "ar"
                  ? "جرب تغيير معايير البحث أو اختيار ولاية أخرى."
                  : t.collectionPointsPage.noPointsDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPoints.map((point) => {
                const isSelected = selectedPointId === point.id;
                const loc = getPointLocalized(point, lang);

                return (
                  <Card
                    key={point.id}
                    className={`transition-all duration-300 text-start flex flex-col justify-between rounded-2xl hover:shadow-lg ${
                      isSelected
                        ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/40 border-border/80"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-eco-orange uppercase tracking-wide">
                              {loc.city}
                            </span>
                            <CardTitle className="text-base font-bold text-foreground leading-snug line-clamp-1">
                              {loc.name}
                            </CardTitle>
                          </div>
                        </div>
                      </div>

                      <CardDescription className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        📍 {loc.address}
                      </CardDescription>

                      {loc.description && (
                        <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 italic leading-relaxed">
                          {loc.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      {/* Accepted categories badges */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5">
                          {lang === "ar" ? "الفئات المقبولة :" : "Filières acceptées :"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {point.acceptedCategories.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {lang === "ar" ? "جميع أنواع النفايات المفروزة" : "Tous déchets recyclables"}
                            </span>
                          ) : (
                            point.acceptedCategories.map((pc) => (
                              <Badge
                                key={pc.categoryId}
                                variant="secondary"
                                className="text-[11px] font-semibold py-0.5 px-2 rounded-lg"
                              >
                                {getCategoryLocalized(pc.category.name, lang)}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectPointCard(point)}
                          className="text-xs h-8 px-2.5 text-primary hover:text-primary gap-1 font-semibold"
                        >
                          <Navigation size={13} className="rtl:rotate-180" />
                          {lang === "ar" ? "تحديد على الخريطة" : "Voir sur la carte"}
                        </Button>

                        <Button asChild size="sm" className="text-xs h-8 px-3 rounded-lg font-medium">
                          <Link href="/connexion">
                            {lang === "ar" ? "إيداع" : "Déposer"}
                            <ArrowRight size={13} className="rtl:rotate-180 ms-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Recycle size={26} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {lang === "ar"
              ? "هل ترغب في كسب نقاط مقابل كل عملية تجميع؟"
              : t.collectionPointsPage.interactiveMapTitle}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            {lang === "ar"
              ? "أنشئ حسابك مجاناً لتسجيل وتصريح عمليات الفرز، توثيق صور الأدلة، وربح نقاط بيئية قيمة عند كل إيداع في مراكزنا."
              : t.collectionPointsPage.interactiveMapDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-xl font-bold gap-2">
              <Link href="/inscription">
                {t.collectionPointsPage.registerBtn}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold">
              <Link href="/connexion">{t.collectionPointsPage.connectBtn}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
