"use client";

import { useState } from "react";
import { User, Award, Check, Loader2 } from "lucide-react";
import { updateProfileAction } from "@/app/actions/citoyen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

interface ProfileFormProps {
  initialData: {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    city: string | null;
    totalPoints: number;
    createdAt: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { lang, t } = useLang();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    if (result.success) {
      toast.success(lang === "ar" ? "تم تحديث الملف الشخصي بنجاح!" : "Profil mis à jour avec succès !");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      toast.error(result.error || (lang === "ar" ? "خطأ أثناء التحديث" : "Erreur lors de la mise à jour"));
    }
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar Overview */}
      <Card className="lg:col-span-1">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary border-2 border-primary/20">
              <User size={36} />
            </div>
          </div>
          <CardTitle className="text-xl">
            {initialData.firstName} {initialData.lastName}
          </CardTitle>
          <CardDescription className="text-xs">{initialData.email}</CardDescription>
          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="default" className="text-xs">
              {t.roles.CITIZEN}
            </Badge>
            <Badge variant="secondary" className="text-xs gap-1">
              <Award size={12} className="text-primary" />
              {initialData.totalPoints} {t.common.points}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="border-t border-border/60 pt-4 text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span>{lang === "ar" ? "تاريخ الانضمام:" : "Membre depuis :"}</span>
            <span className="font-medium text-foreground">
              {new Date(initialData.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{lang === "ar" ? "حالة الحساب:" : "Statut du compte :"}</span>
            <span className="font-medium text-emerald-600">
              {lang === "ar" ? "نشط ومفعل" : "Actif et vérifié"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Form */}
      <Card className="lg:col-span-2">
        <CardHeader className="text-start">
          <CardTitle className="text-lg">
            {lang === "ar" ? "تعديل البيانات الشخصية" : "Modifier mes informations"}
          </CardTitle>
          <CardDescription>
            {lang === "ar"
              ? "تحكم في بياناتك الشخصية المسجلة على حساب إيكوفيكس."
              : "Gérez vos informations personnelles enregistrées sur votre compte ECOVEX."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground block text-start">
                  {t.auth.firstName}
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={initialData.firstName}
                  required
                  disabled={loading}
                  className="text-start"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground block text-start">
                  {t.auth.lastName}
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={initialData.lastName}
                  required
                  disabled={loading}
                  className="text-start"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground block text-start">
                {t.auth.email}
              </label>
              <Input
                id="email"
                type="email"
                value={initialData.email}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed text-start"
              />
              <p className="text-xs text-muted-foreground text-start">
                {lang === "ar"
                  ? "لا يمكن تعديل البريد الإلكتروني مباشرة لأسباب أمنية."
                  : "L'adresse email ne peut pas être modifiée directement pour des raisons de sécurité."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-foreground block text-start">
                  {lang === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+213 ..."
                  defaultValue={initialData.phone || ""}
                  disabled={loading}
                  className="text-start"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium text-foreground block text-start">
                  {lang === "ar" ? "المدينة / الولاية" : "Ville de résidence"}
                </label>
                <Input
                  id="city"
                  name="city"
                  placeholder={lang === "ar" ? "مثال: الجزائر، وهران، إلخ" : "Ex: Alger, Oran, etc."}
                  defaultValue={initialData.city || ""}
                  disabled={loading}
                  className="text-start"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {success ? (
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <Check size={14} /> {lang === "ar" ? "تم حفظ التعديلات بنجاح" : "Modifications enregistrées"}
                </span>
              ) : (
                <span />
              )}

              <Button type="submit" disabled={loading} className="gap-2 font-medium">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {lang === "ar" ? "جارٍ الحفظ..." : "Enregistrement..."}
                  </>
                ) : (
                  <>{t.common.save}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
