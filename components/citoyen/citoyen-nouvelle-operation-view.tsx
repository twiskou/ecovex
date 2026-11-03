"use client";

import { Badge } from "@/components/ui/badge";
import { NewOperationForm } from "@/components/citoyen/new-operation-form";
import { useLang } from "@/lib/i18n";

interface CategoryOption {
  id: string;
  name: string;
  pointValue: number;
}

interface PointOption {
  id: string;
  name: string;
  city: string;
}

interface NouvelleOperationViewProps {
  categories: CategoryOption[];
  collectionPoints: PointOption[];
  preselectedPointId?: string;
  preselectedCategoryId?: string;
  classificationId?: string;
}

export function CitoyenNouvelleOperationView({
  categories,
  collectionPoints,
  preselectedPointId,
  preselectedCategoryId,
  classificationId,
}: NouvelleOperationViewProps) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 text-start">
      <div className="max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "تثمين النفايات والمكافآت" : "Valorisation des déchets"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.citoyen.newOpTitle}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t.citoyen.newOpSub}
        </p>
      </div>

      <NewOperationForm
        categories={categories}
        collectionPoints={collectionPoints}
        preselectedPointId={preselectedPointId}
        preselectedCategoryId={preselectedCategoryId}
        classificationId={classificationId}
      />
    </div>
  );
}

