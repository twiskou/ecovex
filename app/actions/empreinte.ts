"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// CO2 emission avoidance factors (kg CO2 eq saved per kg of material recycled / diverted)
// Sources: ADEME / EPA WARM models
const CO2_FACTORS: Record<string, number> = {
  plastique: 1.5,
  plastic: 1.5,
  "papier / carton": 0.9,
  papier: 0.9,
  carton: 0.9,
  verre: 0.35,
  glass: 0.35,
  métal: 2.1,
  metal: 2.1,
  organique: 0.5,
  organic: 0.5,
  électronique: 1.8,
  textile: 1.2,
  dangereux: 0.8,
};

function getCo2FactorForCategory(categoryName: string): number {
  const norm = categoryName.toLowerCase().trim();
  for (const [key, factor] of Object.entries(CO2_FACTORS)) {
    if (norm.includes(key)) return factor;
  }
  return 0.7; // default average
}

export interface FootprintSummary {
  totalDeclaredKg: number;
  totalValidatedKg: number;
  pendingKg: number;
  rejectedKg: number;
  totalOperationsCount: number;
  approvedOperationsCount: number;
  pendingOperationsCount: number;
  estimatedCo2AvoidedKg: number;
  treesEquivalent: number;
  carKmEquivalent: number;
}

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  color: string;
  iconName: string | null;
  validatedKg: number;
  declaredKg: number;
  percentage: number;
  operationsCount: number;
  co2AvoidedKg: number;
}

export interface TimelinePoint {
  label: string;
  labelAr: string;
  validatedKg: number;
  declaredKg: number;
  count: number;
}

export interface LocalComparisonData {
  hasCity: boolean;
  cityName: string | null;
  hasEnoughData: boolean;
  cityCitizenCount: number;
  cityAvgValidatedKg: number;
  userValidatedKg: number;
  differenceKg: number;
  percentageDiff: number; // e.g. +15% or -10%
}

export interface EcologicalAdvice {
  topCategoryName: string | null;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  actionFr: string;
  actionAr: string;
  iconName: string;
}

export interface EcologicalGoalData {
  id: string | null;
  targetKg: number;
  currentKg: number;
  period: string;
  progressPercent: number;
  isAchieved: boolean;
}

export interface FootprintFullData {
  summary: FootprintSummary;
  categories: CategoryBreakdownItem[];
  timeline: {
    week: TimelinePoint[];
    month: TimelinePoint[];
    year: TimelinePoint[];
  };
  comparison: LocalComparisonData;
  advice: EcologicalAdvice[];
  goal: EcologicalGoalData | null;
  userCity: string | null;
}

export async function getFootprintDataAction(): Promise<{
  success: boolean;
  data?: FootprintFullData;
  error?: string;
}> {
  try {
    const session = await requireAuth();
    if (!session) {
      return { success: false, error: "Non autorisé" };
    }

    const userId = session.userId;

    // 1. Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        ecologicalGoals: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const userCity = user?.profile?.city?.trim() || null;

    // 2. Fetch all citizen submissions with category details
    const submissions = await prisma.collectionSubmission.findMany({
      where: { citizenId: userId },
      include: {
        category: true,
        collectionPoint: true,
      },
      orderBy: { submittedAt: "asc" },
    });

    // 3. Compute Summary Metrics
    let totalDeclaredKg = 0;
    let totalValidatedKg = 0;
    let pendingKg = 0;
    let rejectedKg = 0;
    let approvedOps = 0;
    let pendingOps = 0;

    for (const sub of submissions) {
      const kg = sub.quantityKg || 0;
      totalDeclaredKg += kg;

      if (sub.status === "APPROVED") {
        totalValidatedKg += kg;
        approvedOps += 1;
      } else if (sub.status === "PENDING") {
        pendingKg += kg;
        pendingOps += 1;
      } else if (sub.status === "REJECTED") {
        rejectedKg += kg;
      }
    }

    // 4. Compute Category Breakdown & CO2
    const categoryMap = new Map<
      string,
      {
        id: string;
        name: string;
        color: string;
        iconName: string | null;
        validatedKg: number;
        declaredKg: number;
        operationsCount: number;
      }
    >();

    let totalCo2Avoided = 0;

    for (const sub of submissions) {
      const cat = sub.category;
      const catId = cat?.id || "other";
      const catName = cat?.name || "Autre";
      const catColor = cat?.color || "#10B981";
      const catIcon = cat?.iconName || null;
      const kg = sub.quantityKg || 0;

      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          id: catId,
          name: catName,
          color: catColor,
          iconName: catIcon,
          validatedKg: 0,
          declaredKg: 0,
          operationsCount: 0,
        });
      }

      const item = categoryMap.get(catId)!;
      item.declaredKg += kg;

      if (sub.status === "APPROVED") {
        item.validatedKg += kg;
        item.operationsCount += 1;

        const factor = getCo2FactorForCategory(catName);
        totalCo2Avoided += kg * factor;
      }
    }

    const categoriesBreakdown: CategoryBreakdownItem[] = Array.from(categoryMap.values())
      .filter((c) => c.validatedKg > 0 || c.declaredKg > 0)
      .map((c) => {
        const factor = getCo2FactorForCategory(c.name);
        const co2AvoidedKg = c.validatedKg * factor;
        const percentage = totalValidatedKg > 0
          ? Math.round((c.validatedKg / totalValidatedKg) * 100)
          : totalDeclaredKg > 0
            ? Math.round((c.declaredKg / totalDeclaredKg) * 100)
            : 0;

        return {
          id: c.id,
          name: c.name,
          color: c.color,
          iconName: c.iconName,
          validatedKg: Math.round(c.validatedKg * 10) / 10,
          declaredKg: Math.round(c.declaredKg * 10) / 10,
          percentage,
          operationsCount: c.operationsCount,
          co2AvoidedKg: Math.round(co2AvoidedKg * 10) / 10,
        };
      })
      .sort((a, b) => b.validatedKg - a.validatedKg);

    // Environmental equivalents
    // 1 mature tree absorbs ~22kg of CO2 per year
    // 1 km by average petrol car produces ~0.12 kg CO2
    const treesEquivalent = Math.round((totalCo2Avoided / 22) * 10) / 10;
    const carKmEquivalent = Math.round(totalCo2Avoided / 0.12);

    // 5. Compute Timeline Evolution
    const now = new Date();

    // Week: last 7 days
    const weekPoints: TimelinePoint[] = [];
    const dayNamesFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const dayNamesAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      let valKg = 0;
      let decKg = 0;
      let cnt = 0;

      for (const sub of submissions) {
        const subDate = new Date(sub.submittedAt);
        if (subDate >= startOfDay && subDate <= endOfDay) {
          decKg += sub.quantityKg || 0;
          if (sub.status === "APPROVED") {
            valKg += sub.quantityKg || 0;
            cnt += 1;
          }
        }
      }

      const dayIdx = d.getDay();
      weekPoints.push({
        label: `${dayNamesFr[dayIdx]} ${d.getDate()}`,
        labelAr: `${dayNamesAr[dayIdx]} ${d.getDate()}`,
        validatedKg: Math.round(valKg * 10) / 10,
        declaredKg: Math.round(decKg * 10) / 10,
        count: cnt,
      });
    }

    // Month: last 6 months
    const monthPoints: TimelinePoint[] = [];
    const monthNamesFr = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const monthNamesAr = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    for (let i = 5; i >= 0; i--) {
      const targetYear = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const targetMonth = (now.getMonth() - i + 12) % 12;

      const startOfMonth = new Date(targetYear, targetMonth, 1);
      const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

      let valKg = 0;
      let decKg = 0;
      let cnt = 0;

      for (const sub of submissions) {
        const subDate = new Date(sub.submittedAt);
        if (subDate >= startOfMonth && subDate <= endOfMonth) {
          decKg += sub.quantityKg || 0;
          if (sub.status === "APPROVED") {
            valKg += sub.quantityKg || 0;
            cnt += 1;
          }
        }
      }

      monthPoints.push({
        label: `${monthNamesFr[targetMonth]} ${targetYear}`,
        labelAr: `${monthNamesAr[targetMonth]} ${targetYear}`,
        validatedKg: Math.round(valKg * 10) / 10,
        declaredKg: Math.round(decKg * 10) / 10,
        count: cnt,
      });
    }

    // Year: last 3 years
    const yearPoints: TimelinePoint[] = [];
    for (let i = 2; i >= 0; i--) {
      const yr = now.getFullYear() - i;
      const startOfYear = new Date(yr, 0, 1);
      const endOfYear = new Date(yr, 11, 31, 23, 59, 59, 999);

      let valKg = 0;
      let decKg = 0;
      let cnt = 0;

      for (const sub of submissions) {
        const subDate = new Date(sub.submittedAt);
        if (subDate >= startOfYear && subDate <= endOfYear) {
          decKg += sub.quantityKg || 0;
          if (sub.status === "APPROVED") {
            valKg += sub.quantityKg || 0;
            cnt += 1;
          }
        }
      }

      yearPoints.push({
        label: `${yr}`,
        labelAr: `${yr}`,
        validatedKg: Math.round(valKg * 10) / 10,
        declaredKg: Math.round(decKg * 10) / 10,
        count: cnt,
      });
    }

    // 6. Local Community Comparison (Strict real data with anonymity & minimum sample threshold)
    let comparisonData: LocalComparisonData = {
      hasCity: !!userCity,
      cityName: userCity,
      hasEnoughData: false,
      cityCitizenCount: 0,
      cityAvgValidatedKg: 0,
      userValidatedKg: Math.round(totalValidatedKg * 10) / 10,
      differenceKg: 0,
      percentageDiff: 0,
    };

    if (userCity) {
      // Find other citizens in the same city
      const otherProfilesInCity = await prisma.userProfile.findMany({
        where: {
          city: {
            equals: userCity,
          },
        },
        select: { userId: true },
      });

      const citizenIdsInCity = otherProfilesInCity.map((p) => p.userId);

      // Only count if there are at least 2 distinct citizens in the city for anonymity and realistic average
      if (citizenIdsInCity.length >= 2) {
        const citySubmissions = await prisma.collectionSubmission.findMany({
          where: {
            citizenId: { in: citizenIdsInCity },
            status: "APPROVED",
          },
          select: { citizenId: true, quantityKg: true },
        });

        // Group total approved per citizen in this city
        const totalsPerCitizen = new Map<string, number>();
        for (const s of citySubmissions) {
          const prev = totalsPerCitizen.get(s.citizenId) || 0;
          totalsPerCitizen.set(s.citizenId, prev + (s.quantityKg || 0));
        }

        const distinctActiveCitizens = totalsPerCitizen.size;

        if (distinctActiveCitizens >= 2) {
          let citySum = 0;
          for (const total of totalsPerCitizen.values()) {
            citySum += total;
          }
          const cityAvg = citySum / distinctActiveCitizens;
          const diff = totalValidatedKg - cityAvg;
          const pct = cityAvg > 0 ? Math.round((diff / cityAvg) * 100) : 0;

          comparisonData = {
            hasCity: true,
            cityName: userCity,
            hasEnoughData: true,
            cityCitizenCount: distinctActiveCitizens,
            cityAvgValidatedKg: Math.round(cityAvg * 10) / 10,
            userValidatedKg: Math.round(totalValidatedKg * 10) / 10,
            differenceKg: Math.round(diff * 10) / 10,
            percentageDiff: pct,
          };
        } else {
          comparisonData.cityCitizenCount = distinctActiveCitizens;
        }
      }
    }

    // 7. Personalized Ecological Advice (based on real highest category)
    const adviceList: EcologicalAdvice[] = [];
    const topCat = categoriesBreakdown.length > 0 ? categoriesBreakdown[0] : null;

    if (topCat) {
      const nameLower = topCat.name.toLowerCase();
      if (nameLower.includes("plastique") || nameLower.includes("plastic")) {
        adviceList.push({
          topCategoryName: topCat.name,
          titleFr: "Réduire les plastiques à usage unique",
          titleAr: "الحد من استخدام البلاستيك أحادي الاستعمال",
          descriptionFr: `Le plastique représente ${topCat.percentage}% de vos dépôts. En adoptant une gourde en inox et des sacs en tissu réutilisables, vous pouvez réduire votre volume plastique de 40% dès ce mois-ci.`,
          descriptionAr: `يشكل البلاستيك ${topCat.percentage}% من إجمالي إيداعاتك. باستخدام قارورة ماء معدنية وحقائب قماشية قابلة لإعادة الاستخدام، يمكنك خفض حجم نفاياتك البلاستيكية بنسبة 40% هذا الشهر.`,
          actionFr: "Privilégier le vrac et refuser les emballages jetables.",
          actionAr: "تفضيل الشراء بالوزن والحد من العبوات والأكياس البلاستيكية.",
          iconName: "ShieldAlert",
        });
      } else if (nameLower.includes("papier") || nameLower.includes("carton")) {
        adviceList.push({
          topCategoryName: topCat.name,
          titleFr: "Optimiser et numériser vos papiers",
          titleAr: "ترشيد استهلاك الورق والتحول الرقمي",
          descriptionFr: `Le papier et carton constituent ${topCat.percentage}% de votre tri. Pensez à réutiliser les cartons de livraison pour vos envois ou rangement, et activez les factures électroniques.`,
          descriptionAr: `يمثل الورق والكرتون ${topCat.percentage}% من فرزك. أعد استخدام صناديق التوصيل للتخزين، واعتمد الفواتير الرقمية لتقليل المخلفات الورقية.`,
          actionFr: "Apposer un autocollant Stop-Pub et recycler les brouillons.",
          actionAr: "استخدام الورق من الجهتين وتفضيل الوثائق الرقمية.",
          iconName: "FileCheck",
        });
      } else if (nameLower.includes("verre") || nameLower.includes("glass")) {
        adviceList.push({
          topCategoryName: topCat.name,
          titleFr: "La consigne et réemploi du verre",
          titleAr: "إعادة استخدام وتدوير الزجاج اللانهائي",
          descriptionFr: `Le verre est recyclable à 100% et à l'infini ! Privilégiez les bocaux en verre pour conserver vos aliments en vrac ou cherchez les commerces pratiquant la consigne.`,
          descriptionAr: `الزجاج مادة قابلة لإعادة التدوير بنسبة 100% وإلى ما لا نهاية! أعد استخدام البرطمانات الزجاجية لتخزين الحبوب والمؤونة المنزلية.`,
          actionFr: "Rincer sommairement les bocaux sans retirer les étiquettes.",
          actionAr: "شطف الأوعية الزجاجية وإزالة الأغطية المعدنية قبل الإيداع.",
          iconName: "Sparkles",
        });
      } else if (nameLower.includes("organique") || nameLower.includes("alimentaire")) {
        adviceList.push({
          topCategoryName: topCat.name,
          titleFr: "Compostage et valorisation des biodéchets",
          titleAr: "السماد العضوي وتثمين المخلفات الغذائية",
          descriptionFr: `Les biodéchets représentent ${topCat.percentage}% de vos matières. Le compostage individuel ou collectif permet de nourrir les sols locaux tout en évitant l'enfouissement.`,
          descriptionAr: `تمثل المخلفات العضوية ${topCat.percentage}% من نشاطك. يساعد التسميد المنزلي في تغذية التربة وتجنب انبعاثات غاز الميثان في المفرغات.`,
          actionFr: "Séparer épluchures et marc de café pour enrichir vos plantes.",
          actionAr: "تجميع بقايا الخضار وقشور الفواكه لتغذية النباتات المنزلية.",
          iconName: "Leaf",
        });
      } else {
        adviceList.push({
          topCategoryName: topCat.name,
          titleFr: "Amplifier la valorisation de vos matières",
          titleAr: "تعزيز تثمين المواد المسترجعة",
          descriptionFr: `Votre engagement sur la catégorie ${topCat.name} (${topCat.percentage}%) contribue activement à l'économie circulaire locale. Continuez ainsi !`,
          descriptionAr: `التزامك الفعّال بفرز فئة ${topCat.name} (${topCat.percentage}%) يساهم بصورة حقيقية في تنشيط الاقتصاد الدائري والحفاظ على البيئة.`,
          actionFr: "Sensibiliser vos proches et voisins au geste de tri.",
          actionAr: "تشجيع الأصدقاء والجيران على المشاركة في فرز النفايات.",
          iconName: "CheckCircle",
        });
      }
    } else {
      adviceList.push({
        topCategoryName: null,
        titleFr: "Première étape : Déclarer votre première collecte",
        titleAr: "الخطوة الأولى: تسجيل أول عملية تجميع لك",
        descriptionFr: "Triez vos plastiques, cartons ou verres et déposez-les dans un point de collecte agréé pour activer votre tableau d'empreinte environnementale.",
        descriptionAr: "قم بفرز البلاستيك أو الكرتون أو الزجاج وأودعها في أقرب نقطة تجميع معتمدة لتبدأ في بناء سجلك البيئي الموثق.",
        actionFr: "Photographier vos déchets et déposer une déclaration.",
        actionAr: "تصوير النفايات وتقديم أول تصريح تجميع في التطبيق.",
        iconName: "Sparkles",
      });
    }

    // Always add a general practical tip
    adviceList.push({
      topCategoryName: null,
      titleFr: "Règle des 3R : Réduire, Réutiliser, Recycler",
      titleAr: "قاعدة الاستدامة الثلاثية: تقليل، إعادة استخدام، تدوير",
      descriptionFr: "Le meilleur déchet reste celui qu'on ne produit pas. Avant d'acheter, demandez-vous si l'objet est durable, réparable et facilement recyclable en fin de vie.",
      descriptionAr: "أفضل نفاية هي تلك التي لا ننتجها أصلاً. قبل الشراء، تأكد من جودة المنتج وإمكانية إصلاسه أو إعادة تدويره بسهولة بعد انتهاء صلاحيته.",
      actionFr: "Préférer les produits solides et réparables aux versions jetables.",
      actionAr: "اختيار المنتجات المعمرة وذات العبوات البسيطة والصديقة للبيئة.",
      iconName: "Recycle",
    });

    // 8. User Ecological Goal calculation
    const activeGoalRecord = user?.ecologicalGoals?.[0] || null;
    let goalData: EcologicalGoalData | null = null;

    if (activeGoalRecord) {
      // Calculate current month's validated quantity
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      let currentMonthValidatedKg = 0;

      for (const sub of submissions) {
        if (sub.status === "APPROVED" && new Date(sub.submittedAt) >= startOfCurrentMonth) {
          currentMonthValidatedKg += sub.quantityKg || 0;
        }
      }

      const targetKg = activeGoalRecord.targetKg;
      const progressPercent = targetKg > 0
        ? Math.min(100, Math.round((currentMonthValidatedKg / targetKg) * 100))
        : 0;

      goalData = {
        id: activeGoalRecord.id,
        targetKg,
        currentKg: Math.round(currentMonthValidatedKg * 10) / 10,
        period: activeGoalRecord.period,
        progressPercent,
        isAchieved: currentMonthValidatedKg >= targetKg,
      };
    }

    return {
      success: true,
      data: {
        summary: {
          totalDeclaredKg: Math.round(totalDeclaredKg * 10) / 10,
          totalValidatedKg: Math.round(totalValidatedKg * 10) / 10,
          pendingKg: Math.round(pendingKg * 10) / 10,
          rejectedKg: Math.round(rejectedKg * 10) / 10,
          totalOperationsCount: submissions.length,
          approvedOperationsCount: approvedOps,
          pendingOperationsCount: pendingOps,
          estimatedCo2AvoidedKg: Math.round(totalCo2Avoided * 10) / 10,
          treesEquivalent,
          carKmEquivalent,
        },
        categories: categoriesBreakdown,
        timeline: {
          week: weekPoints,
          month: monthPoints,
          year: yearPoints,
        },
        comparison: comparisonData,
        advice: adviceList,
        goal: goalData,
        userCity,
      },
    };
  } catch (err: any) {
    console.error("[getFootprintDataAction] Error:", err);
    return {
      success: false,
      error: err?.message || "Impossible de charger les statistiques d'empreinte écologique.",
    };
  }
}

/**
 * Server action to create or update the citizen's ecological monthly goal
 */
export async function saveEcologicalGoalAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await requireAuth();
    if (!session) {
      return { success: false, error: "Vous devez être connecté." };
    }

    const targetKgRaw = formData.get("targetKg");
    const targetKg = parseFloat(String(targetKgRaw));

    if (isNaN(targetKg) || targetKg <= 0 || targetKg > 5000) {
      return {
        success: false,
        error: "Veuillez saisir un objectif valide supérieur à 0 et inférieur à 5000 kg.",
      };
    }

    // Upsert or create
    const existing = await prisma.ecologicalGoal.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      await prisma.ecologicalGoal.update({
        where: { id: existing.id },
        data: {
          targetKg,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.ecologicalGoal.create({
        data: {
          userId: session.userId,
          targetKg,
          period: "MONTHLY",
        },
      });
    }

    revalidatePath("/citoyen/empreinte-ecologique");
    return { success: true };
  } catch (err: any) {
    console.error("[saveEcologicalGoalAction] Error:", err);
    return {
      success: false,
      error: "Erreur lors de la sauvegarde de l'objectif écologique.",
    };
  }
}

