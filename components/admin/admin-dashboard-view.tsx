"use client";

import Link from "next/link";
import {
  Users,
  Recycle,
  MapPin,
  Award,
  ClipboardList,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface RecentUserItem {
  id: string;
  email: string;
  role: string;
  profile?: { firstName: string | null; lastName: string | null } | null;
}

interface RecentAuditItem {
  id: string;
  action: string;
  entity: string | null;
  details: string | null;
  createdAt: Date;
  user?: {
    email: string;
    role: string;
  } | null;
}

interface AdminDashboardViewProps {
  totalUsers: number;
  totalSubmissions: number;
  totalPointsGiven: number;
  activePointsCount: number;
  recentAudits: RecentAuditItem[];
  recentUsers: RecentUserItem[];
}

export function AdminDashboardView({
  totalUsers,
  totalSubmissions,
  totalPointsGiven,
  activePointsCount,
  recentAudits,
  recentUsers,
}: AdminDashboardViewProps) {
  const { lang, t } = useLang();

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return <Badge variant="destructive" className="text-xs">{t.roles.ADMIN}</Badge>;
    if (role === "VERIFIER") return <Badge variant="secondary" className="text-xs">{t.roles.VERIFIER}</Badge>;
    return <Badge variant="outline" className="text-xs">{t.roles.CITIZEN}</Badge>;
  };

  return (
    <div className="space-y-8 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-background p-6 rounded-2xl border border-primary/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.admin.dashboard}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {lang === "ar"
              ? "الإدارة الشاملة لمنصة إيكوفيكس، مراقبة العمليات والحوكمة والامتثال الأمني."
              : "Pilotage global de la plateforme ECOVEX, contrôle des opérations et gouvernance."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="gap-2 font-medium">
            <Link href="/admin/points-collecte/nouveau">
              <PlusCircle size={16} />
              {t.admin.newPoint}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2 font-medium">
            <Link href="/admin/categories-dechets">
              <Recycle size={16} />
              {t.admin.categories}
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t.admin.totalUsers}
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Users size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "مواطنون ومحققون" : "Citoyens & Vérificateurs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t.admin.totalOps}
            </CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ClipboardList size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "جميع التصاريح المسجلة" : "Toutes déclarations"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t.admin.totalPoints}
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Award size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalPointsGiven}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "أودعت بعد التحقق" : "Crédités sur vérification"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {t.admin.activePointsCount}
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <MapPin size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activePointsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "مراكز تجميع جاهزة" : "Opérationnels"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {lang === "ar" ? "المستخدمون الجدد" : "Nouveaux utilisateurs"}
              </CardTitle>
              <CardDescription>
                {lang === "ar" ? "أحدث الحسابات المسجلة على المنصة" : "Dernières inscriptions sur la plateforme"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-medium">
              <Link href="/admin/utilisateurs">
                {lang === "ar" ? "إدارة الكل" : "Gérer"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {u.profile?.firstName} {u.profile?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(u.role)}
                  <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs font-medium">
                    <Link href={`/admin/utilisateurs/${u.id}`}>{t.common.details}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent audit logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {lang === "ar" ? "أحدث سجلات التدقيق" : "Journal d'audit récent"}
              </CardTitle>
              <CardDescription>
                {lang === "ar" ? "تتبع وتوثيق العمليات الحساسة" : "Traçabilité des actions sensibles"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-medium">
              <Link href="/admin/audit-logs">
                {t.common.all}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {recentAudits.map((log) => (
              <div key={log.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground font-mono">
                    {log.action}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {log.user ? `${log.user.email} (${log.user.role})` : (lang === "ar" ? "النظام" : "Système")} &bull;{" "}
                  {log.details || log.entity || (lang === "ar" ? "لا توجد تفاصيل" : "Aucun détail")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

