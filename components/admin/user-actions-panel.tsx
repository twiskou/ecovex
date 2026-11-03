"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Award, Power, Loader2 } from "lucide-react";
import { toggleUserStatusAction, updateUserRoleAction, adjustPointsAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

interface UserActionsPanelProps {
  userId: string;
  isActive: boolean;
  currentRole: string;
  userPoints: number;
}

export function UserActionsPanel({
  userId,
  isActive,
  currentRole,
  userPoints,
}: UserActionsPanelProps) {
  const router = useRouter();
  const { lang, t } = useLang();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const [pointsAmount, setPointsAmount] = useState<number>(0);
  const [pointsReason, setPointsReason] = useState<string>("");

  const handleToggleStatus = async () => {
    setLoadingStatus(true);
    const res = await toggleUserStatusAction(userId);
    if (res.success) {
      toast.success(lang === "ar" ? "تم تحديث حالة المستخدم بنجاح." : "Statut de l'utilisateur mis à jour.");
      router.refresh();
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ في التحديث" : "Erreur de mise à jour"));
    }
    setLoadingStatus(false);
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setLoadingRole(true);
    const res = await updateUserRoleAction(userId, newRole);
    if (res.success) {
      toast.success(lang === "ar" ? `تم تغيير الرتبة إلى ${newRole} بنجاح.` : `Rôle modifié avec succès en ${newRole}.`);
      router.refresh();
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ في تعديل الرتبة" : "Erreur de changement de rôle"));
    }
    setLoadingRole(false);
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsAmount === 0) {
      toast.error(lang === "ar" ? "يجب أن تكون القيمة مختلفة عن الصفر." : "Le montant doit être différent de zéro.");
      return;
    }
    if (!pointsReason || pointsReason.trim().length < 5) {
      toast.error(lang === "ar" ? "يجب إدخال سبب للتعديل من 5 أحرف على الأقل." : "Un motif de 5 caractères minimum est requis.");
      return;
    }

    setLoadingPoints(true);
    const res = await adjustPointsAction({
      userId,
      amount: pointsAmount,
      reason: pointsReason,
    });

    if (res.success) {
      toast.success(
        lang === "ar"
          ? `تم ضبط الرصيد بمقدار ${pointsAmount > 0 ? "+" : ""}${pointsAmount} نقطة.`
          : `Solde ajusté de ${pointsAmount > 0 ? "+" : ""}${pointsAmount} points.`
      );
      setPointsAmount(0);
      setPointsReason("");
      router.refresh();
    } else {
      toast.error(res.error || (lang === "ar" ? "خطأ في تعديل النقاط" : "Erreur lors de l'ajustement"));
    }
    setLoadingPoints(false);
  };

  return (
    <div className="space-y-6">
      {/* Account controls */}
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            {lang === "ar" ? "إدارة الحالة والصلاحيات" : "Gestion du statut et des permissions"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-start">
              <p className="text-xs font-semibold text-foreground">
                {lang === "ar" ? "حالة الحساب" : "Statut du compte"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isActive
                  ? (lang === "ar" ? "الحساب نشط ويستطيع تسجيل الدخول." : "Le compte est actif et peut se connecter.")
                  : (lang === "ar" ? "الحساب معطل وموقوف مؤقتاً." : "Le compte est suspendu.")}
              </p>
            </div>
            <Button
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleStatus}
              disabled={loadingStatus}
              className="gap-1.5"
            >
              <Power size={14} />
              {isActive
                ? (lang === "ar" ? "تعطيل" : "Désactiver")
                : (lang === "ar" ? "تفعيل" : "Activer")}
            </Button>
          </div>

          <div className="pt-2 border-t border-border/60 text-start">
            <label htmlFor="role-select" className="text-xs font-semibold text-foreground block mb-1.5">
              {lang === "ar" ? "الرتبة الممنوحة" : "Rôle attribué"}
            </label>
            <select
              id="role-select"
              value={currentRole}
              onChange={handleRoleChange}
              disabled={loadingRole}
              className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-xs focus:ring-2 focus:ring-ring/50 outline-none text-start"
            >
              <option value="CITIZEN">CITIZEN ({t.roles.CITIZEN})</option>
              <option value="VERIFIER">VERIFIER ({t.roles.VERIFIER})</option>
              <option value="ADMIN">ADMIN ({t.roles.ADMIN})</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Controlled Points Adjustment */}
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Award size={16} className="text-primary" />
            {t.admin.adjustPointsTitle}
          </CardTitle>
          <CardDescription className="text-xs">
            {t.admin.adjustPointsHelp}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdjustPoints} className="space-y-3">
            <div className="text-start">
              <label htmlFor="amount" className="text-xs font-medium text-foreground block mb-1">
                {lang === "ar" ? "قيمة التعديل (موجبة أو سالبة)" : "Montant à ajuster (positif ou négatif)"}
              </label>
              <Input
                id="amount"
                type="number"
                value={pointsAmount || ""}
                onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                placeholder="Ex: 50 ou -20"
                disabled={loadingPoints}
                className="text-start"
              />
            </div>

            <div className="text-start">
              <label htmlFor="reason" className="text-xs font-medium text-foreground block mb-1">
                {t.admin.auditReason}
              </label>
              <Input
                id="reason"
                type="text"
                value={pointsReason}
                onChange={(e) => setPointsReason(e.target.value)}
                placeholder={lang === "ar" ? "مثال: تصحيح خطأ في الوزن أثناء التسليم" : "Ex: Correction suite à erreur de pesée"}
                disabled={loadingPoints}
                className="text-start"
              />
            </div>

            <Button type="submit" size="sm" disabled={loadingPoints} className="w-full font-medium">
              {loadingPoints ? (
                <>
                  <Loader2 size={14} className="animate-spin ltr:mr-1 rtl:ml-1" />
                  {lang === "ar" ? "جارٍ الضبط..." : "Ajustement en cours..."}
                </>
              ) : (
                lang === "ar" ? "اعتماد وضبط النقاط" : "Valider l'ajustement"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
