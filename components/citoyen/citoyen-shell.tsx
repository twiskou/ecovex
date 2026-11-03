"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  PlusCircle,
  History,
  MapPin,
  Award,
  Bell,
  UserCircle,
  X,
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { cn } from "cn";
import { useLang } from "@/lib/i18n";

interface CitoyenShellProps {
  children: React.ReactNode;
  userEmail: string;
}

export function CitoyenShell({ children, userEmail }: CitoyenShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLang();

  const citizenNav = [
    { href: "/citoyen", label: t.citoyen.dashboard, icon: LayoutDashboard },
    { href: "/citoyen/analyser", label: t.citoyen.analyze, icon: Camera },
    { href: "/citoyen/operations/nouvelle", label: t.citoyen.newOp, icon: PlusCircle },
    { href: "/citoyen/operations", label: t.citoyen.myOps, icon: History },
    { href: "/citoyen/points-collecte", label: t.citoyen.collectPoints, icon: MapPin },
    { href: "/citoyen/points", label: t.citoyen.myPoints, icon: Award },
    { href: "/citoyen/notifications", label: t.citoyen.notifications, icon: Bell },
    { href: "/citoyen/profil", label: t.citoyen.profile, icon: UserCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <DashboardHeader
        userEmail={userEmail}
        role="CITIZEN"
        roleLabel={t.citoyen.spaceTitle}
        onMobileToggle={() => setMobileOpen(true)}
      />

      <div className="flex-1 flex">
        {/* Desktop Sidebar with logical border-e */}
        <aside className="hidden lg:flex w-64 flex-col border-e border-border/60 bg-background/95 p-4 shrink-0">
          <nav className="flex-1 space-y-1">
            {citizenNav.map((item) => {
              const active = pathname === item.href;
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
            <div className="relative w-72 bg-background flex flex-col p-4 shadow-xl z-10 ltr:mr-auto rtl:ml-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
                <span className="font-bold text-foreground">{t.citoyen.menuTitle}</span>
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
                {citizenNav.map((item) => {
                  const active = pathname === item.href;
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
