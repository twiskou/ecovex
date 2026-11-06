"use client";

import {
  Camera,
  MapPin,
  Star,
  Shield,
  BarChart3,
  Recycle,
  Users,
  ClipboardCheck,
  Bell,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export function FeaturesView() {
  const { lang, t } = useLang();

  const featuresByRole = [
    {
      role: lang === "ar" ? "للمواطنين" : "Pour les citoyens",
      icon: Users,
      features: [
        {
          icon: Camera,
          title: lang === "ar" ? "تحليل النفايات بالصورة" : "Analyse de déchets par photo",
          description:
            lang === "ar"
              ? "التقط صورة لنفاياتك وتعرف تلقائياً على فئتها المناسبة وطريقة فرزها السليمة لتوجيهك لأفضل نقطة تجميع."
              : "Prenez une photo de vos déchets pour obtenir une suggestion automatique de catégorie de tri. L'analyse vous aide à mieux identifier vos déchets avant de les déposer.",
        },
        {
          icon: MapPin,
          title: lang === "ar" ? "تحديد مواقع نقاط التجميع" : "Localisation des points de collecte",
          description:
            lang === "ar"
              ? "ابحث عن نقاط ومراكز التجميع القريبة منك على خريطة تفاعلية واضحة مع إمكانية التصفية حسب الفئة."
              : "Consultez la carte interactive des points de collecte disponibles près de chez vous. Filtrez par type de déchets acceptés.",
        },
        {
          icon: ClipboardCheck,
          title: lang === "ar" ? "تصريح بعملية تجميع" : "Déclaration de collecte",
          description:
            lang === "ar"
              ? "صرّح عن تسليمك للنفايات مع إرفاق صورة الإثبات ليتم فحصها والمصادقة عليها من قبل محقق معتمد."
              : "Déclarez vos opérations de collecte avec preuve photo. Vos déclarations sont examinées par un vérificateur avant validation.",
        },
        {
          icon: Star,
          title: lang === "ar" ? "نظام النقاط البيئية" : "Système de points écologiques",
          description:
            lang === "ar"
              ? "اكسب نقاطاً بيئية قيمة فور اعتماد كل عملية تسليم، وتابع رصيدك وسجل حركاتك لحظة بلحظة."
              : "Gagnez des points après validation de chaque opération approuvée. Consultez votre solde et votre historique de transactions.",
        },
        {
          icon: BarChart3,
          title: lang === "ar" ? "السجل والإحصاءات الشخصية" : "Historique et statistiques",
          description:
            lang === "ar"
              ? "تابع تطور مساهمتك البيئية: عدد العمليات، مجموع النقاط، وكميات النفايات التي ساهمت في تدويرها."
              : "Suivez l'évolution de votre activité écologique : nombre d'opérations, points accumulés, catégories traitées.",
        },
        {
          icon: Bell,
          title: lang === "ar" ? "الإشعارات والتنبيهات" : "Notifications",
          description:
            lang === "ar"
              ? "استلم تنبيهات فورية عند مراجعة وقبول أو رفض طلباتك مع توضيح أسباب القرار بكل شفافية."
              : "Recevez des notifications lors de la validation ou du rejet de vos opérations de collecte.",
        },
      ],
    },
    {
      role: lang === "ar" ? "للمحققين المعتمدين" : "Pour les vérificateurs",
      icon: Shield,
      features: [
        {
          icon: ClipboardCheck,
          title: lang === "ar" ? "فحص التصاريح والأدلة" : "Examen des déclarations",
          description:
            lang === "ar"
              ? "استعرض قائمة العمليات قيد المراجعة مع فحص صور الإثبات والبيانات لاتخاذ قرار سليم وموضوعي."
              : "Consultez les déclarations en attente avec toutes les preuves associées pour prendre une décision éclairée.",
        },
        {
          icon: Shield,
          title: lang === "ar" ? "المصادقة والرفض المبرر" : "Approbation et rejet",
          description:
            lang === "ar"
              ? "صادق على العمليات المستوفية للشروط مع إمكانية كتابة تعليل ملزم وواضح في حالة الرفض."
              : "Approuvez ou rejetez les opérations avec obligation d'ajouter un motif de décision.",
        },
        {
          icon: BarChart3,
          title: lang === "ar" ? "سجل القرارات والإنجاز" : "Historique des décisions",
          description:
            lang === "ar"
              ? "اطلع على سجلك الكامل لعمليات الفحص وتتبع مؤشرات الدقة وسرعة الاستجابة."
              : "Consultez l'ensemble des décisions prises et suivez votre activité de vérification.",
        },
      ],
    },
    {
      role: lang === "ar" ? "لإدارة المنصة" : "Pour les administrateurs",
      icon: Lock,
      features: [
        {
          icon: Users,
          title: lang === "ar" ? "إدارة المستخدمين والصلاحيات" : "Gestion des utilisateurs",
          description:
            lang === "ar"
              ? "إدارة شاملة لحسابات المواطنين والمحققين: تفعيل، تجميد، ترقية الصلاحيات ومتابعة الحسابات."
              : "Gérez les comptes citoyens et vérificateurs : activation, désactivation, attribution des rôles.",
        },
        {
          icon: Recycle,
          title: lang === "ar" ? "إدارة فئات النفايات" : "Catégories de déchets",
          description:
            lang === "ar"
              ? "إضافة وتعديل فئات النفايات القابلة للفرز وتحديد معايير احتساب النقاط لكل فئة."
              : "Créez et gérez les catégories de déchets avec leurs valeurs en points correspondantes.",
        },
        {
          icon: MapPin,
          title: lang === "ar" ? "إدارة نقاط التجميع" : "Points de collecte",
          description:
            lang === "ar"
              ? "إضافة وتحديث مراكز وحاويات التجميع، مواقعها الجغرافية، والفئات المقبولة في كل مركز."
              : "Ajoutez, modifiez et gérez les points de collecte disponibles sur la plateforme.",
        },
        {
          icon: BarChart3,
          title: lang === "ar" ? "التقارير والإحصاءات العامة" : "Statistiques globales",
          description:
            lang === "ar"
              ? "لوحات بيانية حية ومفصلة حول كميات النفايات المجمعة، حركة النقاط، ومعدلات النشاط العام."
              : "Accédez aux rapports et statistiques de la plateforme : opérations, points, utilisateurs actifs.",
        },
        {
          icon: Shield,
          title: lang === "ar" ? "سجل الرقابة والتتبع غير القابل للتعديل" : "Journal d'audit",
          description:
            lang === "ar"
              ? "سجل تتبع أمني صارم يوثق كافة التعديلات الإدارية الحساسة لضمان الشفافية والأمان الكامل."
              : "Consultez le journal complet des actions sensibles effectuées sur la plateforme pour un audit strict.",
        },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-eco-orange/30 text-eco-orange">
            {t.home.featBadge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t.home.featTitle}{" "}
            <span className="text-eco-orange">{lang === "ar" ? "الشاملة" : "intégrées"}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.home.featSub}
          </p>
        </div>

        {/* Features by role */}
        <div className="space-y-16">
          {featuresByRole.map((group) => (
            <div key={group.role}>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                  <group.icon size={22} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {group.role}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.features.map((feat) => {
                  const isOrangeAccent = feat.icon === Star || feat.icon === Bell;
                  return (
                    <Card
                      key={feat.title}
                      className={`hover:ring-primary/20 transition-all text-start ${
                        isOrangeAccent ? "border-eco-orange/30 bg-card" : ""
                      }`}
                    >
                      <CardHeader>
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${
                            isOrangeAccent
                              ? "bg-eco-orange/15 text-eco-orange"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <feat.icon size={20} />
                        </div>
                        <CardTitle
                          className={`text-base ${
                            isOrangeAccent ? "text-eco-orange font-bold" : ""
                          }`}
                        >
                          {feat.title}
                        </CardTitle>
                        <CardDescription className="leading-relaxed">
                          {feat.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

