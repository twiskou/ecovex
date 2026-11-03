"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Power, Loader2 } from "lucide-react";
import { createCategoryAction, toggleCategoryStatusAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  pointValue: number;
  isActive: boolean;
  _count: {
    submissions: number;
  };
}

export function CategoriesManager({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const { lang, t } = useLang();
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = async (id: string) => {
    const res = await toggleCategoryStatusAction(id);
    if (res.success) {
      toast.success(lang === "ar" ? "تم تحديث حالة الفئة بنجاح." : "Statut de la catégorie mis à jour.");
      router.refresh();
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ في التحديث" : "Erreur de mise à jour"));
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createCategoryAction(formData);

    if (res.success) {
      toast.success(lang === "ar" ? "تم إنشاء فئة النفايات بنجاح!" : "Catégorie de déchet créée avec succès !");
      setShowAddForm(false);
      router.refresh();
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ في الإنشاء" : "Erreur de création"));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {lang === "ar" ? "إعدادات الفرز" : "Paramétrage du tri"}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {lang === "ar" ? "فئات النفايات وجدول النقاط" : "Catégories de déchets & Barème des points"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar"
              ? "تحديد وإدارة أنواع النفايات المقبولة على المنصة وقيم النقاط البيئية المقابلة لكل كيلوغرام."
              : "Configurez les types de déchets acceptés sur ECOVEX et les récompenses associées."}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 font-medium shrink-0">
          <Plus size={16} />
          {showAddForm
            ? (lang === "ar" ? "إغلاق النموذج" : "Fermer le formulaire")
            : t.admin.newCategory}
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <Card className="border-primary/30">
          <CardHeader className="text-start">
            <CardTitle className="text-base">
              {lang === "ar" ? "إضافة فئة نفايات جديدة" : "Ajouter une nouvelle catégorie de déchet"}
            </CardTitle>
            <CardDescription>
              {lang === "ar"
                ? "حدد قيمة النقاط الممنوحة لكل كيلوغرام يتم تجميعه."
                : "Définissez la valeur en points attribuée pour chaque kilogramme collecté."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-start">
                  <label htmlFor="name" className="text-xs font-semibold text-foreground block">
                    {lang === "ar" ? "اسم الفئة *" : "Nom de la catégorie *"}
                  </label>
                  <Input id="name" name="name" required placeholder={lang === "ar" ? "مثال: ألمنيوم" : "Ex: Aluminium"} className="text-start" />
                </div>

                <div className="space-y-1.5 text-start">
                  <label htmlFor="pointValue" className="text-xs font-semibold text-foreground block">
                    {lang === "ar" ? "قيمة النقاط (لكل كغ) *" : "Valeur en points (par kg) *"}
                  </label>
                  <Input
                    id="pointValue"
                    name="pointValue"
                    type="number"
                    min="1"
                    defaultValue="10"
                    required
                    className="text-start"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-start">
                  <label htmlFor="color" className="text-xs font-semibold text-foreground block">
                    {lang === "ar" ? "لون التمييز (Hex) *" : "Couleur d'identification (Hex) *"}
                  </label>
                  <Input id="color" name="color" defaultValue="#10B981" required className="text-start" />
                </div>

                <div className="space-y-1.5 text-start">
                  <label htmlFor="description" className="text-xs font-semibold text-foreground block">
                    {lang === "ar" ? "الوصف والإرشادات" : "Description indicative"}
                  </label>
                  <Input id="description" name="description" placeholder={lang === "ar" ? "مثال: علب معدنية، رقائق" : "Ex: Canettes, boîtes métalliques"} className="text-start" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  {t.common.cancel}
                </Button>
                <Button type="submit" disabled={loading} className="gap-2 font-medium">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {t.common.create}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الوصف" : "Description"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "معيار النقاط" : "Barème de points"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "العمليات المسجلة" : "Collectes enregistrées"}</th>
                  <th className="px-6 py-3.5 text-start">{t.common.status}</th>
                  <th className="px-6 py-3.5 text-end">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || "#10B981" }}
                        />
                        <span className="font-semibold text-foreground">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground text-start">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <Badge variant="secondary" className="font-bold text-primary text-xs">
                        +{cat.pointValue} {lang === "ar" ? "نقاط / كغ" : "pts / kg"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground font-medium whitespace-nowrap text-start">
                      {cat._count.submissions} {lang === "ar" ? "عملية" : "opérations"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
                        {cat.isActive
                          ? (lang === "ar" ? "نشطة" : "Active")
                          : (lang === "ar" ? "معطلة" : "Désactivée")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(cat.id)}
                        className="text-xs gap-1"
                      >
                        <Power size={13} />
                        {cat.isActive
                          ? (lang === "ar" ? "تعطيل" : "Désactiver")
                          : (lang === "ar" ? "تفعيل" : "Activer")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
