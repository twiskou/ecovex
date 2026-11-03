"use client";

import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";

interface VerifierProfileProps {
  user: {
    email: string;
    createdAt: Date;
    profile?: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
  totalDecisions: number;
}

export function VerificateurProfilView({ user, totalDecisions }: VerifierProfileProps) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-start">
      <div>
        <Badge variant="outline" className="mb-2">
          {lang === "ar" ? "عضو هيئة المطابقة والتحقق" : "Agent de conformité"}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t.verificateur.profile}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {lang === "ar"
            ? "بيانات الاعتماد الرسمي والصلاحيات التشغيلية الممنوحة لك."
            : "Informations d'accréditation et rôle opérationnel."}
        </p>
      </div>

      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 text-blue-600 border-2 border-blue-500/20">
              <ShieldCheck size={36} />
            </div>
          </div>
          <CardTitle className="text-xl">
            {user.profile?.firstName} {user.profile?.lastName}
          </CardTitle>
          <CardDescription className="text-xs">{user.email}</CardDescription>
          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {lang === "ar" ? "الصفة: محقق معتمد" : "Rôle : Vérificateur agréé"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm border-t border-border/60 pt-4">
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-muted-foreground">
              {lang === "ar" ? "حالة الاعتماد:" : "Accréditation :"}
            </span>
            <span className="font-semibold text-emerald-600">
              {lang === "ar" ? "نشط ومفوض رسمياً" : "Actif & Autorisé"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-muted-foreground">
              {lang === "ar" ? "العمليات المفحوصة:" : "Opérations vérifiées :"}
            </span>
            <span className="font-semibold text-foreground">
              {totalDecisions} {lang === "ar" ? "ملفات" : "dossiers"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-muted-foreground">
              {lang === "ar" ? "عضو منذ:" : "Membre depuis :"}
            </span>
            <span className="text-foreground">
              {new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "بصفتك محققاً معتمداً، تضمن سلامة وموثوقية عمليات الفرز وتوزيع النقاط البيئية. تسجل جميع قراراتك بشكل غير قابل للتعديل في سجل المراجعة والتدقيق."
              : "En tant que vérificateur, vous garantissez la fiabilité des opérations de collecte et des attributions de points écologiques. Toutes vos décisions sont enregistrées dans le journal d'audit."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

