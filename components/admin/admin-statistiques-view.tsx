"use client";

import { Recycle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface CategoryStatItem {
  id: string;
  name: string;
  color: string | null;
  _count: {
    submissions: number;
  };
}

interface AdminStatistiquesViewProps {
  totalSubmissions: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  approvalRate: number;
  totalWeightKg: number;
  pointsDistributed: number;
  categories: CategoryStatItem[];
}

export function AdminStatistiquesView({
  totalSubmissions,
  approvedCount,
  rejectedCount,
  pendingCount,
  approvalRate,
  totalWeightKg,
  pointsDistributed,
  categories,
}: AdminStatistiquesViewProps) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-8 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "بيانات حقيقية موثقة" : "Données réelles certifiées"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.admin.stats}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "مؤشرات الأداء والأثر البيئي المحتسبة مباشرة من العمليات المعتمدة في النظام."
            : "Indicateurs de performance calculés directement à partir des données de production."}
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي العمليات المصرح بها" : "Total opérations déclarées"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingCount} {lang === "ar" ? "قيد المراجعة" : "en attente d'examen"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي الوزن المعاد تدويره" : "Poids total recyclé vérifié"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalWeightKg.toFixed(1)} {t.common.kg}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "من عمليات معتمدة" : "Opérations validées"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "نسبة المصادقة والقبول" : "Taux de validation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {approvedCount} {lang === "ar" ? "مقبولة" : "approuvées"} / {rejectedCount} {lang === "ar" ? "مرفوضة" : "rejetées"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t.admin.totalPoints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pointsDistributed} {t.common.points}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "قيمة بيئية مستحدثة" : "Créations de valeur"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Recycle size={18} className="text-primary" />
            {lang === "ar" ? "توزيع العمليات حسب فئة النفايات" : "Répartition des collectes par catégorie de déchet"}
          </CardTitle>
          <CardDescription>
            {lang === "ar" ? "أحجام العمليات المسجلة لكل مسار فرز" : "Volumes d'opérations enregistrées par filière de recyclage"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((cat) => {
            const count = cat._count.submissions;
            const pct = totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || "#10B981" }}
                    />
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    <span className="text-muted-foreground">
                      ({count} {lang === "ar" ? "تصريح" : "déclarations"})
                    </span>
                  </div>
                  <span className="font-bold text-foreground">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color || "#10B981",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

