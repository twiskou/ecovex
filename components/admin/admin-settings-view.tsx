"use client";

import { Cpu, Shield, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export function AdminSettingsView() {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "إعدادات النظام" : "Configuration système"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.admin.settings}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "المعلومات التقنية لبيئة التشغيل، إعدادات الأمان ومسار تطوير المنصة."
            : "Informations techniques relatives à l'environnement d'exécution et à la sécurité."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment & Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu size={18} className="text-primary" />
              {lang === "ar" ? "بيئة التشغيل والتقنيات" : "Environnement d'exécution"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Framework :</span>
              <span className="font-semibold text-foreground">Next.js 16 (App Router)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">{lang === "ar" ? "محرك الواجهات :" : "Moteur UI :"}</span>
              <span className="font-semibold text-foreground">React 19 & Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">{lang === "ar" ? "لغة البرمجة :" : "Langage :"}</span>
              <span className="font-semibold text-foreground">TypeScript (strict mode)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">{lang === "ar" ? "قاعدة البيانات :" : "Base de données :"}</span>
              <span className="font-semibold text-foreground">SQLite (Prisma ORM)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">{lang === "ar" ? "اللغات المدعومة :" : "Langues supportées :"}</span>
              <span className="font-semibold text-foreground">
                {lang === "ar" ? "العربية والفرنسية (RTL أصيل)" : "Français & Arabe (RTL natif)"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              {lang === "ar" ? "سياسات الأمان المطبقة" : "Politique de sécurité appliquée"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>{lang === "ar" ? "تشفير كلمات المرور بواسطة bcrypt بـ 12 دورة تكرار" : "Hachage des mots de passe avec bcrypt (12 rounds)"}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>{lang === "ar" ? "جلسات مشفرة ومحمية بملفات تعريف ارتباط HttpOnly & Lax" : "Sessions sécurisées scellées avec cookies HttpOnly & Lax"}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>{lang === "ar" ? "تحكم بالوصول مبني على الأدوار RBAC مفحوص من الخادم" : "Contrôle d'accès RBAC strict vérifié côté serveur"}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>{lang === "ar" ? "معاملات ذرية (Prisma Transactions) لمنع تكرار أو فقدان النقاط" : "Transactions Prisma atomiques pour l'attribution de points"}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle size={15} className="text-emerald-600 shrink-0" />
              <span>{lang === "ar" ? "توثيق شامل ومستمر عبر سجل تدقيق غير قابل للحذف" : "Traçabilité intégrale via journal d'audit immuable"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extensibility & MVP Notice */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info size={18} className="text-primary" />
            {lang === "ar" ? "بنية المنصة ومسار التوسع (MVP Roadmap)" : "Architecture extensible & Roadmap MVP"}
          </CardTitle>
          <CardDescription>
            {lang === "ar" ? "الوظائف المتاحة حالياً والتوسعات المستقبلية المخططة" : "Fonctionnalités opérationnelles et extensions futures planifiées"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">
              {lang === "ar" ? "وحدة الذكاء الاصطناعي (Computer Vision) :" : "Module de vision IA : "}
            </strong>
            {lang === "ar"
              ? "تمت هيكلة خدمة تحليل الصور في lib/ai-classification.ts لتسهيل ربط أي نموذج تعلم عميق أو واجهة API خارجية (Google Cloud Vision أو TensorFlow) فور توفير مفتاح الربط."
              : "Le service d'analyse d'images actuel est structuré dans lib/ai-classification.ts pour brancher facilement une API de Deep Learning dès qu'une clé d'API est configurée."}
          </p>
          <p>
            <strong className="text-foreground">
              {lang === "ar" ? "إنترنت الأشياء والبلوكشين (IoT & Blockchain) :" : "IoT & Blockchain : "}
            </strong>
            {lang === "ar"
              ? "وفقاً للالتزام بالصدق التقني في دفتر الشروط، تبقى حساسات إنترنت الأشياء والتوثيق عبر البلوكشين مرحلة للتطوير المستقبلي ولا يتم التظاهر بأنها نشطة دون وجودها الفعلي."
              : "Conformément aux règles d'honnêteté technique du cahier des charges, les capteurs IoT pour le remplissage des bacs et la notarisation blockchain restent reportés aux versions ultérieures."}
          </p>
          <p>
            <strong className="text-foreground">
              {lang === "ar" ? "الميزات المستبعدة صراحة :" : "Exclusion stricte : "}
            </strong>
            {lang === "ar"
              ? "تم استبعاد مسارات نسيت كلمة المرور وإعادة التعيين والتحقق من البريد الإلكتروني تماماً وحذف أي روابط تؤدي إليها وفقاً لتعليمات المشروع."
              : "Les fonctionnalités de mot de passe oublié, de réinitialisation et de vérification d'email ont été exclues de l'application conformément aux directives."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

