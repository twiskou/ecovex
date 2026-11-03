"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Recycle,
  User,
  Scale,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import {
  getPointLocalized,
  getCategoryLocalized,
} from "@/lib/collection-points-i18n";

interface SubmissionItem {
  id: string;
  status: string;
  submittedAt: Date;
  quantityKg: number | null;
  citizen: {
    profile?: { firstName: string | null; lastName: string | null } | null;
  };
  category?: { name: string } | null;
  collectionPoint?: { name: string } | null;
  verification?: {
    verifier: {
      profile?: { firstName: string | null; lastName: string | null } | null;
    };
  } | null;
  pointTransaction?: { amount: number } | null;
}

export function AdminOperationsView({
  submissions,
  currentStatus,
}: {
  submissions: SubmissionItem[];
  currentStatus?: string;
}) {
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    for (const s of submissions) {
      if (s.status === "PENDING") pending++;
      else if (s.status === "APPROVED") approved++;
      else if (s.status === "REJECTED") rejected++;
    }
    return {
      all: submissions.length,
      pending,
      approved,
      rejected,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const citizenName = `${sub.citizen.profile?.firstName || ""} ${sub.citizen.profile?.lastName || ""}`.toLowerCase();
      const catName = sub.category?.name || "";
      const catNameAr = getCategoryLocalized(catName, "ar").toLowerCase();
      const pointName = sub.collectionPoint?.name || "";
      const pointNameAr = getPointLocalized({ name: pointName, address: "", description: "", city: "" }, "ar").name.toLowerCase();
      const searchLower = search.toLowerCase().trim();

      const matchesSearch =
        !searchLower ||
        sub.id.toLowerCase().includes(searchLower) ||
        citizenName.includes(searchLower) ||
        catName.toLowerCase().includes(searchLower) ||
        catNameAr.includes(searchLower) ||
        pointName.toLowerCase().includes(searchLower) ||
        pointNameAr.includes(searchLower);

      return matchesSearch;
    });
  }, [submissions, search]);

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t.statuses.APPROVED;
    if (status === "REJECTED") return t.statuses.REJECTED;
    if (status === "CANCELLED") return t.statuses.CANCELLED;
    return t.statuses.PENDING;
  };

  const getVerifierName = (sub: SubmissionItem) => {
    if (!sub.verification) {
      return lang === "ar" ? "لم يُعيّن بعد" : "Non assigné";
    }
    const fn = sub.verification.verifier.profile?.firstName || "";
    const ln = sub.verification.verifier.profile?.lastName || "";
    if (fn.toLowerCase().includes("vérificateur") || fn.toLowerCase().includes("verificateur")) {
      return lang === "ar" ? "المحقق إيكوفيكس" : `${fn} ${ln}`;
    }
    return `${fn} ${ln}`.trim() || (lang === "ar" ? "المحقق" : "Vérificateur");
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-2 gap-1.5 py-0.5 border-primary/30 text-primary bg-primary/5">
          <Layers size={13} />
          {lang === "ar" ? "الإشراف والرقابة" : "Supervision"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {lang === "ar" ? "متابعة عمليات التجميع" : "Suivi des opérations de collecte"}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          {lang === "ar"
            ? "السجل المركزي الشامل لجميع تصاريح المواطنين وقرارات الفحص والإسناد مع البيانات المحدثة."
            : "Registre centralisé de toutes les déclarations citoyennes et décisions des vérificateurs."}
        </p>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Button
            variant={!currentStatus ? "default" : "outline"}
            size="sm"
            asChild
            className="rounded-xl text-xs h-8 font-semibold"
          >
            <Link href="/admin/operations">{t.common.all} ({counts.all})</Link>
          </Button>
          <Button
            variant={currentStatus === "PENDING" ? "default" : "outline"}
            size="sm"
            asChild
            className="rounded-xl text-xs h-8 font-semibold gap-1.5"
          >
            <Link href="/admin/operations?status=PENDING">
              <Clock size={13} className="text-amber-500" />
              {t.statuses.PENDING} ({counts.pending})
            </Link>
          </Button>
          <Button
            variant={currentStatus === "APPROVED" ? "default" : "outline"}
            size="sm"
            asChild
            className="rounded-xl text-xs h-8 font-semibold gap-1.5"
          >
            <Link href="/admin/operations?status=APPROVED">
              <CheckCircle size={13} className="text-emerald-500" />
              {t.statuses.APPROVED} ({counts.approved})
            </Link>
          </Button>
          <Button
            variant={currentStatus === "REJECTED" ? "default" : "outline"}
            size="sm"
            asChild
            className="rounded-xl text-xs h-8 font-semibold gap-1.5"
          >
            <Link href="/admin/operations?status=REJECTED">
              <XCircle size={13} className="text-destructive" />
              {t.statuses.REJECTED} ({counts.rejected})
            </Link>
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder={lang === "ar" ? "ابحث بالمواطن، النقطة أو الفئة..." : "Rechercher..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-8 text-start rounded-xl h-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "المعرف / التاريخ" : "ID / Date"}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "المواطن" : "Citoyen"}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "نقطة التجميع" : "Point de dépôt"}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "الكمية" : "Quantité"}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{t.common.status}</th>
                  <th className="px-5 py-3.5 text-start whitespace-nowrap">{lang === "ar" ? "المحقق" : "Vérificateur"}</th>
                  <th className="px-5 py-3.5 text-end whitespace-nowrap">{t.common.points}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد عمليات تطابق البحث" : "Aucune opération trouvée"}
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const statusVariant =
                      sub.status === "APPROVED"
                        ? "default"
                        : sub.status === "REJECTED"
                          ? "destructive"
                          : "secondary";

                    const rawPointName = sub.collectionPoint?.name || "";
                    const localizedPointName = getPointLocalized(
                      { name: rawPointName, address: "", description: "", city: "" },
                      lang
                    ).name;

                    const rawCatName = sub.category?.name || "";
                    const localizedCatName = getCategoryLocalized(rawCatName, lang);

                    return (
                      <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                          <span className="font-bold text-foreground">#{sub.id.slice(-6)}</span>
                          <span className="block text-[10px] text-muted-foreground font-sans">
                            {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-foreground whitespace-nowrap">
                          {sub.citizen.profile?.firstName} {sub.citizen.profile?.lastName}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Badge variant="secondary" className="text-xs font-semibold py-0.5 px-2">
                            {localizedCatName || (lang === "ar" ? "غير محدد" : "Non spécifié")}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-foreground font-medium whitespace-nowrap">
                          📍 {localizedPointName || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap font-semibold">
                          {sub.quantityKg ? `${sub.quantityKg} ${t.common.kg}` : (lang === "ar" ? "تقديرية" : "Estimée")}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Badge variant={statusVariant} className="text-xs font-semibold">
                            {getStatusLabel(sub.status)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {getVerifierName(sub)}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-emerald-600 whitespace-nowrap text-end">
                          {sub.pointTransaction ? `+${sub.pointTransaction.amount} ${t.common.points}` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
