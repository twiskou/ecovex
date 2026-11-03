"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRoles } from "@/lib/auth";
import { z } from "zod";

const verifySchema = z.object({
  submissionId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(500).optional().nullable(),
});

export async function processVerificationAction(data: {
  submissionId: string;
  decision: "APPROVED" | "REJECTED";
  reason?: string;
}) {
  const session = await requireRoles(["VERIFIER", "ADMIN"]);
  if (!session) {
    return { success: false, error: "Accès non autorisé." };
  }

  const parsed = verifySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données de décision invalides." };
  }

  const { submissionId, decision, reason } = parsed.data;

  // Récupérer la soumission
  const submission = await prisma.collectionSubmission.findUnique({
    where: { id: submissionId },
    include: {
      category: true,
      citizen: { include: { profile: true } },
      pointTransaction: true,
      verification: true,
    },
  });

  if (!submission) {
    return { success: false, error: "Déclaration introuvable." };
  }

  if (submission.status !== "PENDING") {
    return { success: false, error: "Cette déclaration a déjà été traitée." };
  }

  // Calcul atomique des points
  let pointsAwarded = 0;
  if (decision === "APPROVED") {
    const basePoints = submission.category?.pointValue || 10;
    const factor = submission.quantityKg && submission.quantityKg > 0
      ? Math.max(1, Math.round(submission.quantityKg))
      : 1;
    pointsAwarded = basePoints * factor;
  }

  // Exécution atomique
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour la soumission
      await tx.collectionSubmission.update({
        where: { id: submissionId },
        data: {
          status: decision,
        },
      });

      // 2. Créer l'enregistrement de vérification
      await tx.verification.create({
        data: {
          submissionId,
          verifierId: session.userId,
          decision,
          reason: reason || null,
        },
      });

      // 3. Si approuvée, créer la transaction de points et incrémenter le solde
      if (decision === "APPROVED" && pointsAwarded > 0) {
        await tx.pointTransaction.create({
          data: {
            userId: submission.citizenId,
            submissionId: submission.id,
            amount: pointsAwarded,
            type: "EARNED",
            description: `Collecte validée - ${submission.category?.name || "Déchets"} (${submission.quantityKg || "quantité estimée"} kg)`,
            createdById: session.userId,
          },
        });

        await tx.userProfile.update({
          where: { userId: submission.citizenId },
          data: {
            totalPoints: {
              increment: pointsAwarded,
            },
          },
        });
      }

      // 4. Log d'audit
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: decision === "APPROVED" ? "VERIFY_APPROVE" : "VERIFY_REJECT",
          entity: "CollectionSubmission",
          entityId: submissionId,
          details: `Décision: ${decision}. Points attribués: ${pointsAwarded}. Motif: ${reason || "Aucun"}`,
        },
      });
    });

    revalidatePath("/verificateur");
    revalidatePath("/verificateur/operations");
    revalidatePath(`/verificateur/operations/${submissionId}`);
    revalidatePath("/verificateur/historique");
    revalidatePath("/citoyen");
    revalidatePath("/citoyen/points");

    return { success: true };
  } catch (error) {
    console.error("Erreur transaction vérification:", error);
    return { success: false, error: "Une erreur est survenue lors du traitement." };
  }
}

