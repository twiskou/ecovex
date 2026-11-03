"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface PendingSubmissionItem {
  id: string;
  submittedAt: Date;
  quantityKg: number | null;
  citizen: {
    email: string;
    profile?: { firstName: string | null; lastName: string | null } | null;
  };
  category?: { name: string } | null;
  collectionPoint?: { name: string; city: string } | null;
}

export function VerificateurOperationsView({
  pendingSubmissions,
}: {
  pendingSubmissions: PendingSubmissionItem[];
}) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "قائمة الانتظار" : "File d'attente"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {lang === "ar" ? "تصاريح التجميع في انتظار المراجعة" : "Déclarations de collecte en attente"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? `${pendingSubmissions.length} عملية تتطلب تدخلك وفحصك الميداني.`
            : `${pendingSubmissions.length} opération(s) nécessite(nt) votre attention.`}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <CheckCircle size={44} className="mx-auto mb-3 text-emerald-500 opacity-60" />
              <p className="text-base font-semibold text-foreground">
                {lang === "ar" ? "لا توجد تصاريح معلقة" : "Aucune déclaration en attente"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar" ? "تم فحص جميع التصاريح المودعة بنجاح." : "La file de vérification est à jour."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "المواطن" : "Citoyen"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "نقطة التجميع" : "Point de dépôt"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الكمية" : "Quantité"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "تاريخ الإرسال" : "Date de soumission"}</th>
                    <th className="px-6 py-3.5 text-end">{lang === "ar" ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                        {sub.citizen.profile?.firstName} {sub.citizen.profile?.lastName}
                        <span className="block text-xs text-muted-foreground font-normal">
                          {sub.citizen.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">
                          {sub.category?.name || (lang === "ar" ? "فئة غير محددة" : "Catégorie non spécifiée")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {sub.collectionPoint?.name} ({sub.collectionPoint?.city})
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap font-medium">
                        {sub.quantityKg ? `${sub.quantityKg} ${t.common.kg}` : (lang === "ar" ? "تقديرية" : "Estimation")}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                        {" "}
                        {lang === "ar" ? "الساعة " : "à "}
                        {new Date(sub.submittedAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
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

