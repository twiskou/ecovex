// Application-level type definitions for string-based "enums"
// SQLite does not support native enum types; these are enforced by Zod and app logic.

export type UserRole = "CITIZEN" | "VERIFIER" | "ADMIN";
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type VerificationDecision = "APPROVED" | "REJECTED";
export type TransactionType = "EARNED" | "ADJUSTED" | "BONUS";
export type AIClassificationStatus = "PENDING" | "COMPLETED" | "UNCERTAIN" | "FAILED";

export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  VERIFIER: "VERIFIER",
  ADMIN: "ADMIN",
} as const;

export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export const VERIFICATION_DECISION = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const TRANSACTION_TYPE = {
  EARNED: "EARNED",
  ADJUSTED: "ADJUSTED",
  BONUS: "BONUS",
} as const;

export const AI_CLASSIFICATION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  UNCERTAIN: "UNCERTAIN",
  FAILED: "FAILED",
} as const;

// Labels for display in French
export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
  CANCELLED: "Annulée",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  CITIZEN: "Citoyen",
  VERIFIER: "Vérificateur",
  ADMIN: "Administrateur",
};

export const VERIFICATION_DECISION_LABELS: Record<VerificationDecision, string> = {
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export const SUBMISSION_STATUS_LABELS_AR: Record<SubmissionStatus, string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "معتمدة",
  REJECTED: "مرفوضة",
  CANCELLED: "ملغاة",
};

export const ROLE_LABELS_AR: Record<UserRole, string> = {
  CITIZEN: "مواطن",
  VERIFIER: "محقّق",
  ADMIN: "مدير النظام",
};

export function getSubmissionStatusLabel(status: SubmissionStatus, lang: "fr" | "ar" = "fr"): string {
  return lang === "ar" ? SUBMISSION_STATUS_LABELS_AR[status] || status : SUBMISSION_STATUS_LABELS[status] || status;
}

export function getRoleLabel(role: UserRole, lang: "fr" | "ar" = "fr"): string {
  return lang === "ar" ? ROLE_LABELS_AR[role] || role : ROLE_LABELS[role] || role;
}


