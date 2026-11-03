"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface PointItem {
  id: string;
  name: string;
  city: string;
  address: string;
  isActive: boolean;
  acceptedCategories: {
    category: {
      id: string;
      name: string;
    };
  }[];
  _count: {
    submissions: number;
  };
}

export function AdminPointsCollecteView({ points }: { points: PointItem[] }) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {lang === "ar" ? "البنية التحتية" : "Infrastructures"}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.admin.collectPoints}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar"
              ? "إدارة وتوزيع مراكز تجميع وفرز النفايات عبر المدن والأحياء."
              : "Gérez le maillage territorial des déchetteries et centres de tri."}
          </p>
        </div>
        <Button asChild className="gap-2 font-medium shrink-0">
          <Link href="/admin/points-collecte/nouveau">
            <Plus size={16} />
            {t.admin.newPoint}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "موقع التجميع" : "Site de collecte"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "المدينة" : "Ville"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "العنوان" : "Adresse"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "النفايات المقبولة" : "Déchets acceptés"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "العمليات المسلمة" : "Collectes reçues"}</th>
                  <th className="px-6 py-3.5 text-end">{t.common.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {points.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-foreground whitespace-nowrap">
                      {p.city}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {p.address}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.acceptedCategories.map(({ category }) => (
                          <Badge key={category.id} variant="secondary" className="text-[10px]">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground font-semibold whitespace-nowrap">
                      {p._count.submissions} {lang === "ar" ? "عملية" : "opérations"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <Badge variant={p.isActive ? "default" : "secondary"} className="text-xs">
                        {p.isActive
                          ? (lang === "ar" ? "جاهز ونشط" : "Opérationnel")
                          : (lang === "ar" ? "مغلق" : "Fermé")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

