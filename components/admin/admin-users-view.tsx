"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

interface UserItem {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    totalPoints: number | null;
  } | null;
}

export function AdminUsersView({
  users,
  currentRole,
}: {
  users: UserItem[];
  currentRole?: string;
}) {
  const { lang, t } = useLang();

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return <Badge variant="destructive" className="text-xs">{t.roles.ADMIN}</Badge>;
    if (role === "VERIFIER") return <Badge variant="secondary" className="text-xs">{t.roles.VERIFIER}</Badge>;
    return <Badge variant="outline" className="text-xs">{t.roles.CITIZEN}</Badge>;
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {lang === "ar" ? "الحوكمة والإشراف" : "Gouvernance"}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.admin.users}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar"
              ? "استعراض الحسابات المسجلة، تعديل الصلاحيات وإدارة الوصول والأرصدة."
              : "Consultez les comptes enregistrés, modifiez les rôles et gérez les accès."}
          </p>
        </div>
      </div>

      {/* Role filter buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button variant={!currentRole ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/utilisateurs">{t.common.all} ({users.length})</Link>
        </Button>
        <Button variant={currentRole === "CITIZEN" ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/utilisateurs?role=CITIZEN">{t.roles.CITIZEN}</Link>
        </Button>
        <Button variant={currentRole === "VERIFIER" ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/utilisateurs?role=VERIFIER">{t.roles.VERIFIER}</Link>
        </Button>
        <Button variant={currentRole === "ADMIN" ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/utilisateurs?role=ADMIN">{t.roles.ADMIN}</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-start text-xs font-semibold text-muted-foreground">
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الاسم الكامل" : "Nom complet"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "الدور" : "Rôle"}</th>
                  <th className="px-6 py-3.5 text-start">{t.common.points}</th>
                  <th className="px-6 py-3.5 text-start">{t.common.status}</th>
                  <th className="px-6 py-3.5 text-start">{lang === "ar" ? "تاريخ التسجيل" : "Inscrit le"}</th>
                  <th className="px-6 py-3.5 text-end">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {u.profile?.firstName} {u.profile?.lastName}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary whitespace-nowrap text-xs">
                      {u.profile?.totalPoints || 0} {t.common.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={u.isActive ? "default" : "secondary"} className="text-xs">
                        {u.isActive
                          ? (lang === "ar" ? "نشط" : "Actif")
                          : (lang === "ar" ? "معطل" : "Désactivé")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-medium">
                        <Link href={`/admin/utilisateurs/${u.id}`}>
                          {lang === "ar" ? "إدارة" : "Gérer"}
                          <ArrowRight size={14} className="rtl:rotate-180" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

