"use client";

import Link from "next/link";
import { PlusCircle, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface SubmissionItem {
  id: string;
  status: string;
  submittedAt: Date;
  quantityKg: number | null;
  category?: { name: string } | null;
  collectionPoint?: { name: string; city: string } | null;
}

interface CitoyenOperationsViewProps {
  submissions: SubmissionItem[];
  currentStatus?: string;
}

export function CitoyenOperationsView({
  submissions,
  currentStatus,
}: CitoyenOperationsViewProps) {
  const { lang, t } = useLang();

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t.statuses.APPROVED;
    if (status === "REJECTED") return t.statuses.REJECTED;
    if (status === "CANCELLED") return t.statuses.CANCELLED;
    return t.statuses.PENDING;
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {lang === "ar" ? "التتبع والشفافية" : "Traçabilité"}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {lang === "ar" ? "سجل عملياتي" : "Historique de mes opérations"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar"
              ? "استعرض جميع تصاريح جمع وفرز النفايات وتابع نتائج التحقق والاعتماد."
              : "Consultez toutes vos déclarations de collecte et suivez leur statut d'examen."}
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0 font-medium">
          <Link href="/citoyen/operations/nouvelle">
            <PlusCircle size={16} />
            {t.citoyen.newOp}
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={!currentStatus ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/citoyen/operations">{t.common.all}</Link>
        </Button>
        <Button
          variant={currentStatus === "PENDING" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/citoyen/operations?status=PENDING">{t.statuses.PENDING}</Link>
        </Button>
        <Button
          variant={currentStatus === "APPROVED" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/citoyen/operations?status=APPROVED">{t.statuses.APPROVED}</Link>
        </Button>
        <Button
          variant={currentStatus === "REJECTED" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/citoyen/operations?status=REJECTED">{t.statuses.REJECTED}</Link>
        </Button>
      </div>

      {/* Operations List */}
      <Card>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <History size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-foreground">
                {lang === "ar" ? "لا توجد عمليات مسجلة" : "Aucune opération trouvée"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar"
                  ? "لم يتم العثور على أي تصريح تجميع يطابق هذا المعيار."
                  : "Vous n'avez pas d'opération correspondant à ce critère."}
              </p>
              <Button asChild size="sm" className="mt-4 gap-2 font-medium">
                <Link href="/citoyen/operations/nouvelle">
                  <PlusCircle size={16} />
                  {t.citoyen.startFirst}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                    <th className="px-6 py-3.5 text-start">{t.common.date}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "نقطة التجميع" : "Point de collecte"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الكمية" : "Quantité"}</th>
                    <th className="px-6 py-3.5 text-start">{t.common.status}</th>
                    <th className="px-6 py-3.5 text-end">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {submissions.map((sub) => {
                    const statusVariant =
                      sub.status === "APPROVED"
                        ? "default"
                        : sub.status === "REJECTED"
                          ? "destructive"
                          : "secondary";

                    return (
                      <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {sub.category?.name || (lang === "ar" ? "فئة غير محددة" : "Catégorie non spécifiée")}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {sub.collectionPoint?.name || "—"} ({sub.collectionPoint?.city || ""})
                        </td>
                        <td className="px-6 py-4 text-xs whitespace-nowrap">
                          {sub.quantityKg ? `${sub.quantityKg} ${t.common.kg}` : (lang === "ar" ? "تقديرية" : "Estimée")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusVariant} className="text-xs">
                            {getStatusLabel(sub.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end">
                          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
                            <Link href={`/citoyen/operations/${sub.id}`}>
                              {t.common.details}
                              <ArrowRight size={14} className="rtl:rotate-180" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

