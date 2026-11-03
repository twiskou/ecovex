"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PlusCircle, Info, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { getCategoryLocalized } from "@/lib/collection-points-i18n";

interface ClassificationItem {
  id: string;
  imageUrl: string;
  predictedCategory: string | null;
  confidence: number | null;
  status: string;
  rawResult?: string | null;
  createdAt: Date;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
    pointValue: number;
  } | null;
}

export function CitoyenResultatAnalyseView({
  classification,
}: {
  classification: ClassificationItem;
}) {
  const { lang, t } = useLang();

  const confidencePct = classification.confidence
    ? Math.round(classification.confidence * 100)
    : 0;

  let extraData: {
    itemIdentified?: string;
    material?: string;
    sortingAdvice?: string;
    isAiPowered?: boolean;
  } = {};

  try {
    if (classification.rawResult) {
      extraData = JSON.parse(classification.rawResult);
    }
  } catch {
    extraData = {};
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/citoyen/analyser">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t.common.back}
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground font-mono">
          {lang === "ar" ? "تحليل #" : "Analyse #"}{classification.id.slice(-6)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {lang === "ar" ? "تفاصيل التحليل بالذكاء الاصطناعي" : "Détails de l'analyse"}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar size={14} />
                {lang === "ar" ? "تاريخ التحليل: " : "Analysé le "}
                {new Date(classification.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                {" "}
                {lang === "ar" ? "الساعة " : "à "}
                {new Date(classification.createdAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </CardDescription>
            </div>
            <Badge
              variant={classification.status === "COMPLETED" ? "default" : "secondary"}
              className="text-xs"
            >
              {classification.status === "COMPLETED"
                ? (lang === "ar" ? "تم التحديد بنجاح" : "Identifié")
                : (lang === "ar" ? "قيد المعالجة" : "Incertain")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo */}
          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-border shadow-xs">
            <Image
              src={classification.imageUrl}
              alt={lang === "ar" ? "الصورة المحللة" : "Photo analysée"}
              fill
              className="object-contain bg-black/5"
            />
          </div>

          {/* Results summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {lang === "ar" ? "الفئة المعتمدة" : "Catégorie identifiée"}
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 flex items-center gap-1 py-0.5">
                  <Sparkles size={11} />
                  {lang === "ar" ? "Google Gemini Vision" : "Google Gemini Vision"}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">
                {getCategoryLocalized(classification.predictedCategory || "", lang) ||
                  (lang === "ar" ? "غير محدد بدقة" : "Non identifié")}
              </p>
              {classification.category && (
                <p className="text-xs text-primary font-medium mt-1">
                  {lang === "ar" ? "القيمة الأساسية: " : "Valeur de base : "}
                  {classification.category.pointValue} {t.common.points} / {t.common.kg}
                </p>
              )}
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {lang === "ar" ? "مستوى الثقة" : "Indice de confiance"}
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5">
                {confidencePct}%
              </p>
              <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    confidencePct >= 70 ? "bg-primary" : "bg-amber-500"
                  }`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Gemini Vision details if available */}
          {(extraData.itemIdentified || extraData.material) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-background border border-border/80 text-xs">
              {extraData.itemIdentified && (
                <div>
                  <span className="text-muted-foreground block font-medium">
                    {lang === "ar" ? "الشيء المحدد بدقة:" : "Objet identifié :"}
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {extraData.itemIdentified}
                  </span>
                </div>
              )}
              {extraData.material && (
                <div>
                  <span className="text-muted-foreground block font-medium">
                    {lang === "ar" ? "المادة المكتشفة:" : "Matière détectée :"}
                  </span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {extraData.material}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Sorting Advice */}
          {extraData.sortingAdvice && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-800 dark:text-emerald-400">
                  {lang === "ar" ? "إرشادات الفرز الذكية :" : "Conseil de préparation avant dépôt :"}
                </span>
                <p className="mt-0.5 leading-relaxed text-muted-foreground">
                  {extraData.sortingAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Extensibility & Transparency Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {lang === "ar"
                ? "هذه النتيجة هي توصية إرشادية مقدمة من وحدة الرؤية الحاسوبية لمساعدتك في فرز النفايات. يتم التحقق النهائي واعتماد النقاط من طرف المحققين عند نقطة التجميع."
                : "Ce résultat est une recommandation indicative fournie par le module de vision ECOVEX pour vous assister dans le tri. Il sera formellement vérifié lors du dépôt."}
            </p>
          </div>

          {/* Action */}
          <div className="pt-2">
            <Button asChild className="w-full gap-2 font-medium">
              <Link
                href={`/citoyen/operations/nouvelle?classificationId=${classification.id}&categoryId=${classification.categoryId || ""}`}
              >
                <PlusCircle size={16} />
                {lang === "ar"
                  ? "استخدام نتيجة هذا التحليل لإنشاء تصريح تجميع"
                  : "Utiliser cette analyse pour une déclaration de collecte"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

