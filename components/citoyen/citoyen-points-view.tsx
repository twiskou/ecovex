"use client";

import Link from "next/link";
import { Award, History, PlusCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface TransactionItem {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
}

interface CitoyenPointsViewProps {
  totalPoints: number;
  transactions: TransactionItem[];
}

export function CitoyenPointsView({ totalPoints, transactions }: CitoyenPointsViewProps) {
  const { lang, t } = useLang();
  const earnedCount = transactions.filter((t) => t.type === "EARNED").length;

  const getTransactionTypeLabel = (type: string) => {
    if (type === "EARNED") return lang === "ar" ? "مكتسبة" : "Gagné";
    if (type === "ADJUSTED") return lang === "ar" ? "تعديل إداري" : "Ajustement";
    return lang === "ar" ? "مكافأة" : "Bonus";
  };

  return (
    <div className="space-y-8 text-start">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "المكافآت البيئية" : "Gamification écologique"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {lang === "ar" ? "رصيدي من النقاط البيئية" : "Mes points écologiques"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "تكافئ نقاطك جهودك في الفرز والتجميع المعتمد ومساهمتك في حماية البيئة."
            : "Vos points récompensent vos dépôts vérifiés et votre engagement environnemental."}
        </p>
      </div>

      {/* Points Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="sm:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award size={18} className="text-primary" />
              {lang === "ar" ? "الرصيد المتاح" : "Solde disponible"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-primary">{totalPoints}</span>
              <span className="text-lg font-semibold text-muted-foreground">{t.common.points}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              {lang === "ar" ? "معتمد وموثق عبر عمليات تجميع حقيقية" : "Certifié par vérifications d'opérations réelles"}
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي العمليات المكافأة" : "Total opérations récompensées"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{earnedCount}</div>
            <Button asChild size="sm" className="w-full mt-4 gap-1.5 font-medium">
              <Link href="/citoyen/operations/nouvelle">
                <PlusCircle size={15} />
                {lang === "ar" ? "كسب المزيد من النقاط" : "Gagner plus de points"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History size={18} className="text-primary" />
            {t.citoyen.pointsHistory}
          </CardTitle>
          <CardDescription>
            {lang === "ar"
              ? "سجل كامل بجميع حركات الإيداع والنقاط المحتسبة في حسابك"
              : "Toutes les entrées de points créditées sur votre compte"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Award size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-foreground">
                {lang === "ar" ? "لا توجد حركات نقاط مسجلة" : "Aucune transaction de points"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "ar"
                  ? "قم بتسليم وتوثيق عملية تجميع لتبدأ في جمع النقاط البيئية."
                  : "Faites valider une opération de collecte pour commencer à accumuler des points."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                    <th className="px-6 py-3.5 text-start">{t.common.date}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الوصف" : "Description"}</th>
                    <th className="px-6 py-3.5 text-start">{lang === "ar" ? "النوع" : "Type"}</th>
                    <th className="px-6 py-3.5 text-end">{t.common.points}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {tx.description || (lang === "ar" ? "مكافأة تجميع وتدوير" : "Collecte valorisée")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">
                          {getTransactionTypeLabel(tx.type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end font-bold text-primary">
                        +{tx.amount} {t.common.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

