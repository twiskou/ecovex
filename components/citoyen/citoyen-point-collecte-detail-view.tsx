"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Compass, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import {
  getPointLocalized,
  getCategoryLocalized,
} from "@/lib/collection-points-i18n";

interface AcceptedCategoryItem {
  category: {
    id: string;
    name: string;
    pointValue: number;
  };
}

interface PointItem {
  id: string;
  name: string;
  address: string;
  city: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  acceptedCategories: AcceptedCategoryItem[];
}

export function CitoyenPointCollecteDetailView({ point }: { point: PointItem }) {
  const { lang, t } = useLang();
  const loc = getPointLocalized(point, lang);

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/citoyen/points-collecte">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {lang === "ar" ? "العودة إلى القائمة" : "Retour à la liste"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                {loc.city}
              </div>
              <CardTitle className="text-2xl font-bold">{loc.name}</CardTitle>
              <CardDescription className="text-sm mt-1 flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={16} className="text-primary shrink-0" />
                📍 {loc.address}
              </CardDescription>
            </div>
            <Badge variant="default" className="text-xs shrink-0 bg-emerald-600 text-white">
              ● {lang === "ar" ? "مفتوح ونشط" : "Opérationnel"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loc.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                {lang === "ar" ? "الوصف والمعلومات" : "Description & Spécificités"}
              </h4>
              <p className="text-sm text-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/60">
                {loc.description}
              </p>
            </div>
          )}

          {point.latitude && point.longitude && (
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <Compass size={14} className="text-primary" />
                {lang === "ar" ? "الإحداثيات الجغرافية (GPS)" : "Coordonnées GPS"}
              </h4>
              <p className="text-sm font-mono text-foreground">
                {lang === "ar" ? "خط العرض: " : "Latitude: "}{point.latitude} | {lang === "ar" ? "خط الطول: " : "Longitude: "}{point.longitude}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
              {lang === "ar" ? "فئات النفايات المقبولة والباريم" : "Filières acceptées & barème de points"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {point.acceptedCategories.map(({ category }) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {getCategoryLocalized(category.name, lang)}
                  </span>
                  <Badge variant="secondary" className="text-xs font-bold text-primary">
                    +{category.pointValue} {t.common.points} / {t.common.kg}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Button asChild size="lg" className="w-full gap-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Link href={`/citoyen/operations/nouvelle?pointId=${point.id}`}>
                <PlusCircle size={18} />
                {lang === "ar" ? "التصريح بعملية تجميع في هذه النقطة" : "Déclarer une collecte à ce point"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

