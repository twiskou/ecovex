"use client";

import { useState } from "react";
import { Target, CheckCircle2, Trophy, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { saveEcologicalGoalAction } from "@/app/actions/empreinte";
import type { EcologicalGoalData } from "@/app/actions/empreinte";

interface EmpreinteGoalsCardProps {
  goal: EcologicalGoalData | null;
}

export function EmpreinteGoalsCard({ goal }: EmpreinteGoalsCardProps) {
  const { lang, t } = useLang();
  const [targetInput, setTargetInput] = useState<string>(goal ? String(goal.targetKg) : "20");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(false);

    const formData = new FormData();
    formData.append("targetKg", targetInput);

    try {
      const res = await saveEcologicalGoalAction(formData);
      if (res.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 4000);
      } else {
        setErrorMsg(res.error || "Erreur de sauvegarde");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = goal?.progressPercent ?? 0;
  const isAchieved = goal?.isAchieved ?? false;

  return (
    <Card className="text-start border-border/70 shadow-xs h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={18} className="text-primary" />
              {t.empreinte.goalsTitle}
            </CardTitle>
            <CardDescription>{t.empreinte.goalsSub}</CardDescription>
          </div>
          {isAchieved && (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 gap-1 text-xs">
              <Trophy size={13} />
              {lang === "ar" ? "مكتمل" : "Atteint"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Display */}
        {goal && (
          <div className="space-y-2 p-4 rounded-xl bg-muted/40 border border-border/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                {t.empreinte.currentProgress}
              </span>
              <span className="font-bold text-foreground">
                {goal.currentKg} / {goal.targetKg} kg ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isAchieved ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {isAchieved && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle2 size={14} className="shrink-0" />
                {t.empreinte.goalAchieved}
              </p>
            )}
          </div>
        )}

        {/* Set / Update Target Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-xs font-medium text-foreground block">
            {t.empreinte.targetKgLabel}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="5000"
              step="0.5"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              required
              className="text-sm font-semibold max-w-[140px]"
            />
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="gap-1.5 font-medium shrink-0"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? t.empreinte.savingGoal : t.empreinte.setGoal}
            </Button>
          </div>

          {successMsg && (
            <p className="text-xs text-emerald-600 font-medium animate-fadeIn">
              ✓ {t.empreinte.goalSaved}
            </p>
          )}

          {errorMsg && (
            <p className="text-xs text-destructive font-medium">
              ✗ {errorMsg}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

