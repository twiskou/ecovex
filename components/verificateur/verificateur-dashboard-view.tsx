"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface PendingSubmissionItem {
  id: string;
  submittedAt: Date;
  quantityKg: number | null;
  citizen: {
    profile?: { firstName: string | null; lastName: string | null } | null;
  };
  category?: { name: string } | null;
  collectionPoint?: { name: string } | null;
}

interface VerificateurDashboardViewProps {
  pendingCount: number;
  totalVerified: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
  pendingSubmissions: PendingSubmissionItem[];
}

export function VerificateurDashboardView({
  pendingCount,
  totalVerified,
  approvedCount,
  rejectedCount,
  approvalRate,
  pendingSubmissions,
}: VerificateurDashboardViewProps) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-8 text-start">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-500/10 via-background to-background p-6 rounded-2xl border border-blue-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {lang === "ar" ? "فضاء المراقبة والتحقق" : "Espace de Contrôle & Vérification"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {lang === "ar"
              ? "افحص تصاريح التجميع، تحقق من الأدلة والصور، واعتمد إسناد النقاط البيئية بدقة."
              : "Examinez les déclarations de collecte, vérifiez les preuves et validez l'attribution des points."}
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 font-medium shrink-0">
          <Link href="/verificateur/operations">
            <ClipboardCheck size={16} />
            {lang === "ar" ? `فحص قائمة الانتظار (${pendingCount})` : `Examiner la file d'attente (${pendingCount})`}
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "في الانتظار" : "À examiner"}
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "تصاريح تنتظر الفحص" : "Déclarations en attente"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "تم فحصها بواسطتك" : "Examinées par vous"}
            </CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalVerified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "إجمالي القرارات المتخذة" : "Total décisions prises"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "معتمدة" : "Approuvées"}
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "تم إيداع نقاطها" : "Points attribués"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "نسبة القبول" : "Taux d'approbation"}
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <TrendingUp size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? `${rejectedCount} حالات رفض معللة` : `${rejectedCount} rejets motivés`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {lang === "ar" ? "قائمة العمليات ذات الأولوية" : "File des déclarations prioritaires"}
            </CardTitle>
            <CardDescription>
              {lang === "ar" ? "أقدم العمليات المنتظرة للتحقق والاعتماد" : "Opérations les plus anciennes en attente de vérification"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
            <Link href="/verificateur/operations">
              {lang === "ar" ? "عرض كامل القائمة" : "Voir toute la file"}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="text-sm font-semibold text-foreground">
                {lang === "ar" ? "قائمة الانتظار فارغة" : "File d'attente vide"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar" ? "تمت معالجة وفحص جميع طلبات التجميع." : "Toutes les opérations déclarées ont été traitées."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "المواطن" : "Citoyen"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "نقطة التجميع" : "Point de collecte"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الكمية" : "Quantité"}</th>
                    <th className="px-6 py-3.5 text-start">{t.common.date}</th>
                    <th className="px-6 py-3.5 text-end">{lang === "ar" ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                        {sub.citizen.profile?.firstName} {sub.citizen.profile?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">
                          {sub.category?.name || (lang === "ar" ? "غير محدد" : "Catégorie non spécifiée")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {sub.collectionPoint?.name}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {sub.quantityKg ? `${sub.quantityKg} ${t.common.kg}` : (lang === "ar" ? "تقديرية" : "Estimée")}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end">
                        <Button size="sm" asChild className="gap-1.5 text-xs h-8 font-medium">
                          <Link href={`/verificateur/operations/${sub.id}`}>
                            {lang === "ar" ? "فحص" : "Examiner"}
                            <ArrowRight size={14} className="rtl:rotate-180" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

