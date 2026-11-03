"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useLang } from "@/lib/i18n";

export function PublicFooter() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  const footerLinks = {
    produit: [
      { href: "/fonctionnalites", label: t.nav.features },
      { href: "/points-collecte", label: t.nav.collectionPoints },
      { href: "/impact", label: t.nav.impact },
    ],
    societe: [
      { href: "/a-propos", label: t.nav.about },
      { href: "/contact", label: t.nav.contact },
    ],
    legal: [
      { href: "/confidentialite", label: t.footer.privacy },
      { href: "/conditions-utilisation", label: t.footer.terms },
      { href: "/cookies", label: t.footer.cookies },
    ],
  };

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.product}
            </h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.company}
            </h3>
            <ul className="space-y-3">
              {footerLinks.societe.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.legal}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} ECOVEX. {t.footer.rights}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Leaf size={12} className="text-primary" />
            {t.footer.sustainable}
          </p>
        </div>
      </div>
    </footer>
  );
}
