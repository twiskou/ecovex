"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

export async function toggleUserStatusAction(userId: string) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  if (userId === session.userId) {
    return { success: false, error: "Vous ne pouvez pas désactiver votre propre compte." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "Utilisateur non trouvé." };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: updated.isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
      entity: "User",
      entityId: userId,
      details: `Statut modifié à: ${updated.isActive ? "Actif" : "Inactif"}`,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${userId}`);
  return { success: true };
}

export async function updateUserRoleAction(userId: string, role: string) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  if (!["CITIZEN", "VERIFIER", "ADMIN"].includes(role)) {
    return { success: false, error: "Rôle invalide." };
  }

  if (userId === session.userId && role !== "ADMIN") {
    return { success: false, error: "Vous ne pouvez pas rétrograder votre propre rôle." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: "UPDATE_USER_ROLE",
      entity: "User",
      entityId: userId,
      details: `Nouveau rôle attribué: ${role}`,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${userId}`);
  revalidatePath("/admin/roles");
  return { success: true };
}

const categorySchema = z.object({
  name: z.string().min(2, "Nom trop court").max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Couleur hexadécimale requise (ex: #10B981)"),
  pointValue: z.coerce.number().min(1, "La valeur en points doit être au moins 1"),
});

export async function createCategoryAction(formData: FormData) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color"),
    pointValue: formData.get("pointValue"),
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Données invalides.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.wasteCategory.findUnique({
    where: { name: parsed.data.name },
  });
  if (existing) {
    return { success: false, error: "Une catégorie avec ce nom existe déjà." };
  }

  const category = await prisma.wasteCategory.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      color: parsed.data.color,
      pointValue: parsed.data.pointValue,
      isActive: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: "CREATE_CATEGORY",
      entity: "WasteCategory",
      entityId: category.id,
      details: `Catégorie créée: ${category.name} (${category.pointValue} pts)`,
    },
  });

  revalidatePath("/admin/categories-dechets");
  return { success: true };
}

export async function toggleCategoryStatusAction(categoryId: string) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  const category = await prisma.wasteCategory.findUnique({ where: { id: categoryId } });
  if (!category) return { success: false, error: "Catégorie non trouvée." };

  const updated = await prisma.wasteCategory.update({
    where: { id: categoryId },
    data: { isActive: !category.isActive },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: updated.isActive ? "ACTIVATE_CATEGORY" : "DEACTIVATE_CATEGORY",
      entity: "WasteCategory",
      entityId: categoryId,
    },
  });

  revalidatePath("/admin/categories-dechets");
  return { success: true };
}

const collectionPointSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(100),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  description: z.string().max(300).optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
});

export async function createCollectionPointAction(formData: FormData) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  const categoryIds = formData.getAll("categoryIds") as string[];

  const raw = {
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    latitude: formData.get("latitude") || null,
    longitude: formData.get("longitude") || null,
    description: formData.get("description") || null,
    categoryIds,
  };

  const parsed = collectionPointSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Données du point de collecte invalides.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const cp = await prisma.collectionPoint.create({
    data: {
      name: parsed.data.name,
      address: parsed.data.address,
      city: parsed.data.city,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      description: parsed.data.description,
      isActive: true,
      acceptedCategories: {
        create: (parsed.data.categoryIds || []).map((catId) => ({
          category: { connect: { id: catId } },
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: "CREATE_COLLECTION_POINT",
      entity: "CollectionPoint",
      entityId: cp.id,
      details: `Nouveau point: ${cp.name} à ${cp.city}`,
    },
  });

  revalidatePath("/admin/points-collecte");
  revalidatePath("/points-collecte");
  revalidatePath("/citoyen/points-collecte");
  return { success: true };
}

export async function adjustPointsAction(data: {
  userId: string;
  amount: number;
  reason: string;
}) {
  const session = await requireRole("ADMIN");
  if (!session) return { success: false, error: "Action non autorisée." };

  if (!data.amount || data.amount === 0) {
    return { success: false, error: "Le montant d'ajustement doit être différent de zéro." };
  }

  if (!data.reason || data.reason.trim().length < 5) {
    return { success: false, error: "Un motif d'au moins 5 caractères est obligatoire pour tout ajustement." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Transaction de points
      await tx.pointTransaction.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          type: "ADJUSTED",
          description: `Ajustement administratif : ${data.reason}`,
          createdById: session.userId,
        },
      });

      // 2. Mise à jour solde
      await tx.userProfile.update({
        where: { userId: data.userId },
        data: {
          totalPoints: {
            increment: data.amount,
          },
        },
      });

      // 3. Log d'audit obligatoire
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "ADJUST_POINTS",
          entity: "PointTransaction",
          details: `Ajustement de ${data.amount} points pour l'utilisateur ${data.userId}. Motif: ${data.reason}`,
        },
      });
    });

    revalidatePath("/admin/points");
    revalidatePath(`/admin/utilisateurs/${data.userId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur ajustement points:", error);
    return { success: false, error: "Échec de l'ajustement des points." };
  }
}

