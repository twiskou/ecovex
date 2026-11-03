"use client";

import Link from "next/link";
import {
  Award,
  Clock,
  CheckCircle,
  PlusCircle,
  Camera,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface CitoyenDashboardViewProps {
  user: {
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
      totalPoints?: number | null;
    } | null;
  } | null;
  submissions: {
    id: string;
    status: string;
    submittedAt: Date;
    category?: { name: string } | null;
    collectionPoint?: { name: string } | null;
  }[];
  recentTransactions: {
    id: string;
    amount: number;
    description?: string | null;
    createdAt: Date;
  }[];
  totalPoints: number;
  pendingCount: number;
  approvedCount: number;
}

export function CitoyenDashboardView({
  user,
  submissions,
  recentTransactions,
  totalPoints,
  pendingCount,
  approvedCount,
}: CitoyenDashboardViewProps) {
  const { lang, t } = useLang();

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t.statuses.APPROVED;
    if (status === "REJECTED") return t.statuses.REJECTED;
    if (status === "CANCELLED") return t.statuses.CANCELLED;
    return t.statuses.PENDING;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-background p-6 rounded-2xl border border-primary/20 text-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {lang === "ar" ? "مرحباً، " : "Bonjour, "}
            {user?.profile?.firstName || (lang === "ar" ? "المواطن" : "Citoyen")} !
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {lang === "ar"
              ? "إليك ملخص لأنشطة الفرز، وحالة عملياتك وأثرك البيئي الإيجابي."
              : "Voici un aperçu de vos activités de tri et de votre impact écologique."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild size="sm" className="gap-2 font-medium">
            <Link href="/citoyen/operations/nouvelle">
              <PlusCircle size={16} />
              {t.citoyen.newOp}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2 font-medium">
            <Link href="/citoyen/analyser">
              <Camera size={16} />
              {t.citoyen.analyze}
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="hover:ring-primary/20 transition-all text-start">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.citoyen.balance}
            </CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Award size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary">
              {totalPoints} <span className="text-sm font-normal text-muted-foreground">{t.common.points}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "نقاط معتمدة وجاهزة للاستخدام" : "Points validés et utilisables"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:ring-primary/20 transition-all text-start">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.citoyen.pendingSubmissions}
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "تصاريح تنتظر فحص المحققين" : "Déclarations en attente d'examen"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:ring-primary/20 transition-all text-start">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.citoyen.approvedSubmissions}
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">
              {approvedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "عمليات تجميع تمت المصادقة عليها" : "Collectes approuvées avec succès"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dernières déclarations */}
        <Card className="text-start">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{t.citoyen.recentSubmissions}</CardTitle>
              <CardDescription>
                {lang === "ar" ? "أحدث 5 تصاريح تجميع قمت بها" : "Vos 5 déclarations de collecte les plus récentes"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
              <Link href="/citoyen/operations">
                {t.common.all}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t.citoyen.noSubmissionsYet}</p>
                <Button asChild size="sm" variant="link" className="mt-2 text-primary">
                  <Link href="/citoyen/operations/nouvelle">{t.citoyen.startFirst}</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {submissions.map((sub) => {
                  const statusVariant =
                    sub.status === "APPROVED"
                      ? "default"
                      : sub.status === "REJECTED"
                        ? "destructive"
                        : "secondary";
                  return (
                    <div key={sub.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {sub.category?.name || (lang === "ar" ? "فئة غير محددة" : "Catégorie non spécifiée")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sub.collectionPoint?.name || (lang === "ar" ? "نقطة غير محددة" : "Point non spécifié")} &bull;{" "}
                          {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariant} className="text-xs">
                          {getStatusLabel(sub.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                          <Link href={`/citoyen/operations/${sub.id}`}>
                            {t.common.details}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dernières transactions de points */}
        <Card className="text-start">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{t.citoyen.pointsHistory}</CardTitle>
              <CardDescription>
                {lang === "ar" ? "أحدث النقاط المكتسبة والمودعة" : "Vos récentes attributions de points"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
              <Link href="/citoyen/points">
                {t.common.all}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">
                  {lang === "ar" ? "لا توجد معاملات نقاط مسجلة بعد." : "Aucune transaction de points enregistrée."}
                </p>
                <p className="text-xs mt-1">
                  {lang === "ar" ? "ستظهر نقاطك فور مصادقة المحققين على عملياتك." : "Vos points apparaîtront après validation d'une collecte."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {tx.description || (lang === "ar" ? "مكافأة نقاط بيئية" : "Attribution de points")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      +{tx.amount} {t.common.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

