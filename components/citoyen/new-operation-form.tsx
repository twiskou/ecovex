"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UploadCloud,
  Loader2,
  CheckCircle,
  PlusCircle,
  MapPin,
  Recycle,
  Scale,
  FileText,
} from "lucide-react";
import { submitCollectionAction } from "@/app/actions/citoyen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { compressImage } from "@/lib/image-utils";

interface NewOperationFormProps {
  categories: { id: string; name: string; pointValue: number }[];
  collectionPoints: { id: string; name: string; city: string }[];
  preselectedPointId?: string;
  preselectedCategoryId?: string;
  classificationId?: string;
}

export function NewOperationForm({
  categories,
  collectionPoints,
  preselectedPointId,
  preselectedCategoryId,
  classificationId,
}: NewOperationFormProps) {
  const router = useRouter();
  const { lang, t } = useLang();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEstimated, setIsEstimated] = useState(true);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(lang === "ar" ? "حجم الصورة كبير جداً (الأقصى 5 ميغابايت)" : "L'image est trop volumineuse (maximum 5 Mo).");
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (photo) {
        // Compress client-side to ensure fast transmission and fit within Vercel limits
        const compressed = await compressImage(photo);
        formData.set("photo", compressed);
      }
      if (classificationId) {
        formData.set("classificationId", classificationId);
      }
      formData.set("estimatedQuantity", isEstimated ? "true" : "false");

      const result = await submitCollectionAction(formData);

      if (result.success && result.data) {
        toast.success(lang === "ar" ? "تم إرسال تصريح التجميع بنجاح!" : "Déclaration de collecte soumise avec succès !");
        router.push(`/citoyen/operations/${result.data.submissionId}`);
      } else {
        toast.error(result.error || (lang === "ar" ? "خطأ أثناء إرسال التصريح" : "Erreur lors de la soumission"));
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(lang === "ar" ? "تعذر إرسال التصريح. يرجى المحاولة لاحقاً." : "Impossible d'envoyer la déclaration. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-start">
        <CardTitle className="text-xl flex items-center gap-2">
          <PlusCircle size={20} className="text-primary rtl-mirror" />
          {t.citoyen.newOpTitle}
        </CardTitle>
        <CardDescription>
          {t.citoyen.newOpSub}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Point de collecte */}
          <div className="space-y-1.5">
            <label htmlFor="collectionPointId" className="text-sm font-medium text-foreground flex items-center gap-1.5 text-start">
              <MapPin size={16} className="text-primary" />
              {t.citoyen.selectPoint} *
            </label>
            <select
              id="collectionPointId"
              name="collectionPointId"
              defaultValue={preselectedPointId || ""}
              required
              disabled={loading}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:ring-2 focus:ring-ring/50 outline-none text-start"
            >
              <option value="" disabled>{lang === "ar" ? "اختر نقطة تجميع معتمدة" : "Sélectionnez un point de collecte"}</option>
              {collectionPoints.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.name} ({cp.city})
                </option>
              ))}
            </select>
          </div>

          {/* Catégorie de déchet */}
          <div className="space-y-1.5">
            <label htmlFor="categoryId" className="text-sm font-medium text-foreground flex items-center gap-1.5 text-start">
              <Recycle size={16} className="text-primary" />
              {t.citoyen.selectCategory} *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={preselectedCategoryId || ""}
              required
              disabled={loading}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:border-ring focus:ring-2 focus:ring-ring/50 outline-none text-start"
            >
              <option value="" disabled>{lang === "ar" ? "اختر فئة النفايات" : "Sélectionnez une catégorie"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (+{cat.pointValue} {lang === "ar" ? "نقاط / كغ" : "pts / kg"})
                </option>
              ))}
            </select>
          </div>

          {/* Quantité & Mode d'estimation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="quantityKg" className="text-sm font-medium text-foreground flex items-center gap-1.5 text-start">
                <Scale size={16} className="text-primary" />
                {t.citoyen.estimatedWeight}
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsEstimated(true)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    isEstimated ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {lang === "ar" ? "تقدير تقريبي" : "Estimation"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEstimated(false)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    !isEstimated ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {lang === "ar" ? "وزن دقيق" : "Pesée exacte"}
                </button>
              </div>
            </div>
            <Input
              id="quantityKg"
              name="quantityKg"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Ex: 2.5"
              disabled={loading}
              className="text-start"
            />
            <p className="text-xs text-muted-foreground text-start">
              {isEstimated
                ? (lang === "ar"
                    ? "كمية تقديرية من طرفك. يمكن للمحقق ضبطها حسب الوزن الفعلي عند الفحص."
                    : "Quantité estimée par vos soins. Le vérificateur pourra ajuster selon le dépôt réel.")
                : (lang === "ar"
                    ? "كمية موزونة بدقة على ميزان نقطة التجميع."
                    : "Quantité pesée à la balance du point de collecte.")}
            </p>
          </div>

          {/* Photo de preuve */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5 text-start">
              <UploadCloud size={16} className="text-primary" />
              {t.citoyen.proofPhoto}
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-muted/10">
              {preview ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-border">
                    <Image src={preview} alt="Preuve" fill unoptimized className="object-cover" />
                  </div>
                  <label className="mt-2 cursor-pointer text-xs font-semibold text-primary hover:underline">
                    {lang === "ar" ? "استبدال الصورة" : "Remplacer la photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="sr-only"
                      disabled={loading}
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center py-4">
                  <UploadCloud size={24} className="text-muted-foreground mb-1" />
                  <span className="text-xs font-medium text-foreground">
                    {lang === "ar" ? "إرفاق صورة إثبات التسليم" : "Ajouter une photo de preuve"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t.citoyen.proofPhotoHelp}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Notes optionnelles */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-foreground flex items-center gap-1.5 text-start">
              <FileText size={16} className="text-primary" />
              {lang === "ar" ? "ملاحظات إضافية (اختياري)" : "Remarques ou observations (optionnel)"}
            </label>
            <Textarea
              id="notes"
              name="notes"
              placeholder={lang === "ar" ? "مثال: تم الإيداع في الحاوية الخضراء رقم 2..." : "Ex: Dépôt effectué dans le bac vert n°2..."}
              rows={3}
              disabled={loading}
              className="resize-none text-start"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2 font-medium" size="lg">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t.citoyen.submitting}
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                {t.citoyen.submitOp}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
