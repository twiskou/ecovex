"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Scale,
  FileText,
  Camera,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VerificationActionPanel } from "@/components/verificateur/verification-action-panel";
import { useLang } from "@/lib/i18n";

interface SubmissionDetail {
  id: string;
  status: string;
  submittedAt: Date;
  quantityKg: number | null;
  estimatedQuantity: boolean;
  notes: string | null;
  imageUrls: string;
  category?: { name: string; pointValue: number } | null;
  collectionPoint?: { name: string; address: string; city: string } | null;
  citizen: {
    email: string;
    profile?: {
      firstName: string | null;
      lastName: string | null;
      city: string | null;
      totalPoints: number | null;
    } | null;
  };
  verification?: {
    reason: string | null;
    verifiedAt: Date;
    verifier: {
      profile?: { firstName: string | null; lastName: string | null } | null;
    };
  } | null;
}

export function VerificateurOperationDetailView({
  submission,
  pointsToAward,
}: {
  submission: SubmissionDetail;
  pointsToAward: number;
}) {
  const { lang, t } = useLang();

  let imageUrls: string[] = [];
  try {
    imageUrls = JSON.parse(submission.imageUrls);
  } catch {
    imageUrls = [];
  }

  const isPending = submission.status === "PENDING";

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t.statuses.APPROVED;
    if (status === "REJECTED") return t.statuses.REJECTED;
    if (status === "CANCELLED") return t.statuses.CANCELLED;
    return t.statuses.PENDING;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/verificateur/operations">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {lang === "ar" ? "العودة إلى القائمة" : "Retour à la file"}
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground font-mono">
          {lang === "ar" ? "الملف #" : "Dossier #"}{submission.id.slice(-6)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Photos */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {lang === "ar" ? "تجميع: " : "Collecte de "}
                    {submission.category?.name || (lang === "ar" ? "نفايات" : "déchets")}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 flex items-center gap-1.5">
                    <Calendar size={13} />
                    {lang === "ar" ? "تاريخ الإرسال: " : "Soumise le "}
                    {new Date(submission.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                    {" "}
                    {lang === "ar" ? "الساعة " : "à "}
                    {new Date(submission.submittedAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </CardDescription>
                </div>
                <Badge
                  variant={isPending ? "secondary" : submission.status === "APPROVED" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {getStatusLabel(submission.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Proof */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Camera size={14} className="text-primary" />
                  {lang === "ar" ? "الصورة المرفقة كدليل على التسليم" : "Preuve photographique du dépôt"}
                </h4>
                {imageUrls.length > 0 ? (
                  <div className="relative w-full h-80 rounded-xl overflow-hidden border border-border shadow-xs">
                    <Image
                      src={imageUrls[0]}
                      alt={lang === "ar" ? "صورة الإثبات" : "Photo de preuve"}
                      fill
                      unoptimized
                      className="object-contain bg-black/5"
                    />
                  </div>
                ) : (
                  <div className="p-8 border border-dashed rounded-xl text-center text-xs text-muted-foreground">
                    {lang === "ar" ? "لم يتم إرفاق أي صورة بهذا التصريح." : "Aucune photo jointe à cette déclaration."}
                  </div>
                )}
              </div>

              {/* Data comparison grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {lang === "ar" ? "موقع التجميع" : "Lieu de collecte"}
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {submission.collectionPoint?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {submission.collectionPoint?.address}, {submission.collectionPoint?.city}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                    <Scale size={14} className="text-primary" />
                    {lang === "ar" ? "الوزن / الكمية" : "Poids / Quantité"}
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {submission.quantityKg ? `${submission.quantityKg} ${t.common.kg}` : (lang === "ar" ? "غير محدد" : "Non spécifié")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {submission.estimatedQuantity
                      ? (lang === "ar" ? "تقدير من المواطن" : "Estimation citoyenne")
                      : (lang === "ar" ? "وزن مقاس بدقة" : "Pesée mesurée")}
                  </p>
                </div>
              </div>

              {/* Citizen Notes */}
              {submission.notes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1.5">
                    <FileText size={14} className="text-primary" />
                    {lang === "ar" ? "ملاحظات المواطن" : "Notes fournies par le citoyen"}
                  </h4>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border/60">
                    {submission.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Citizen Info & Decision Panel */}
        <div className="space-y-6">
          {/* Citizen info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <User size={16} className="text-primary" />
                {lang === "ar" ? "بيانات صاحب التصريح" : "Informations du déclarant"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{lang === "ar" ? "الاسم الكامل:" : "Nom complet :"}</span>
                <span className="font-semibold text-foreground">
                  {submission.citizen.profile?.firstName} {submission.citizen.profile?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{lang === "ar" ? "البريد الإلكتروني:" : "Email :"}</span>
                <span className="text-foreground">{submission.citizen.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{lang === "ar" ? "المدينة:" : "Ville :"}</span>
                <span className="text-foreground">{submission.citizen.profile?.city || (lang === "ar" ? "غير محددة" : "Non spécifiée")}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="text-muted-foreground">{lang === "ar" ? "الرصيد الحالي:" : "Solde actuel :"}</span>
                <span className="font-bold text-primary">
                  {submission.citizen.profile?.totalPoints || 0} {t.common.points}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Decision panel or Already decided state */}
          {isPending ? (
            <VerificationActionPanel
              submissionId={submission.id}
              pointsToAward={pointsToAward}
              categoryName={submission.category?.name || (lang === "ar" ? "النفايات" : "déchets")}
            />
          ) : (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {lang === "ar" ? "القرار المسجل" : "Décision enregistrée"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  {submission.status === "APPROVED" ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={16} /> {t.statuses.APPROVED}
                    </span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1">
                      <XCircle size={16} /> {t.statuses.REJECTED}
                    </span>
                  )}
                </div>

                {submission.verification?.reason && (
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      {lang === "ar" ? "السبب:" : "Motif :"}
                    </span>
                    <p className="text-foreground mt-0.5">{submission.verification.reason}</p>
                  </div>
                )}

                <div className="text-muted-foreground border-t border-border/60 pt-2">
                  <p>
                    {lang === "ar" ? "تم الفحص بواسطة: " : "Examiné par : "}
                    {submission.verification?.verifier.profile?.firstName}{" "}
                    {submission.verification?.verifier.profile?.lastName}
                  </p>
                  <p className="mt-0.5">
                    {lang === "ar" ? "بتاريخ: " : "Le "}
                    {new Date(submission.verification?.verifiedAt || "").toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

