"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Scale,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface CitoyenOperationDetailViewProps {
  submission: {
    id: string;
    status: string;
    submittedAt: Date;
    quantityKg: number | null;
    estimatedQuantity: boolean;
    notes: string | null;
    imageUrls: string;
    category?: { name: string } | null;
    collectionPoint?: { name: string; address: string; city: string } | null;
    pointTransaction?: { amount: number } | null;
    verification?: {
      reason: string | null;
      verifiedAt: Date;
      verifier: {
        profile?: { firstName: string | null; lastName: string | null } | null;
      };
    } | null;
  };
}

export function CitoyenOperationDetailView({ submission }: CitoyenOperationDetailViewProps) {
  const { lang, t } = useLang();

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(submission.imageUrls);
  } catch {
    parsedImages = [];
  }

  const isApproved = submission.status === "APPROVED";
  const isRejected = submission.status === "REJECTED";
  const isPending = submission.status === "PENDING";

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t.statuses.APPROVED;
    if (status === "REJECTED") return t.statuses.REJECTED;
    if (status === "CANCELLED") return t.statuses.CANCELLED;
    return t.statuses.PENDING;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/citoyen/operations">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {lang === "ar" ? "العودة إلى العمليات" : "Retour à mes opérations"}
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground font-mono">
          {lang === "ar" ? "العملية #" : "Opération #"}{submission.id.slice(-6)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold">
                {lang === "ar" ? "تجميع: " : "Collecte de "}
                {submission.category?.name || (lang === "ar" ? "نفايات" : "déchets")}
              </CardTitle>
              <CardDescription className="text-xs mt-1 flex items-center gap-1.5">
                <Calendar size={13} />
                {lang === "ar" ? "تم الإرسال في " : "Déclarée le "}
                {new Date(submission.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                {" "}
                {lang === "ar" ? "الساعة " : "à "}
                {new Date(submission.submittedAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </CardDescription>
            </div>
            <Badge
              variant={isApproved ? "default" : isRejected ? "destructive" : "secondary"}
              className="text-xs w-fit"
            >
              {getStatusLabel(submission.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isApproved
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                : isRejected
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
            }`}
          >
            {isApproved && <CheckCircle size={20} className="shrink-0 mt-0.5" />}
            {isRejected && <XCircle size={20} className="shrink-0 mt-0.5" />}
            {isPending && <Clock size={20} className="shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold text-sm">
                {isApproved && (lang === "ar" ? "تمت المصادقة على العملية وإيداع النقاط" : "Collecte approuvée et points crédités")}
                {isRejected && (lang === "ar" ? "تم رفض العملية من قِبل المحقق" : "Collecte rejetée par le vérificateur")}
                {isPending && (lang === "ar" ? "في انتظار الفحص والمراجعة" : "En attente de vérification")}
              </p>
              <p className="text-xs mt-0.5 leading-relaxed">
                {isApproved &&
                  (lang === "ar"
                    ? `تم التحقق من هذه العملية بنجاح. تم إضافة ${submission.pointTransaction?.amount || 0} نقطة بيئية إلى رصيدك.`
                    : `Cette opération a été validée. ${submission.pointTransaction?.amount || 0} points écologiques ont été crédités sur votre compte.`)}
                {isRejected &&
                  (lang === "ar"
                    ? `سبب الرفض: ${submission.verification?.reason || "عدم مطابقة معايير الفرز أو عدم وضوح الأدلة."}`
                    : `Motif de rejet : ${submission.verification?.reason || "Non conformité aux critères de dépôt."}`)}
                {isPending &&
                  (lang === "ar"
                    ? "يقوم محقق معتمد بمراجعة تفاصيل طلبك والتحقق من الصور. ستُضاف النقاط فور الاعتماد."
                    : "Un vérificateur agréé examinera votre déclaration sous peu. Les points seront attribués dès validation.")}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                {lang === "ar" ? "نقطة التجميع" : "Point de collecte"}
              </span>
              <p className="text-sm font-semibold text-foreground">
                {submission.collectionPoint?.name || (lang === "ar" ? "نقطة غير محددة" : "Point non renseigné")}
              </p>
              <p className="text-xs text-muted-foreground">
                {submission.collectionPoint?.address}, {submission.collectionPoint?.city}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <Scale size={14} className="text-primary" />
                {lang === "ar" ? "الكمية المسلمة" : "Quantité déposée"}
              </span>
              <p className="text-sm font-semibold text-foreground">
                {submission.quantityKg ? `${submission.quantityKg} ${t.common.kg}` : (lang === "ar" ? "غير موزونة" : "Non pesée")}
              </p>
              <p className="text-xs text-muted-foreground">
                {submission.estimatedQuantity
                  ? (lang === "ar" ? "كمية تم التصريح بها بالتقدير" : "Quantité déclarée par estimation")
                  : (lang === "ar" ? "وزن تم قياسه بدقة" : "Pesée mesurée")}
              </p>
            </div>
          </div>

          {/* Notes */}
          {submission.notes && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                <FileText size={14} className="text-primary" />
                {lang === "ar" ? "ملاحظات مرفقة" : "Notes fournies"}
              </h4>
              <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border/60">
                {submission.notes}
              </p>
            </div>
          )}

          {/* Preuve photo */}
          {parsedImages.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                {lang === "ar" ? "صورة إثبات التجميع" : "Photo de preuve"}
              </h4>
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border shadow-xs">
                <Image
                  src={parsedImages[0]}
                  alt={lang === "ar" ? "إثبات التجميع" : "Preuve du dépôt"}
                  fill
                  className="object-contain bg-black/5"
                />
              </div>
            </div>
          )}

          {/* Verification section */}
          {submission.verification && (
            <div className="border-t border-border/60 pt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  {lang === "ar" ? "تم التحقق بواسطة: " : "Vérifié par : "}
                </strong>
                {submission.verification.verifier.profile?.firstName}{" "}
                {submission.verification.verifier.profile?.lastName}{" "}
                ({lang === "ar" ? "محقق معتمد" : "Vérificateur agréé"})
              </p>
              <p>
                <strong className="text-foreground">
                  {lang === "ar" ? "تاريخ الفحص: " : "Date d'examen : "}
                </strong>
                {new Date(submission.verification.verifiedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                {" "}
                {lang === "ar" ? "الساعة " : "à "}
                {new Date(submission.verification.verifiedAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

