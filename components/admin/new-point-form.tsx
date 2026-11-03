"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, Check } from "lucide-react";
import { createCollectionPointAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

interface NewPointFormProps {
  categories: { id: string; name: string }[];
}

export function NewPointForm({ categories }: NewPointFormProps) {
  const router = useRouter();
  const { lang, t } = useLang();
  const [loading, setLoading] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCategory = (catId: string) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    selectedCats.forEach((id) => formData.append("categoryIds", id));

    const res = await createCollectionPointAction(formData);

    if (res.success) {
      toast.success(lang === "ar" ? "تم إنشاء نقطة التجميع بنجاح!" : "Point de collecte créé avec succès !");
      router.push("/admin/points-collecte");
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ أثناء إنشاء النقطة" : "Erreur lors de la création"));
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-start">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          {t.admin.newPoint}
        </CardTitle>
        <CardDescription>
          {lang === "ar"
            ? "تسجيل موقع تجميع معتمد جديد أو مركز فرز تابع للمنصة."
            : "Enregistrez un nouveau site partenaire de dépôt ou centre de tri."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-start">
            <label htmlFor="name" className="text-xs font-semibold text-foreground block">
              {lang === "ar" ? "اسم نقطة التجميع *" : "Nom du point de collecte *"}
            </label>
            <Input id="name" name="name" required placeholder={lang === "ar" ? "مثال: مركز تجميع البلدية الجنوبي" : "Ex: Déchetterie Municipale Sud"} className="text-start" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-start">
              <label htmlFor="city" className="text-xs font-semibold text-foreground block">
                {lang === "ar" ? "المدينة / الولاية *" : "Ville *"}
              </label>
              <Input id="city" name="city" required placeholder={lang === "ar" ? "مثال: الجزائر" : "Ex: Alger"} className="text-start" />
            </div>

            <div className="space-y-1.5 text-start">
              <label htmlFor="address" className="text-xs font-semibold text-foreground block">
                {lang === "ar" ? "العنوان بالتفصيل *" : "Adresse exacte *"}
              </label>
              <Input id="address" name="address" required placeholder={lang === "ar" ? "مثال: 45 شارع الشهداء" : "Ex: 45 Boulevard des Martyrs"} className="text-start" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-start">
              <label htmlFor="latitude" className="text-xs font-semibold text-foreground block">
                {lang === "ar" ? "خط العرض GPS (اختياري)" : "Latitude GPS (optionnel)"}
              </label>
              <Input id="latitude" name="latitude" type="number" step="0.0001" placeholder="Ex: 36.7525" className="text-start" />
            </div>

            <div className="space-y-1.5 text-start">
              <label htmlFor="longitude" className="text-xs font-semibold text-foreground block">
                {lang === "ar" ? "خط الطول GPS (اختياري)" : "Longitude GPS (optionnel)"}
              </label>
              <Input id="longitude" name="longitude" type="number" step="0.0001" placeholder="Ex: 3.0420" className="text-start" />
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label htmlFor="description" className="text-xs font-semibold text-foreground block">
              {lang === "ar" ? "الوصف وأوقات العمل" : "Description et horaires d'ouverture"}
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder={lang === "ar" ? "مثال: مفتوح من الأحد إلى الخميس من 8:00 إلى 17:00." : "Ex: Ouvert du dimanche au jeudi de 8h à 17h."}
              rows={3}
              className="resize-none text-start"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60 text-start">
            <label className="text-xs font-semibold text-foreground block">
              {lang === "ar" ? "فئات النفايات المقبولة في هذا المركز" : "Catégories de déchets acceptées sur ce site"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const checked = selectedCats.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors text-start ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm flex items-center justify-center border shrink-0 ${
                        checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border/60">
            <Button type="submit" disabled={loading} className="gap-2 font-medium">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {lang === "ar" ? "حفظ نقطة التجميع" : "Enregistrer le point de collecte"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
