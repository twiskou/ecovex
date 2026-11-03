"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface TransactionItem {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
  user: {
    email: string;
    profile?: { firstName: string | null; lastName: string | null } | null;
  };
}

interface AdminPointsViewProps {
  transactions: TransactionItem[];
  totalPointsCount: number;
  earnedPoints: number;
  adjustedPoints: number;
}

export function AdminPointsView({
  transactions,
  totalPointsCount,
  earnedPoints,
  adjustedPoints,
}: AdminPointsViewProps) {
  const { lang, t } = useLang();

  const getTypeLabel = (type: string) => {
    if (type === "EARNED") return lang === "ar" ? "مكتسبة" : "EARNED";
    if (type === "ADJUSTED") return lang === "ar" ? "تعديل" : "ADJUSTED";
    return type;
  };

  return (
    <div className="space-y-6 text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "الاقتصاد الدائري والمكافآت" : "Économie circulaire & Récompenses"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.admin.pointsTx}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "السجل المحاسبي وتدقيق معاملات النقاط الممنوحة والمعدلة على المنصة."
            : "Registre comptable et audit des points attribués et ajustés."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "إجمالي النقاط المتداولة" : "Total points en circulation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary">
              {totalPointsCount} {t.common.points}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "الرصيد التراكمي على المنصة" : "Solde cumulé sur la plateforme"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "نقاط مكتسبة بالتجميع" : "Points gagnés par collecte"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{earnedPoints} {t.common.points}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "مصادقة المحققين القياسية" : "Validation standard vérificateurs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {lang === "ar" ? "تعديلات إدارية" : "Ajustements administratifs"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{adjustedPoints} {t.common.points}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "تصحيحات استثنائية معتمدة" : "Corrections exceptionnelles"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {lang === "ar" ? "سجل معاملات النقاط" : "Historique des transactions de points"}
          </CardTitle>
          <CardDescription>
            {lang === "ar" ? "تتبع كامل وشفاف لجميع العمليات المالية للنقاط" : "Traçabilité intégrale des attributions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3.5 text-start">{t.common.date}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "المستفيد" : "Bénéficiaire"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الوصف" : "Description"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "النوع" : "Type"}</th>
                  <th className="px-6 py-3.5 text-end">{lang === "ar" ? "المقدار" : "Montant"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                      {" "}
                      {lang === "ar" ? "الساعة " : "à "}
                      {new Date(tx.createdAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {tx.user.profile?.firstName} {tx.user.profile?.lastName}
                      <span className="block text-xs text-muted-foreground font-normal">
                        {tx.user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {tx.description || (lang === "ar" ? "إسناد نقاط بيئية" : "Attribution de points")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={tx.type === "EARNED" ? "default" : "secondary"} className="text-xs">
                        {getTypeLabel(tx.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-primary whitespace-nowrap text-end">
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} {t.common.points}
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

