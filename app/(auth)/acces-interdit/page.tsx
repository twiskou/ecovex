"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export default function AccesInterditPage() {
  const { t } = useLang();

  return (
    <Card className="w-full max-w-lg text-center shadow-xl shadow-destructive/5 border-border/80 bg-card/95 backdrop-blur-xs">
      <CardHeader>
        <div className="flex justify-center mb-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert size={32} />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{t.auth.accessDeniedTitle}</CardTitle>
        <CardDescription className="text-base mt-2">
          {t.auth.accessDeniedSub}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.auth.accessDeniedDesc}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/connexion">
              <ArrowLeft size={16} className="rtl:rotate-180" />
              {t.auth.switchAccount}
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home size={16} />
              {t.auth.backHome}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
