"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewPointForm } from "@/components/admin/new-point-form";
import { useLang } from "@/lib/i18n";

interface CategoryOption {
  id: string;
  name: string;
}

export function AdminNouveauPointView({ categories }: { categories: CategoryOption[] }) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/admin/points-collecte">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {lang === "ar" ? "العودة إلى نقاط التجميع" : "Retour aux points de collecte"}
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "موقع تجميع جديد" : "Nouveau site"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.admin.newPoint}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "أدخل الموقع الجغرافي الدقيق وفئات النفايات المسموح بتجميعها في هذا المركز."
            : "Renseignez la localisation géographique et les catégories de déchets admises."}
        </p>
      </div>

      <NewPointForm categories={categories} />
    </div>
  );
}

