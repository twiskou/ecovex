"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/app/actions/auth";
import { useLang } from "@/lib/i18n";

interface DashboardHeaderProps {
  userEmail: string;
  role: "CITIZEN" | "VERIFIER" | "ADMIN";
  roleLabel?: string;
  onMobileToggle?: () => void;
}

export function DashboardHeader({
  userEmail,
  role,
  roleLabel,
  onMobileToggle,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { t } = useLang();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/connexion");
    router.refresh();
  };

  const getRoleBadgeVariant = () => {
    if (role === "ADMIN") return "destructive";
    if (role === "VERIFIER") return "secondary";
    return "default";
  };

  const displayRoleLabel = roleLabel ?? t.roles[role];
  const roleHomeHref =
    role === "ADMIN" ? "/admin" : role === "VERIFIER" ? "/verificateur" : "/citoyen";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 shrink-0">
          {onMobileToggle && (
            <button
              type="button"
              onClick={onMobileToggle}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          )}
          <Logo size="sm" href={roleHomeHref} />
          <Badge variant={getRoleBadgeVariant()} className="text-xs font-semibold px-2 py-0.5 shadow-xs">
            {displayRoleLabel}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />

          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/40">
            <User size={15} className="text-primary" />
            <span className="font-medium text-foreground truncate max-w-[180px]">
              {userEmail}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title={t.common.logout}
          >
            <LogOut size={16} className="rtl-mirror" />
            <span className="hidden sm:inline">{t.common.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
