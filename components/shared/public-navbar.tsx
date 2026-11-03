"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { useLang } from "@/lib/i18n";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLang();

  const navLinks = [
    { href: "/fonctionnalites", label: t.nav.features },
    { href: "/points-collecte", label: t.nav.collectionPoints },
    { href: "/impact", label: t.nav.impact },
    { href: "/a-propos", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant={pathname === "/connexion" ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/connexion">{t.common.connect}</Link>
            </Button>
            <Button
              variant="default"
              size="sm"
              className={cn(pathname === "/inscription" && "ring-2 ring-primary/30 ring-offset-1")}
              asChild
            >
              <Link href="/inscription">{t.common.register}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2 mt-1">
              <div className="flex justify-start py-1">
                <LanguageToggle />
              </div>
              <Button
                variant={pathname === "/connexion" ? "secondary" : "outline"}
                size="sm"
                className="w-full"
                asChild
              >
                <Link href="/connexion" onClick={() => setMobileOpen(false)}>
                  {t.common.connect}
                </Link>
              </Button>
              <Button
                size="sm"
                className={cn("w-full", pathname === "/inscription" && "ring-2 ring-primary/30")}
                asChild
              >
                <Link href="/inscription" onClick={() => setMobileOpen(false)}>
                  {t.common.registerFree}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
