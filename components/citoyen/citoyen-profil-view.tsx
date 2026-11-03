"use client";

import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/citoyen/profile-form";
import { useLang } from "@/lib/i18n";

interface InitialDataProps {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  city: string | null;
  totalPoints: number;
  createdAt: string;
}

export function CitoyenProfilView({ initialData }: { initialData: InitialDataProps }) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "إعدادات الحساب" : "Paramètres du compte"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.common.profile}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "استعرض وحدّث بياناتك الشخصية ومعلومات الاتصال الخاصة بك."
            : "Consultez et mettez à jour vos coordonnées personnelles."}
        </p>
      </div>

      <ProfileForm initialData={initialData} />
    </div>
  );
}

