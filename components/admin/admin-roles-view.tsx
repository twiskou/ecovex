"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface AdminRolesViewProps {
  citizenCount: number;
  verifierCount: number;
  adminCount: number;
}

export function AdminRolesView({
  citizenCount,
  verifierCount,
  adminCount,
}: AdminRolesViewProps) {
  const { lang, t } = useLang();

  const permissionsMatrix = [
    {
      feature: lang === "ar" ? "الاطلاع على نقاط التجميع العامة" : "Consulter les points de collecte publics",
      citizen: true,
      verifier: true,
      admin: true,
    },
    {
      feature: lang === "ar" ? "التصريح بعملية تجميع وفرز نفايات" : "Déclarer une opération de collecte",
      citizen: true,
      verifier: false,
      admin: false,
    },
    {
      feature: lang === "ar" ? "كسب واستبدال النقاط البيئية" : "Gagner des points écologiques",
      citizen: true,
      verifier: false,
      admin: false,
    },
    {
      feature: lang === "ar" ? "تحليل صور النفايات بالذكاء الاصطناعي" : "Analyser des photos de déchets (IA)",
      citizen: true,
      verifier: true,
      admin: true,
    },
    {
      feature: lang === "ar" ? "فحص واعتماد أو رفض تصاريح التجميع" : "Examiner et valider/rejeter les collectes",
      citizen: false,
      verifier: true,
      admin: true,
    },
    {
      feature: lang === "ar" ? "الاطلاع على سجل التدقيق وقرارات الفحص" : "Consulter l'historique des vérifications",
      citizen: false,
      verifier: true,
      admin: true,
    },
    {
      feature: lang === "ar" ? "إدارة المستخدمين والأدوار والتعطيل" : "Gérer les utilisateurs et les rôles",
      citizen: false,
      verifier: false,
      admin: true,
    },
    {
      feature: lang === "ar" ? "إدارة فئات النفايات وتحديد قيم النقاط" : "Gérer les catégories de déchets et barèmes",
      citizen: false,
      verifier: false,
      admin: true,
    },
    {
      feature: lang === "ar" ? "إنشاء وتعديل مراكز ونقاط التجميع" : "Créer et modifier les points de collecte",
      citizen: false,
      verifier: false,
      admin: true,
    },
    {
      feature: lang === "ar" ? "التعديل الإداري الموثق لأرصدة النقاط" : "Ajustement exceptionnel des soldes de points",
      citizen: false,
      verifier: false,
      admin: true,
    },
    {
      feature: lang === "ar" ? "الوصول لسجل تدقيق النظام الأمني" : "Accéder au journal d'audit de sécurité",
      citizen: false,
      verifier: false,
      admin: true,
    },
  ];

  return (
    <div className="space-y-8 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "الأمان والتحكم بالوصول" : "Sécurité & Contrôle d'accès"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.admin.roles}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "تحديد الصلاحيات الممنوحة ونظام التحكم بالوصول المبني على الأدوار (RBAC)."
            : "Définition des prérogatives et contrôle d'accès basé sur les rôles (RBAC)."}
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>{t.roles.CITIZEN}</span>
              <Badge variant="outline">CITIZEN</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {lang === "ar" ? "المستخدمون الفاعلون في الفرز البيئي" : "Utilisateurs finaux du tri sélectif"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{citizenCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "حسابات مواطنين مسجلة" : "Comptes citoyens actifs"}
            </p>
            <Button variant="ghost" size="sm" asChild className="w-full mt-4 text-xs gap-1 font-medium">
              <Link href="/admin/utilisateurs?role=CITIZEN">
                {lang === "ar" ? "عرض القائمة" : "Voir la liste"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>{t.roles.VERIFIER}</span>
              <Badge variant="secondary">VERIFIER</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {lang === "ar" ? "أعوان المراقبة والمصادقة على العمليات" : "Agents de contrôle et validation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{verifierCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "محققون معتمدون" : "Vérificateurs habilités"}
            </p>
            <Button variant="ghost" size="sm" asChild className="w-full mt-4 text-xs gap-1 font-medium">
              <Link href="/admin/utilisateurs?role=VERIFIER">
                {lang === "ar" ? "عرض القائمة" : "Voir la liste"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>{t.roles.ADMIN}</span>
              <Badge variant="destructive">ADMIN</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {lang === "ar" ? "مديرو النظام والحوكمة" : "Gestionnaires système"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{adminCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "مديرو النظام" : "Administrateurs plateforme"}
            </p>
            <Button variant="ghost" size="sm" asChild className="w-full mt-4 text-xs gap-1 font-medium">
              <Link href="/admin/utilisateurs?role=ADMIN">
                {lang === "ar" ? "عرض القائمة" : "Voir la liste"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "ar" ? "مصفوفة صلاحيات الوصول (RBAC)" : "Matrice des permissions RBAC"}
          </CardTitle>
          <CardDescription>
            {lang === "ar"
              ? "قواعد التفويض والأمان المفحوصة والمطبقة من جهة الخادم لكل إجراء حساس"
              : "Règles d'autorisation vérifiées côté serveur pour chaque action sensible"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الوظيفة / الصلاحية" : "Fonctionnalité / Action"}</th>
                  <th className="px-6 py-3.5 text-center">{t.roles.CITIZEN}</th>
                  <th className="px-6 py-3.5 text-center">{t.roles.VERIFIER}</th>
                  <th className="px-6 py-3.5 text-center">{t.roles.ADMIN}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {permissionsMatrix.map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/20">
                    <td className="px-6 py-3.5 font-medium text-foreground text-xs text-start">
                      {row.feature}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {row.citizen ? (
                        <Check size={16} className="text-primary inline-block" />
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {row.verifier ? (
                        <Check size={16} className="text-primary inline-block" />
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {row.admin ? (
                        <Check size={16} className="text-primary inline-block" />
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
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

