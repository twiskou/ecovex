"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggleLang, t } = useLang();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      className="gap-2 text-xs font-semibold h-8 px-2.5 rounded-lg border border-border/60 hover:bg-muted select-none transition-colors"
      title={lang === "fr" ? "Passer en Arabe (RTL)" : "Changer vers le Français (LTR)"}
    >
      <Languages size={15} className="text-primary" />
      <span>{lang === "fr" ? t.common.switchToAr : t.common.switchToFr}</span>
    </Button>
  );
}
