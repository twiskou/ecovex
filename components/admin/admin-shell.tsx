"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Recycle,
  MapPin,
  ClipboardList,
  Award,
  BarChart3,
  ScrollText,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { cn } from "cn";
import { useLang } from "@/lib/i18n";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail: string;
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang } = useLang();

  const adminNav = [
    { href: "/admin", label: t.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/utilisateurs", label: t.admin.users, icon: Users },
    { href: "/admin/roles", label: t.admin.roles, icon: ShieldAlert },
    { href: "/admin/categories-dechets", label: t.admin.categories, icon: Recycle },
    { href: "/admin/points-collecte", label: t.admin.collectPoints, icon: MapPin },
    { href: "/admin/operations", label: t.admin.allOps, icon: ClipboardList },
    { href: "/admin/points", label: t.admin.pointsTx, icon: Award },
    { href: "/admin/statistiques", label: t.admin.stats, icon: BarChart3 },
    { href: "/admin/audit-logs", label: t.admin.auditLogs, icon: ScrollText },
    { href: "/admin/parametres", label: t.admin.settings, icon: Settings },
  ];

  // Map known paths to translated breadcrumb labels
  const pathLabelMap: Record<string, { fr: string; ar: string }> = {
    admin: { fr: "Administration", ar: "الإدارة" },
    utilisateurs: { fr: "Utilisateurs", ar: "المستخدمون" },
    roles: { fr: "Rôles", ar: "الأدوار" },
    "categories-dechets": { fr: "Catégories", ar: "فئات النفايات" },
    "points-collecte": { fr: "Points de collecte", ar: "نقاط التجميع" },
    nouveau: { fr: "Nouveau", ar: "جديد" },
    operations: { fr: "Opérations", ar: "العمليات" },
    points: { fr: "Points", ar: "النقاط" },
    statistiques: { fr: "Statistiques", ar: "الإحصاءات" },
    "audit-logs": { fr: "Audit logs", ar: "سجل الرقابة" },
    parametres: { fr: "Paramètres", ar: "الإعدادات" },
  };

  // Compute breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const url = "/" + pathParts.slice(0, index + 1).join("/");
    const translated = pathLabelMap[part]?.[lang];
    const fallback = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    return {
      label: translated ?? fallback,
      href: url,
      isLast: index === pathParts.length - 1,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <DashboardHeader
        userEmail={userEmail}
        role="ADMIN"
        roleLabel={t.admin.spaceTitle}
        onMobileToggle={() => setMobileOpen(true)}
      />

      <div className="flex-1 flex">
        {/* Desktop Sidebar with logical border-e */}
        <aside className="hidden lg:flex w-64 flex-col border-e border-border/60 bg-background/95 p-4 shrink-0">
          <nav className="flex-1 space-y-1">
            {adminNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 bg-background flex flex-col p-4 shadow-xl z-10 overflow-y-auto ltr:mr-auto rtl:ml-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
                <span className="font-bold text-foreground">{t.admin.menuTitle}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted"
                  aria-label={t.common.close}
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-1">
                {adminNav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumbs with RTL-friendly chevron */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />}
                {crumb.isLast ? (
                  <span className="font-semibold text-foreground">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}
