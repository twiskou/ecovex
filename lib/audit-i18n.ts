import type { Lang } from "@/lib/i18n";

export interface ActionMetadata {
  labelFr: string;
  labelAr: string;
  category: "verification" | "submission" | "auth" | "admin" | "other";
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeColorClass: string;
  iconName: string;
}

export const AUDIT_ACTIONS_I18N: Record<string, ActionMetadata> = {
  VERIFY_APPROVE: {
    labelFr: "Approbation de collecte",
    labelAr: "اعتماد وتأكيد عملية تجميع",
    category: "verification",
    badgeVariant: "default",
    badgeColorClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    iconName: "CheckCircle",
  },
  VERIFY_REJECT: {
    labelFr: "Rejet de déclaration",
    labelAr: "رفض تصريح تجميع",
    category: "verification",
    badgeVariant: "destructive",
    badgeColorClass: "bg-destructive/15 text-destructive border-destructive/30",
    iconName: "XCircle",
  },
  SUBMIT_COLLECTION: {
    labelFr: "Déclaration de collecte",
    labelAr: "إيداع تصريح تجميع جديد",
    category: "submission",
    badgeVariant: "secondary",
    badgeColorClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    iconName: "UploadCloud",
  },
  CREATE_COLLECTION_POINT: {
    labelFr: "Création d'un point",
    labelAr: "إضافة نقطة تجميع جديدة",
    category: "admin",
    badgeVariant: "outline",
    badgeColorClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    iconName: "MapPin",
  },
  UPDATE_COLLECTION_POINT: {
    labelFr: "Mise à jour d'un point",
    labelAr: "تعديل بيانات نقطة التجميع",
    category: "admin",
    badgeVariant: "outline",
    badgeColorClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    iconName: "MapPin",
  },
  LOGIN: {
    labelFr: "Connexion utilisateur",
    labelAr: "تسجيل الدخول إلى الحساب",
    category: "auth",
    badgeVariant: "outline",
    badgeColorClass: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    iconName: "LogIn",
  },
  LOGOUT: {
    labelFr: "Déconnexion",
    labelAr: "تسجيل الخروج من المنصة",
    category: "auth",
    badgeVariant: "outline",
    badgeColorClass: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    iconName: "LogOut",
  },
  USER_REGISTER: {
    labelFr: "Création de compte",
    labelAr: "تسجيل حساب مواطن جديد",
    category: "auth",
    badgeVariant: "secondary",
    badgeColorClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    iconName: "UserCheck",
  },
  ADJUST_POINTS: {
    labelFr: "Ajustement de points",
    labelAr: "تعديل رصيد النقاط يدوياً",
    category: "admin",
    badgeVariant: "outline",
    badgeColorClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    iconName: "Coins",
  },
  UPDATE_USER_ROLE: {
    labelFr: "Modification de rôle",
    labelAr: "ترقية / تعديل صلاحيات المستخدم",
    category: "admin",
    badgeVariant: "outline",
    badgeColorClass: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    iconName: "Shield",
  },
};

export const AUDIT_ENTITIES_I18N: Record<string, { fr: string; ar: string }> = {
  CollectionSubmission: { fr: "Déclaration de collecte", ar: "تصريح تجميع" },
  CollectionPoint: { fr: "Point de collecte", ar: "نقطة تجميع" },
  User: { fr: "Utilisateur", ar: "حساب مستخدم" },
  PointTransaction: { fr: "Transaction de points", ar: "معاملة نقاط" },
  WasteCategory: { fr: "Catégorie de déchet", ar: "فئة نفايات" },
  Verification: { fr: "Décision de vérification", ar: "قرار الفحص" },
};

export function getActionMeta(action: string, lang: Lang): { label: string; meta: ActionMetadata } {
  const meta = AUDIT_ACTIONS_I18N[action] || {
    labelFr: action,
    labelAr: action,
    category: "other",
    badgeVariant: "outline",
    badgeColorClass: "bg-muted text-muted-foreground border-border",
    iconName: "Activity",
  };

  return {
    label: lang === "ar" ? meta.labelAr : meta.labelFr,
    meta,
  };
}

export function getEntityLocalized(entity: string | null, lang: Lang): string {
  if (!entity) return "—";
  const entry = AUDIT_ENTITIES_I18N[entity];
  if (entry) {
    return lang === "ar" ? entry.ar : entry.fr;
  }
  return entity;
}

export function parseAuditDetails(details: string | null, lang: Lang): {
  summary: string;
  badge?: { text: string; color: string };
  reason?: string;
  points?: number;
} {
  if (!details) {
    return { summary: lang === "ar" ? "لا توجد تفاصيل إضافية" : "Aucun détail complémentaire" };
  }

  // Format: "Décision: REJECTED. Points attribués: 0. Motif: ..."
  if (details.includes("Décision:")) {
    const isApproved = details.includes("Décision: APPROVED");
    const isRejected = details.includes("Décision: REJECTED");

    const pointsMatch = details.match(/Points attribués:\s*(\d+)/i);
    const points = pointsMatch ? parseInt(pointsMatch[1], 10) : undefined;

    const motifMatch = details.match(/Motif:\s*(.+)$/i);
    const reason = motifMatch ? motifMatch[1].trim() : undefined;

    let summary = "";
    if (isApproved) {
      summary = lang === "ar" ? `تم اعتماد العملية بنجاح (${points || 0} نقطة)` : `Opération validée avec succès (${points || 0} pts)`;
    } else if (isRejected) {
      summary = lang === "ar" ? "تم رفض العملية مع تسجيل السبب" : "Opération refusée avec motif consigné";
    } else {
      summary = details;
    }

    return {
      summary,
      badge: isApproved
        ? { text: lang === "ar" ? "معتمدة" : "Approuvée", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" }
        : { text: lang === "ar" ? "مرفوضة" : "Rejetée", color: "bg-destructive/15 text-destructive border-destructive/30" },
      reason: reason && reason !== "Aucun" && reason !== "null" ? reason : undefined,
      points,
    };
  }

  // Format: "Déclaration de collecte soumise pour la catégorie ..."
  if (details.includes("Déclaration de collecte soumise")) {
    return {
      summary: lang === "ar" ? "إيداع تصريح تجميع جديد بانتظار فحص المحقق" : "Nouvelle déclaration déposée en attente de vérification",
    };
  }

  // Format: "Nouveau point: risk à ANNABA"
  if (details.includes("Nouveau point:")) {
    return {
      summary: lang === "ar" ? `تمت إضافة نقطة تجميع جديدة: ${details.replace("Nouveau point:", "").trim()}` : details,
    };
  }

  return { summary: details };
}

