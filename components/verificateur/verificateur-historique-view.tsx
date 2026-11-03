"use client";

import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface VerificationHistoryItem {
  id: string;
  decision: string;
  reason: string | null;
  verifiedAt: Date;
  submission: {
    id: string;
    category?: { name: string } | null;
    citizen: {
      profile?: { firstName: string | null; lastName: string | null } | null;
    };
    pointTransaction?: { amount: number } | null;
  };
}

export function VerificateurHistoriqueView({
  verifications,
}: {
  verifications: VerificationHistoryItem[];
}) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "التتبع والرقابة" : "Traçabilité & Contrôle"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.verificateur.history}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "سجل كامل بالعمليات التي قمت بمراجعتها والقرارات المتخذة بشأن إسناد النقاط."
            : "Journal des opérations examinées et des décisions d'attribution rendues."}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {verifications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <History size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-foreground">
                {lang === "ar" ? "لم تصدر أي قرارات بعد" : "Aucune décision rendue pour le moment"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar"
                  ? "ستظهر هنا سجلات فحصك ومصادقتك على تصاريح التجميع."
                  : "Vos vérifications et attributions de points apparaîtront ici."}
              </p>
              <Button asChild size="sm" className="mt-4 font-medium">
                <Link href="/verificateur/operations">
                  {lang === "ar" ? "فحص التصاريح" : "Examiner des déclarations"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "تاريخ القرار" : "Date décision"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "المواطن" : "Citoyen"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "القرار" : "Décision"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "النقاط / السبب" : "Points / Motif"}</th>
                    <th className="px-6 py-3.5 text-end">{lang === "ar" ? "الملف" : "Dossier"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {verifications.map((v) => {
                    const isApproved = v.decision === "APPROVED";
                    return (
                      <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(v.verifiedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                          {" "}
                          {lang === "ar" ? "الساعة " : "à "}
                          {new Date(v.verifiedAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {v.submission.citizen.profile?.firstName} {v.submission.citizen.profile?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" className="text-xs">
                            {v.submission.category?.name || (lang === "ar" ? "غير محدد" : "Catégorie non spécifiée")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={isApproved ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {isApproved ? t.statuses.APPROVED : t.statuses.REJECTED}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {isApproved ? (
                            <span className="font-bold text-primary">
                              +{v.submission.pointTransaction?.amount || 0} {t.common.points}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              {v.reason || (lang === "ar" ? "بدون تعليل" : "Sans motif")}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end">
                          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-medium">
                            <Link href={`/verificateur/operations/${v.submission.id}`}>
                              {lang === "ar" ? "عرض" : "Voir"}
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

