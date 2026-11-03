"use client";

import Link from "next/link";
import { Bell, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface SubmissionNotification {
  id: string;
  status: string;
  updatedAt: Date;
  category?: { name: string } | null;
  pointTransaction?: { amount: number } | null;
  verification?: { reason: string | null } | null;
}

export function CitoyenNotificationsView({ submissions }: { submissions: SubmissionNotification[] }) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "مركز الإشعارات" : "Centre de messages"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.citoyen.notifications}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "تابع نتائج التحقق من عملياتك وأحدث التحديثات على حسابك."
            : "Suivez les validations de vos opérations et les mises à jour de votre compte."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "ar" ? "التحديثات الأخيرة" : "Mises à jour récentes"}
          </CardTitle>
          <CardDescription>
            {lang === "ar"
              ? "الإشعارات المتعلقة بتصاريح جمع وفرز النفايات"
              : "Événements liés à vos déclarations de collecte"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium text-foreground">
                {lang === "ar" ? "لا توجد إشعارات حتى الآن" : "Aucune notification pour l'instant"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar"
                  ? "عندما تقوم بالتصريح بعملية تجميع ويتم فحصها من قِبل المحققين، ستتلقى إشعاراً هنا."
                  : "Lorsque vous déclarez une collecte et qu'elle est examinée, vous recevrez une alerte ici."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {submissions.map((sub) => {
                const isApproved = sub.status === "APPROVED";
                const isRejected = sub.status === "REJECTED";
                const isPending = sub.status === "PENDING";

                return (
                  <div key={sub.id} className="py-4 flex items-start gap-4">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-600"
                          : isRejected
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {isApproved && <CheckCircle size={18} />}
                      {isRejected && <XCircle size={18} />}
                      {isPending && <Clock size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {isApproved && (lang === "ar" ? "تمت الموافقة على التصريح !" : "Déclaration approuvée !")}
                          {isRejected && (lang === "ar" ? "تم رفض التصريح" : "Déclaration rejetée")}
                          {isPending && (lang === "ar" ? "التصريح قيد الفحص" : "Déclaration en cours d'examen")}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(sub.updatedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {isApproved &&
                          (lang === "ar"
                            ? `تم التحقق من عملية تجميع ${sub.category?.name || "النفايات"}. حصلت على ${sub.pointTransaction?.amount || 10} نقطة بيئية.`
                            : `Votre collecte de ${sub.category?.name || "déchets"} a été validée. Vous avez reçu ${sub.pointTransaction?.amount || 10} points écologiques.`)}
                        {isRejected &&
                          (lang === "ar"
                            ? `تم رفض العملية. السبب: ${sub.verification?.reason || "عدم المطابقة للمواصفات."}`
                            : `Votre collecte a été rejetée. Motif: ${sub.verification?.reason || "Non conforme aux critères."}`)}
                        {isPending &&
                          (lang === "ar"
                            ? `تصريحك الخاص بفئة ${sub.category?.name || "النفايات"} ينتظر مراجعة المحققين.`
                            : `Votre déclaration pour la catégorie ${sub.category?.name || "déchets"} est en attente d'examen par un vérificateur.`)}
                      </p>

                      <div className="mt-2">
                        <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs text-primary gap-1 font-medium">
                          <Link href={`/citoyen/operations/${sub.id}`}>
                            {t.common.details}
                            <ArrowRight size={12} className="rtl:rotate-180" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

