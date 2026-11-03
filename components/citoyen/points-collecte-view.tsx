"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  PlusCircle,
  ArrowRight,
  Compass,
  Navigation,
  Layers,
  Sparkles,
  Recycle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import {
  getPointLocalized,
  getCategoryLocalized,
  getCityLocalized,
} from "@/lib/collection-points-i18n";
import type { MapPoint } from "@/components/public/algeria-collection-map";

// Dynamic import for Leaflet map to avoid SSR issues
const AlgeriaCollectionMap = dynamic(
  () =>
    import("@/components/public/algeria-collection-map").then(
      (mod) => mod.AlgeriaCollectionMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl bg-muted/40 animate-pulse flex flex-col items-center justify-center border border-border/80">
        <MapPin size={40} className="text-primary/40 animate-bounce mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">
          Chargement de la carte interactive d&apos;Algérie...
        </p>
      </div>
    ),
  }
);

interface CollectionPointItem {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  acceptedCategories: {
    category: {
      id: string;
      name: string;
      color: string | null;
      pointValue: number;
    };
  }[];
}

export function PointsCollecteView({
  points,
}: {
  points: CollectionPointItem[];
}) {
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Extract unique cities
  const cities = Array.from(new Set(points.map((p) => p.city))).sort();

  // Extract unique categories
  const allCategories = Array.from(
    new Set(
      points.flatMap((p) => p.acceptedCategories.map((ac) => ac.category.name))
    )
  ).sort();

  // Format points for AlgeriaCollectionMap
  const mapPoints: MapPoint[] = points.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    city: p.city,
    latitude: p.latitude,
    longitude: p.longitude,
    description: p.description,
    acceptedCategories: p.acceptedCategories.map((ac) => ({
      categoryId: ac.category.id,
      category: {
        id: ac.category.id,
        name: ac.category.name,
        color: ac.category.color,
      },
    })),
  }));

  // Smart bilingual filter
  const filtered = points.filter((p) => {
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

    const matchesCategory =
      selectedCategory === "all" ||
      p.acceptedCategories.some((ac) => ac.category.name === selectedCategory);

    return matchesSearch && matchesCity && matchesCategory;
  });

  const handleSelectOnMap = (point: CollectionPointItem) => {
    setSelectedPointId(point.id);
    const mapElement = document.getElementById("citizen-map-section");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-8 text-start">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="gap-1.5 py-0.5">
              <Compass size={13} className="text-primary" />
              {lang === "ar" ? "الشبكة الوطنية المعتمدة" : "Réseau national certifié"}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 me-1.5 inline-block animate-pulse" />
              {points.length} {lang === "ar" ? "مركز نشط" : "stations opérationnelles"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {lang === "ar"
              ? "مراكز ونقاط التجميع في الجزائر"
              : "Points de collecte partenaires"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl leading-relaxed">
            {lang === "ar"
              ? "استكشف الخريطة التفاعلية لمراكز الفرز ومكبات النفايات الشريكة عبر 20 ولاية، وحدد أقرب محطة لإيداع مخلفاتك وتثمين نقاطك."
              : "Consultez la carte interactive et localisez les stations de tri conventionnées à travers l'Algérie pour effectuer vos dépôts et valoriser vos points."}
          </p>
        </div>

        <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0">
          <Link href="/citoyen/operations/nouvelle">
            <PlusCircle size={16} />
            {lang === "ar" ? "تصريح بعملية جديدة" : "Déclarer une collecte"}
          </Link>
        </Button>
      </div>

      {/* ── Quick KPI Stats Banner ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <MapPin size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-foreground">{points.length}</div>
            <div className="text-xs text-muted-foreground">
              {lang === "ar" ? "محطة تجميع عبر الوطن" : "Centres de tri actifs"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <Navigation size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-foreground">{cities.length}</div>
            <div className="text-xs text-muted-foreground">
              {lang === "ar" ? "ولاية مغطاة (الشمال والصحراء)" : "Wilayas couvertes (Nord & Sahara)"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent border border-teal-500/20 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center shrink-0">
            <Recycle size={22} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-foreground">{allCategories.length}</div>
            <div className="text-xs text-muted-foreground">
              {lang === "ar" ? "فئات نفايات مقبولة للتثمين" : "Filières recyclables acceptées"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Real Interactive Map Section ── */}
      <div id="citizen-map-section" className="scroll-mt-24 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Navigation size={18} className="text-primary" />
              {lang === "ar"
                ? "الخريطة التفاعلية لمراكز التجميع"
                : "Carte interactive des points de collecte"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "انقر على أي مؤشر لاستعراض التفاصيل أو اختر «إيداع هنا» لفتح استمارة الجمع فوراً."
                : "Cliquez sur un marqueur pour inspecter les filières acceptées ou pour déclarer un dépôt."}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-muted text-muted-foreground self-start sm:self-auto">
            {lang === "ar" ? "تحديث آني للمواقع" : "Données temps réel"}
          </span>
        </div>

        {/* Map */}
        <AlgeriaCollectionMap
          points={mapPoints}
          selectedPointId={selectedPointId}
          onSelectPoint={(pt) => setSelectedPointId(pt.id)}
          depositUrlTemplate={(p) => `/citoyen/operations/nouvelle?pointId=${p.id}`}
        />
      </div>

      {/* ── Search, Filters & Center Cards ── */}
      <div className="space-y-4 pt-4 border-t border-border/70">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {lang === "ar" ? "دليل المراكز والمحطات المعتمدة" : "Répertoire des centres homologués"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} {lang === "ar" ? "مركز مطابق للبحث" : "centres disponibles"}
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
                  ? "ابحث بالاسم، الولاية، العنوان..."
                  : "Rechercher par nom, wilaya, adresse..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 text-start rounded-xl text-xs h-10"
            />
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={selectedCity === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCity("all")}
            className="rounded-xl text-xs font-semibold shrink-0 h-8"
          >
            {lang === "ar" ? "جميع الولايات" : t.common.all} ({points.length})
          </Button>
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(city)}
              className="rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 h-8"
            >
              {getCityLocalized(city, lang)} ({points.filter((p) => p.city === city).length})
            </Button>
          ))}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold text-muted-foreground uppercase me-1 shrink-0">
            {lang === "ar" ? "تصفية حسب المادة:" : "Filtrer par matière :"}
          </span>
          <Button
            variant={selectedCategory === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="rounded-lg text-xs h-7 px-2.5 font-medium shrink-0"
          >
            {lang === "ar" ? "الكل" : "Toutes"}
          </Button>
          {allCategories.map((catName) => (
            <Button
              key={catName}
              variant={selectedCategory === catName ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(catName)}
              className="rounded-lg text-xs h-7 px-2.5 font-medium whitespace-nowrap shrink-0"
            >
              {getCategoryLocalized(catName, lang)}
            </Button>
          ))}
        </div>

        {/* ── Cards Grid ── */}
        {filtered.length === 0 ? (
          <Card className="text-center py-16 rounded-2xl border-dashed">
            <CardContent>
              <MapPin size={40} className="mx-auto mb-3 opacity-30 text-muted-foreground" />
              <p className="font-semibold text-foreground text-base">
                {lang === "ar"
                  ? "لم يتم العثور على أي مركز تجميع يطابق بحثك"
                  : "Aucun point de collecte trouvé"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {lang === "ar"
                  ? "جرب إزالة معايير البحث أو اختيار ولاية مختلفة لاستعراض المراكز."
                  : "Essayez de modifier vos critères de recherche ou sélectionnez une autre wilaya."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCity("all");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-xs rounded-xl"
              >
                {lang === "ar" ? "إعادة ضبط عوامل التصفية" : "Réinitialiser les filtres"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((point) => {
              const loc = getPointLocalized(point, lang);
              const isSelected = selectedPointId === point.id;

              return (
                <Card
                  key={point.id}
                  className={`transition-all duration-300 flex flex-col justify-between text-start rounded-2xl hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                      : "hover:border-primary/40 border-border/80"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                            {loc.city}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            ● {lang === "ar" ? "مفتوح" : "Ouvert"}
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold text-foreground leading-snug line-clamp-1 mt-0.5">
                          {loc.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                          📍 {loc.address}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {loc.description && (
                      <p className="text-xs text-muted-foreground/90 line-clamp-2 italic leading-relaxed">
                        {loc.description}
                      </p>
                    )}

                    {point.acceptedCategories.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {lang === "ar" ? "الفئات المقبولة والنقاط:" : "Matières acceptées & barème :"}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {point.acceptedCategories.map((ac) => (
                            <Badge
                              key={ac.category.id}
                              variant="secondary"
                              className="text-[11px] font-semibold py-0.5 px-2 rounded-lg"
                            >
                              {getCategoryLocalized(ac.category.name, lang)} (+{ac.category.pointValue} {lang === "ar" ? "ن" : "pts"})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-3 flex items-center justify-between border-t border-border/60 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectOnMap(point)}
                        className="text-xs h-8 px-2.5 text-primary hover:text-primary gap-1 font-semibold"
                      >
                        <Navigation size={13} className="rtl:rotate-180" />
                        {lang === "ar" ? "على الخريطة" : "Voir sur carte"}
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs h-8 px-2.5 rounded-lg"
                        >
                          <Link href={`/citoyen/points-collecte/${point.id}`}>
                            {t.common.details}
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          asChild
                          className="text-xs h-8 px-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        >
                          <Link href={`/citoyen/operations/nouvelle?pointId=${point.id}`}>
                            <PlusCircle size={13} />
                            {lang === "ar" ? "إيداع" : "Déposer"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
