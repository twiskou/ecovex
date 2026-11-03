"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { processVerificationAction } from "@/app/actions/verifier";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

interface VerificationActionPanelProps {
  submissionId: string;
  pointsToAward: number;
  categoryName: string;
}

export function VerificationActionPanel({
  submissionId,
  pointsToAward,
  categoryName,
}: VerificationActionPanelProps) {
  const router = useRouter();
  const { lang, t } = useLang();

  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const result = await processVerificationAction({
      submissionId,
      decision: "APPROVED",
      reason: undefined,
    });

    if (result.success) {
      toast.success(
        lang === "ar"
          ? `تم اعتماد العملية بنجاح! تم منح ${pointsToAward} نقطة للمواطن تلقائياً.`
          : `Opération approuvée ! ${pointsToAward} points crédités automatiquement.`,
        { duration: 5000 }
      );
      setApproveDialogOpen(false);
      router.push("/verificateur/operations");
      router.refresh();
    } else {
      toast.error(
        result.error ||
          (lang === "ar"
            ? "حدث خطأ أثناء معالجة الاعتماد."
            : "Une erreur est survenue lors de l'approbation.")
      );
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason || reason.trim().length < 5) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    setLoading(true);

    const result = await processVerificationAction({
      submissionId,
      decision: "REJECTED",
      reason: reason.trim(),
    });

    if (result.success) {
      toast.info(
        lang === "ar"
          ? "تم رفض العملية وتسجيل السبب في سجل المراجعة."
          : "Déclaration rejetée. Le motif a été consigné dans l'audit.",
        { duration: 5000 }
      );
      setRejectDialogOpen(false);
      router.push("/verificateur/operations");
      router.refresh();
    } else {
      toast.error(
        result.error ||
          (lang === "ar"
            ? "حدث خطأ أثناء تسجيل الرفض."
            : "Une erreur est survenue lors du rejet.")
      );
      setLoading(false);
    }
  };

  const closeRejectDialog = () => {
    if (!loading) {
      setRejectDialogOpen(false);
      setReason("");
      setReasonError(false);
    }
  };

  return (
    <>
      {/* ── Main Decision Card ── */}
      <Card className="border-primary/30 shadow-sm">
        <CardHeader className="text-start pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            {lang === "ar" ? "قرار التحقق والاعتماد" : t.verificateur.decisionTitle}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            {lang === "ar"
              ? "المصادقة على العملية ستمنح النقاط البيئية تلقائياً للمواطن عبر معاملة ذرية آمنة في قاعدة البيانات."
              : t.verificateur.decisionHelp}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Points preview */}
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-start">
            <span className="font-bold text-primary uppercase block mb-0.5">
              {lang === "ar" ? "النقاط المستحقة للمواطن:" : "Attribution calculée :"}
            </span>
            <p className="text-foreground leading-relaxed">
              {lang === "ar" ? (
                <>
                  في حال قبول العملية، سيتم إضافة{" "}
                  <strong className="text-primary font-bold text-sm">
                    {pointsToAward} نقطة
                  </strong>{" "}
                  تلقائياً إلى رصيد المواطن.
                </>
              ) : (
                <>
                  Si vous approuvez cette opération,{" "}
                  <strong className="text-primary font-bold text-sm">
                    {pointsToAward} points
                  </strong>{" "}
                  seront automatiquement crédités sur le solde du citoyen.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons — both always visible */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* APPROVE */}
            <Button
              type="button"
              onClick={() => setApproveDialogOpen(true)}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
              size="lg"
            >
              <CheckCircle size={18} />
              {lang === "ar"
                ? `المصادقة على العملية (+${pointsToAward} نقاط)`
                : `${t.verificateur.approveBtn} (+${pointsToAward} ${t.common.points})`}
            </Button>

            {/* REJECT */}
            <Button
              type="button"
              onClick={() => {
                setReason("");
                setReasonError(false);
                setRejectDialogOpen(true);
              }}
              variant="destructive"
              className="flex-1 gap-2 font-semibold shadow-sm"
              size="lg"
            >
              <XCircle size={18} />
              {lang === "ar" ? "رفض العملية" : t.verificateur.rejectBtn}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Approve Confirmation Dialog ── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md" showCloseButton={!loading}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle size={20} />
              {lang === "ar" ? "تأكيد الاعتماد" : "Confirmer l'approbation"}
            </DialogTitle>
            <DialogDescription className="text-start pt-1 leading-relaxed">
              {lang === "ar" ? (
                <>
                  سيتم اعتماد هذه العملية وإضافة{" "}
                  <strong className="text-foreground font-bold">
                    {pointsToAward} نقطة
                  </strong>{" "}
                  إلى رصيد المواطن فوراً. هذه العملية لا يمكن التراجع عنها.
                </>
              ) : (
                <>
                  Cette action approuvera la déclaration et créditera{" "}
                  <strong className="text-foreground font-bold">
                    {pointsToAward} points
                  </strong>{" "}
                  sur le compte du citoyen immédiatement. Action irréversible.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Audit notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
            <ShieldCheck size={14} className="shrink-0 mt-0.5" />
            <span>
              {lang === "ar"
                ? "ستُسجَّل هذه القرار في سجل المراجعة مع هوية المحقق والتاريخ."
                : "Cette décision sera enregistrée dans le journal d'audit avec l'identité du vérificateur."}
            </span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1"
              onClick={() => setApproveDialogOpen(false)}
            >
              {lang === "ar" ? "إلغاء" : "Annuler"}
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              {loading
                ? lang === "ar" ? "جارٍ المعالجة..." : "Traitement..."
                : lang === "ar" ? "نعم، اعتماد" : "Oui, approuver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Confirmation Dialog ── */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => { if (!open) closeRejectDialog(); }}
      >
        <DialogContent className="max-w-md" showCloseButton={!loading}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle size={20} />
              {lang === "ar" ? "تأكيد الرفض" : "Confirmer le rejet"}
            </DialogTitle>
            <DialogDescription className="text-start pt-1 leading-relaxed">
              {lang === "ar"
                ? "يجب توضيح سبب الرفض. سيظهر هذا السبب في سجل المراجعة وسيكون مرئياً للمشرفين."
                : "Vous devez indiquer un motif de rejet. Il sera consigné dans l'audit et visible par les administrateurs."}
            </DialogDescription>
          </DialogHeader>

          {/* Reason textarea */}
          <div className="space-y-2">
            <label
              htmlFor="reject-reason"
              className="text-xs font-bold text-destructive flex items-center gap-1.5"
            >
              <AlertTriangle size={13} />
              {lang === "ar" ? "سبب القرار (إلزامي)" : t.verificateur.reasonLabel}
            </label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim().length >= 5) setReasonError(false);
              }}
              placeholder={
                lang === "ar"
                  ? "اكتب سبب الرفض بوضوح وبالتفصيل..."
                  : t.verificateur.reasonPlaceholder
              }
              rows={4}
              disabled={loading}
              maxLength={500}
              className={`resize-none text-start transition-colors ${
                reasonError
                  ? "border-destructive ring-1 ring-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            />
            {reasonError && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                {lang === "ar"
                  ? "يرجى إدخال سبب واضح (5 أحرف على الأقل)."
                  : "Le motif doit comporter au moins 5 caractères."}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-end">
              {reason.length} / 500
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/8 border border-destructive/20 text-xs text-destructive/90">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>
              {lang === "ar"
                ? "لن يحصل المواطن على أي نقاط وسيُرفض التصريح نهائياً."
                : "Aucun point ne sera attribué. La décision de rejet est définitive."}
            </span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1"
              onClick={closeRejectDialog}
            >
              {lang === "ar" ? "إلغاء" : "Annuler"}
            </Button>
            <Button
              type="button"
              onClick={handleReject}
              disabled={loading || !reason.trim()}
              variant="destructive"
              className="flex-1 gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              {loading
                ? lang === "ar" ? "جارٍ المعالجة..." : "Traitement..."
                : lang === "ar" ? "نعم، رفض العملية" : "Oui, rejeter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
