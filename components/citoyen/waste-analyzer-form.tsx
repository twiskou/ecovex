"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  UploadCloud,
  Info,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { classifyWastePhotoAction } from "@/app/actions/citoyen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { getCategoryLocalized } from "@/lib/collection-points-i18n";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { compressImage } from "@/lib/image-utils";

export function WasteAnalyzerForm() {
  const { lang, t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    imageUrl: string;
    categoryName: string;
    categoryId: string | null;
    confidence: number;
    status: string;
    disclaimer: string;
    itemIdentified?: string;
    material?: string;
    sortingAdvice?: string;
    isAiPowered?: boolean;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        toast.error(lang === "ar" ? "حجم الصورة كبير جداً (الأقصى 10 ميغابايت)" : "L'image est trop volumineuse (maximum 10 Mo).");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error(lang === "ar" ? "يرجى اختيار أو التقاط صورة أولاً." : "Veuillez sélectionner ou capturer une photo.");
      return;
    }

    setLoading(true);

    try {
      // Compress client-side to ensure fast upload and avoid Vercel body limits
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("photo", compressedFile);

      const res = await classifyWastePhotoAction(formData);

      if (res.success && res.data) {
        setResult(res.data);
        toast.success(lang === "ar" ? "تم التحليل بنجاح!" : "Analyse terminée !");
      } else {
        toast.error(res.error || (lang === "ar" ? "حدث خطأ أثناء التحليل." : "Une erreur est survenue lors de l'analyse."));
      }
    } catch (err: any) {
      console.error("Analysis client error:", err);
      toast.error(lang === "ar" ? "تعذر إكمال التحليل. يرجى المحاولة مرة أخرى." : "Impossible de terminer l'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera size={20} className="text-primary" />
            {lang === "ar" ? "التقاط أو رفع صورة النفاية" : "Scanner ou importer une photo"}
          </CardTitle>
          <CardDescription>
            {lang === "ar" ? "الصيغ المقبولة: JPG, PNG, WEBP. الحجم الأقصى: 5 ميغابايت." : "Formats acceptés : JPG, PNG, WEBP. Taille max : 5 Mo."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors bg-muted/10 relative">
            {preview ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm h-64 rounded-xl overflow-hidden border border-border shadow-xs">
                  <Image
                    src={preview}
                    alt={lang === "ar" ? "معاينة النفاية" : "Aperçu du déchet"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <label className="mt-4 cursor-pointer text-xs font-semibold text-primary hover:underline">
                  {lang === "ar" ? "تغيير الصورة" : "Changer de photo"}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={loading}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <UploadCloud size={28} />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {lang === "ar" ? "التقاط صورة بكاميرا الهاتف أو اختيار ملف" : "Prendre une photo ou importer un fichier"}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {lang === "ar" ? "اسحب الملف هنا أو انقر للتصفح" : "Glissez-déposez ou cliquez ici"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={loading}
                />
              </label>
            )}
          </div>

          {/* Action Button */}
          {preview && !result && (
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full gap-2 font-medium"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t.citoyen.analyzing}
                </>
              ) : (
                <>
                  <Camera size={18} />
                  {t.citoyen.analyzeBtn}
                </>
              )}
            </Button>
          )}

          {/* Results view */}
          {result && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4 text-start">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {lang === "ar" ? "نتيجة التعرف والتصنيف" : "Résultat de l'identification"}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 flex items-center gap-1 py-0.5">
                      <Sparkles size={11} />
                      {lang === "ar" ? "مدعوم بـ Google Gemini Vision" : "Propulsé par Google Gemini Vision"}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {getCategoryLocalized(result.categoryName, lang)}
                  </h3>
                </div>
                <Badge
                  variant={result.status === "COMPLETED" ? "default" : "secondary"}
                  className="text-xs font-medium"
                >
                  {result.status === "COMPLETED"
                    ? (lang === "ar" ? "مُحدد بدقة" : "Identifié")
                    : (lang === "ar" ? "غير مؤكد" : "Incertain")}
                </Badge>
              </div>

              {/* Gemini Vision details: Item identified & Material */}
              {(result.itemIdentified || result.material) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-background/90 border border-border/70 text-xs">
                  {result.itemIdentified && (
                    <div>
                      <span className="text-muted-foreground block font-medium">
                        {lang === "ar" ? "الشيء المحدد:" : "Objet détecté :"}
                      </span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {result.itemIdentified}
                      </span>
                    </div>
                  )}
                  {result.material && (
                    <div>
                      <span className="text-muted-foreground block font-medium">
                        {lang === "ar" ? "المادة المكونة:" : "Matière principale :"}
                      </span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {result.material}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Confidence Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {lang === "ar" ? "مؤشر الثقة بالتعرف:" : "Indice de confiance :"}
                  </span>
                  <span className="font-bold text-foreground">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.confidence >= 0.70 ? "bg-primary" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  />
                </div>
              </div>

              {/* Sorting Advice from Gemini */}
              {result.sortingAdvice && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-800 dark:text-emerald-400">
                      {lang === "ar" ? "نصيحة الفرز الذكية :" : "Conseil pratique de tri :"}
                    </span>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">
                      {result.sortingAdvice}
                    </p>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/80 border border-border/60 text-xs text-muted-foreground">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {lang === "ar"
                    ? "تنبيه: التحديد الصادر عن النموذج استرشادي ويخضع للتحقق المباشر من قبل المحقق عند تسليم النفايات."
                    : result.disclaimer}
                </p>
              </div>

              {/* Next step CTA */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 gap-2">
                  <Link
                    href={`/citoyen/operations/nouvelle?classificationId=${result.id}&categoryId=${result.categoryId || ""}`}
                  >
                    <PlusCircle size={16} />
                    {lang === "ar" ? "التصريح بهذه العملية الآن" : "Déclarer cette collecte"}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="gap-2"
                >
                  {lang === "ar" ? "تحليل نفاية أخرى" : "Analyser un autre déchet"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
