"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserActionsPanel } from "@/components/admin/user-actions-panel";
import { useLang } from "@/lib/i18n";

interface SubmissionItem {
  id: string;
  status: string;
  submittedAt: Date;
  category?: { name: string } | null;
  collectionPoint?: { name: string } | null;
}

interface UserDetailProps {
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    profile?: {
      firstName: string | null;
      lastName: string | null;
      city: string | null;
      phone: string | null;
      totalPoints: number | null;
    } | null;
    submissions: SubmissionItem[];
  };
}

export function AdminUserDetailView({ user }: UserDetailProps) {
  const { lang, t } = useLang();

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return <Badge variant="destructive" className="text-xs">{t.roles.ADMIN}</Badge>;
    if (role === "VERIFIER") return <Badge variant="secondary" className="text-xs">{t.roles.VERIFIER}</Badge>;
    return <Badge variant="outline" className="text-xs">{t.roles.CITIZEN}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-start">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1 px-2 font-medium">
          <Link href="/admin/utilisateurs">
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {lang === "ar" ? "العودة إلى المستخدمين" : "Retour aux utilisateurs"}
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground font-mono">
          {lang === "ar" ? "المستخدم #" : "Utilisateur #"}{user.id.slice(-6)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info & History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {user.profile?.firstName} {user.profile?.lastName}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">{user.email}</CardDescription>
                </div>
                {getRoleBadge(user.role)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-muted/40">
                <div>
                  <span className="text-muted-foreground block">
                    {lang === "ar" ? "المدينة:" : "Ville :"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.profile?.city || (lang === "ar" ? "غير محددة" : "Non spécifiée")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    {lang === "ar" ? "رقم الهاتف:" : "Téléphone :"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.profile?.phone || (lang === "ar" ? "غير محدد" : "Non spécifié")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    {lang === "ar" ? "الرصيد الإجمالي:" : "Solde total :"}
                  </span>
                  <span className="font-bold text-primary">
                    {user.profile?.totalPoints || 0} {t.common.points}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    {lang === "ar" ? "تاريخ التسجيل:" : "Date d'inscription :"}
                  </span>
                  <span className="text-foreground">
                    {new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's recent submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                {lang === "ar" ? "أحدث العمليات المصرح بها" : "Dernières opérations déclarées"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {user.submissions.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  {lang === "ar"
                    ? "لم يقم هذا المستخدم بالتصريح عن أي عملية بعد."
                    : "Aucune opération déclarée par cet utilisateur."}
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {user.submissions.map((sub) => (
                    <div key={sub.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-foreground">
                          {sub.category?.name || (lang === "ar" ? "فئة مجهولة" : "Catégorie inconnue")}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          {sub.collectionPoint?.name} &bull;{" "}
                          {new Date(sub.submittedAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {sub.status === "APPROVED"
                          ? t.statuses.APPROVED
                          : sub.status === "REJECTED"
                            ? t.statuses.REJECTED
                            : t.statuses.PENDING}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions Panel */}
        <div>
          <UserActionsPanel
            userId={user.id}
            isActive={user.isActive}
            currentRole={user.role}
            userPoints={user.profile?.totalPoints || 0}
          />
        </div>
      </div>
    </div>
  );
}

