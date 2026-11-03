"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  UploadCloud,
  MapPin,
  LogIn,
  LogOut,
  UserCheck,
  Coins,
  Activity,
  Calendar,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  Clock,
  User,
  Hash,
  Database,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";
import {
  getActionMeta,
  getEntityLocalized,
  parseAuditDetails,
} from "@/lib/audit-i18n";

interface AuditLogItem {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: Date;
  user?: {
    email: string;
    role: string;
    profile?: { firstName: string | null; lastName: string | null } | null;
  } | null;
}

export function AdminAuditView({ logs }: { logs: AuditLogItem[] }) {
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);

  // Compute KPIs
  const stats = useMemo(() => {
    let verifications = 0;
    let submissions = 0;
    let authEvents = 0;
    let adminEvents = 0;

    for (const log of logs) {
      if (log.action.startsWith("VERIFY_")) verifications++;
      else if (log.action.includes("COLLECTION")) submissions++;
      else if (log.action === "LOGIN" || log.action === "LOGOUT" || log.action === "USER_REGISTER") authEvents++;
      else adminEvents++;
    }

    return {
      total: logs.length,
      verifications,
      submissions,
      authEvents,
      adminEvents,
    };
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const { label, meta } = getActionMeta(log.action, lang);
      const entityStr = getEntityLocalized(log.entity, lang);
      const parsedDetails = parseAuditDetails(log.details, lang);
      const searchLower = search.toLowerCase().trim();

      const userName = `${log.user?.profile?.firstName || ""} ${log.user?.profile?.lastName || ""}`.toLowerCase();
      const userEmail = (log.user?.email || "").toLowerCase();

      const matchesSearch =
        !searchLower ||
        log.action.toLowerCase().includes(searchLower) ||
        label.toLowerCase().includes(searchLower) ||
        entityStr.toLowerCase().includes(searchLower) ||
        userName.includes(searchLower) ||
        userEmail.includes(searchLower) ||
        (log.details || "").toLowerCase().includes(searchLower) ||
        (parsedDetails.reason || "").toLowerCase().includes(searchLower) ||
        (log.entityId || "").toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "all" || meta.category === selectedCategory;

      const matchesRole =
        selectedRole === "all" || (log.user?.role || "SYSTEM") === selectedRole;

      return matchesSearch && matchesCategory && matchesRole;
    });
  }, [logs, search, selectedCategory, selectedRole, lang]);

  const renderActionIcon = (action: string) => {
    switch (action) {
      case "VERIFY_APPROVE":
        return <CheckCircle size={14} className="text-emerald-600 shrink-0" />;
      case "VERIFY_REJECT":
        return <XCircle size={14} className="text-destructive shrink-0" />;
      case "SUBMIT_COLLECTION":
        return <UploadCloud size={14} className="text-blue-600 shrink-0" />;
      case "CREATE_COLLECTION_POINT":
      case "UPDATE_COLLECTION_POINT":
        return <MapPin size={14} className="text-purple-600 shrink-0" />;
      case "LOGIN":
        return <LogIn size={14} className="text-teal-600 shrink-0" />;
      case "LOGOUT":
        return <LogOut size={14} className="text-slate-500 shrink-0" />;
      case "USER_REGISTER":
        return <UserCheck size={14} className="text-indigo-600 shrink-0" />;
      case "ADJUST_POINTS":
        return <Coins size={14} className="text-amber-600 shrink-0" />;
      default:
        return <Activity size={14} className="text-muted-foreground shrink-0" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            {lang === "ar" ? "مدير عام" : "Admin"}
          </span>
        );
      case "VERIFIER":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            {lang === "ar" ? "محقق" : "Vérificateur"}
          </span>
        );
      case "CITIZEN":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {lang === "ar" ? "مواطن" : "Citoyen"}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {lang === "ar" ? "النظام" : "Système"}
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Action", "Utilisateur", "Role", "Entite", "Details"];
    const rows = filteredLogs.map((log) => [
      log.id,
      new Date(log.createdAt).toISOString(),
      log.action,
      log.user ? `${log.user.profile?.firstName || ""} ${log.user.profile?.lastName || ""} (${log.user.email})` : "Système",
      log.user?.role || "SYSTEM",
      log.entity || "",
      `"${(log.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecovex_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-start">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="gap-1.5 py-0.5 border-primary/30 text-primary bg-primary/5">
              <Shield size={13} />
              {lang === "ar" ? "الأمان والامتثال الرقابي" : "Sécurité & Conformité"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {logs.length} {lang === "ar" ? "حدث مسجل" : "événements tracés"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {lang === "ar" ? "سجل التتبع والرقابة المتقدم" : "Journal d'audit & Traçabilité"}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {lang === "ar"
              ? "سجل محصن وغير قابل للتعديل يوثق جميع العمليات والقرارات والولوج لحماية الشفافية والمساءلة."
              : "Registre immuable des actions sensibles, décisions des vérificateurs et accès à la plateforme."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="gap-2 rounded-xl text-xs h-9 shrink-0 self-start sm:self-auto"
        >
          <Download size={14} />
          {lang === "ar" ? "تصدير السجل (CSV)" : "Exporter le journal"}
        </Button>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">
              {lang === "ar" ? "إجمالي السجلات" : "Total des logs"}
            </span>
            <Activity size={16} className="text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">{stats.total}</div>
          <div className="text-[11px] text-muted-foreground">
            {lang === "ar" ? "آخر 100 إجراء مسجل" : "100 dernières actions"}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">
              {lang === "ar" ? "قرارات التحقق" : "Vérifications"}
            </span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.verifications}</div>
          <div className="text-[11px] text-muted-foreground">
            {lang === "ar" ? "اعتماد ورفض العمليات" : "Approbations & Rejets"}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">
              {lang === "ar" ? "تصاريح الجمع" : "Collectes citoyens"}
            </span>
            <UploadCloud size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.submissions}</div>
          <div className="text-[11px] text-muted-foreground">
            {lang === "ar" ? "إيداعات مسجلة" : "Dépôts initiés"}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">
              {lang === "ar" ? "الجلسات والولوج" : "Accès & Sessions"}
            </span>
            <LogIn size={16} className="text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600">{stats.authEvents}</div>
          <div className="text-[11px] text-muted-foreground">
            {lang === "ar" ? "دخول وخروج المستخدمين" : "Connexions / Déconnexions"}
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="space-y-3 p-4 rounded-2xl bg-muted/20 border border-border/70">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              placeholder={
                lang === "ar"
                  ? "ابحث بالإجراء، المستخدم، البريد، الكيان أو السبب..."
                  : "Rechercher par action, utilisateur, email, motif..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 text-start rounded-xl h-10 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium focus:border-ring outline-none text-start shrink-0"
            >
              <option value="all">{lang === "ar" ? "جميع الأدوار" : "Tous les rôles"}</option>
              <option value="ADMIN">{lang === "ar" ? "المديرون فقط" : "Administrateurs"}</option>
              <option value="VERIFIER">{lang === "ar" ? "المحققون فقط" : "Vérificateurs"}</option>
              <option value="CITIZEN">{lang === "ar" ? "المواطنون فقط" : "Citoyens"}</option>
              <option value="SYSTEM">{lang === "ar" ? "النظام الآلي" : "Système"}</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-muted-foreground uppercase me-1 shrink-0">
            {lang === "ar" ? "نوع الحدث:" : "Catégorie :"}
          </span>
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="rounded-xl text-xs h-7 px-3 font-semibold shrink-0"
          >
            {lang === "ar" ? "الكل" : "Tous"} ({logs.length})
          </Button>
          <Button
            variant={selectedCategory === "verification" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("verification")}
            className="rounded-xl text-xs h-7 px-3 font-semibold shrink-0 gap-1.5"
          >
            <CheckCircle size={13} className="text-emerald-500" />
            {lang === "ar" ? "قرارات التحقق" : "Vérifications"} ({stats.verifications})
          </Button>
          <Button
            variant={selectedCategory === "submission" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("submission")}
            className="rounded-xl text-xs h-7 px-3 font-semibold shrink-0 gap-1.5"
          >
            <UploadCloud size={13} className="text-blue-500" />
            {lang === "ar" ? "تصاريح الجمع" : "Collectes"} ({stats.submissions})
          </Button>
          <Button
            variant={selectedCategory === "auth" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("auth")}
            className="rounded-xl text-xs h-7 px-3 font-semibold shrink-0 gap-1.5"
          >
            <LogIn size={13} className="text-teal-500" />
            {lang === "ar" ? "الجلسات والدخول" : "Sessions"} ({stats.authEvents})
          </Button>
          <Button
            variant={selectedCategory === "admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("admin")}
            className="rounded-xl text-xs h-7 px-3 font-semibold shrink-0 gap-1.5"
          >
            <Shield size={13} className="text-purple-500" />
            {lang === "ar" ? "الإدارة والإعدادات" : "Administration"} ({stats.adminEvents})
          </Button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Shield size={40} className="mx-auto mb-3 opacity-30 text-muted-foreground" />
              <p className="font-bold text-foreground text-sm">
                {lang === "ar" ? "لا توجد سجلات تطابق معايير البحث" : "Aucun événement correspondant"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                {lang === "ar"
                  ? "جرب إزالة كلمات البحث أو تغيير عامل التصفية."
                  : "Modifiez vos filtres ou termes de recherche pour voir d'autres logs."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedRole("all");
                }}
                className="mt-4 text-xs rounded-xl"
              >
                {lang === "ar" ? "إعادة الضبط" : "Réinitialiser"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5 text-start whitespace-nowrap">
                      {lang === "ar" ? "التاريخ والوقت" : "Date & Heure"}
                    </th>
                    <th className="px-5 py-3.5 text-start whitespace-nowrap">
                      {lang === "ar" ? "الإجراء المنفذ" : "Événement"}
                    </th>
                    <th className="px-5 py-3.5 text-start whitespace-nowrap">
                      {lang === "ar" ? "المستخدم المسؤول" : "Utilisateur"}
                    </th>
                    <th className="px-5 py-3.5 text-start whitespace-nowrap">
                      {lang === "ar" ? "الكيان المستهدف" : "Entité"}
                    </th>
                    <th className="px-5 py-3.5 text-start">
                      {lang === "ar" ? "الملخص والنتيجة" : "Détails & Résumé"}
                    </th>
                    <th className="px-5 py-3.5 text-end whitespace-nowrap">
                      {lang === "ar" ? "معاينة" : "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {filteredLogs.map((log) => {
                    const { label, meta } = getActionMeta(log.action, lang);
                    const entityLabel = getEntityLocalized(log.entity, lang);
                    const parsed = parseAuditDetails(log.details, lang);

                    return (
                      <tr
                        key={log.id}
                        onClick={() => setActiveLog(log)}
                        className="hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        {/* Timestamp */}
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                          <div className="font-semibold text-foreground">
                            {new Date(log.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(log.createdAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${meta.badgeColorClass}`}
                          >
                            {renderActionIcon(log.action)}
                            {label}
                          </span>
                        </td>

                        {/* User info */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {log.user ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-foreground">
                                <span>
                                  {log.user.profile?.firstName} {log.user.profile?.lastName}
                                </span>
                                {getRoleBadge(log.user.role)}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">
                                {log.user.email}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              {lang === "ar" ? "النظام الآلي (System)" : "Système automatisé"}
                            </div>
                          )}
                        </td>

                        {/* Entity */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-foreground">
                            {entityLabel}
                          </div>
                          {log.entityId && (
                            <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                              #{log.entityId.slice(-6)}
                            </div>
                          )}
                        </td>

                        {/* Summary / Details */}
                        <td className="px-5 py-3.5 max-w-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {parsed.badge && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${parsed.badge.color}`}
                                >
                                  {parsed.badge.text}
                                </span>
                              )}
                              <span className="text-xs text-foreground font-medium">
                                {parsed.summary}
                              </span>
                            </div>

                            {parsed.reason && (
                              <div className="text-[11px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-md inline-block">
                                <span className="font-semibold">{lang === "ar" ? "السبب:" : "Motif :"}</span> {parsed.reason}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Action inspection */}
                        <td className="px-5 py-3.5 text-end whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground group-hover:text-primary rounded-lg"
                            title={lang === "ar" ? "معاينة التفاصيل" : "Inspecter"}
                          >
                            <Eye size={15} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Detailed Inspection Dialog ── */}
      <Dialog open={!!activeLog} onOpenChange={(open) => !open && setActiveLog(null)}>
        <DialogContent className="max-w-lg">
          {activeLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Shield size={18} className="text-primary" />
                  {lang === "ar" ? "تفاصيل الحدث الرقابي" : "Inspection du journal d'audit"}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-muted-foreground">
                  ID: {activeLog.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs py-2 text-start">
                {/* Action card */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      {lang === "ar" ? "الإجراء" : "Action exécutée"}
                    </span>
                    <span className="text-sm font-bold text-foreground mt-0.5 block">
                      {getActionMeta(activeLog.action, lang).label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      CODE: {activeLog.action}
                    </span>
                  </div>
                  <span
                    className={`p-2.5 rounded-xl border ${getActionMeta(activeLog.action, lang).meta.badgeColorClass}`}
                  >
                    {renderActionIcon(activeLog.action)}
                  </span>
                </div>

                {/* Actor & Timestamp Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <User size={12} className="text-primary" />
                      {lang === "ar" ? "المستخدم الفاعل" : "Acteur"}
                    </span>
                    {activeLog.user ? (
                      <div>
                        <div className="font-bold text-foreground">
                          {activeLog.user.profile?.firstName} {activeLog.user.profile?.lastName}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono truncate">
                          {activeLog.user.email}
                        </div>
                        <div className="mt-1">{getRoleBadge(activeLog.user.role)}</div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground font-medium">
                        {lang === "ar" ? "النظام الآلي" : "Système"}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Clock size={12} className="text-primary" />
                      {lang === "ar" ? "التوقيت الدقيق" : "Horodatage"}
                    </span>
                    <div className="font-bold text-foreground">
                      {new Date(activeLog.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {new Date(activeLog.createdAt).toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      ● {lang === "ar" ? "مسجل وآمن" : "Certifié immuable"}
                    </div>
                  </div>
                </div>

                {/* Target Entity */}
                <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Database size={12} className="text-primary" />
                    {lang === "ar" ? "الكيان المستهدف في قاعدة البيانات" : "Entité ciblée"}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {getEntityLocalized(activeLog.entity, lang)}
                    </span>
                    <span className="font-mono text-muted-foreground text-[11px]">
                      {activeLog.entity || "—"}
                    </span>
                  </div>
                  {activeLog.entityId && (
                    <div className="text-[11px] font-mono bg-muted/50 p-1.5 rounded-lg text-muted-foreground break-all">
                      ID: {activeLog.entityId}
                    </div>
                  )}
                </div>

                {/* Details Breakdown */}
                {activeLog.details && (
                  <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Info size={12} className="text-primary" />
                      {lang === "ar" ? "بيانات وتفاصيل المعاملة" : "Détails complets"}
                    </span>
                    <p className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg leading-relaxed whitespace-pre-wrap">
                      {activeLog.details}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveLog(null)}
                  className="w-full text-xs"
                >
                  {lang === "ar" ? "إغلاق" : "Fermer"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
