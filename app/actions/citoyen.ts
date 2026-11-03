"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import { classifyWasteImage } from "@/lib/ai-classification";
import { z } from "zod";

export async function classifyWastePhotoAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) {
    return { success: false, error: "Vous devez être connecté pour analyser une photo." };
  }

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Veuillez sélectionner une image valide." };
  }

  const uploadResult = await saveUploadedFile(file);
  if (uploadResult.error || !uploadResult.url) {
    return { success: false, error: uploadResult.error || "Échec de l'enregistrement de l'image." };
  }

  const classification = await classifyWasteImage(uploadResult.url, file.name, session.userId);

  // Enregistrement dans la base
  const record = await prisma.aIClassification.create({
    data: {
      imageUrl: uploadResult.url,
      predictedCategory: classification.categoryName,
      confidence: classification.confidence,
      rawResult: classification.rawResult,
      status: classification.status,
      submittedById: session.userId,
      categoryId: classification.categoryId,
    },
  });

  return {
    success: true,
    data: {
      id: record.id,
      imageUrl: record.imageUrl,
      categoryName: classification.categoryName,
      categoryId: classification.categoryId,
      confidence: classification.confidence,
      status: classification.status,
      disclaimer: classification.disclaimer,
      itemIdentified: classification.itemIdentified,
      material: classification.material,
      sortingAdvice: classification.sortingAdvice,
      isAiPowered: classification.isAiPowered,
    },
  };
}

const submissionSchema = z.object({
  collectionPointId: z.string().min(1, "Veuillez sélectionner un point de collecte."),
  categoryId: z.string().min(1, "Veuillez sélectionner une catégorie de déchets."),
  classificationId: z.string().optional().nullable(),
  quantityKg: z.coerce.number().positive("La quantité doit être supérieure à 0.").optional(),
  estimatedQuantity: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

export async function submitCollectionAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) {
    return { success: false, error: "Vous devez être connecté pour déclarer une collecte." };
  }

  const file = formData.get("photo") as File | null;
  let imageUrl = "";

  if (file && file.size > 0) {
    const uploadResult = await saveUploadedFile(file);
    if (uploadResult.error || !uploadResult.url) {
      return { success: false, error: uploadResult.error || "Erreur lors du téléchargement de l'image." };
    }
    imageUrl = uploadResult.url;
  }

  const classificationId = formData.get("classificationId") as string | null;
  const rawData = {
    collectionPointId: formData.get("collectionPointId"),
    categoryId: formData.get("categoryId"),
    classificationId: classificationId || undefined,
    quantityKg: formData.get("quantityKg") || undefined,
    estimatedQuantity: formData.get("estimatedQuantity") === "true",
    notes: formData.get("notes") || undefined,
  };

  const parsed = submissionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Veuillez vérifier les informations saisies.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const submission = await prisma.collectionSubmission.create({
    data: {
      citizenId: session.userId,
      collectionPointId: parsed.data.collectionPointId,
      categoryId: parsed.data.categoryId,
      classificationId: parsed.data.classificationId || null,
      quantityKg: parsed.data.quantityKg || null,
      estimatedQuantity: parsed.data.estimatedQuantity,
      notes: parsed.data.notes || null,
      imageUrls: JSON.stringify(imageUrl ? [imageUrl] : []),
      status: "PENDING",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: "SUBMIT_COLLECTION",
      entity: "CollectionSubmission",
      entityId: submission.id,
      details: `Déclaration de collecte soumise pour la catégorie ${parsed.data.categoryId}`,
    },
  });

  revalidatePath("/citoyen");
  revalidatePath("/citoyen/operations");

  return { success: true, data: { submissionId: submission.id } };
}

const profileSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court").max(50),
  lastName: z.string().min(2, "Nom trop court").max(50),
  phone: z.string().max(20).optional().nullable(),
  city: z.string().max(50).optional().nullable(),
});

export async function updateProfileAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) {
    return { success: false, error: "Non autorisé." };
  }

  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone") || null,
    city: formData.get("city") || null,
  };

  const parsed = profileSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données de profil invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.userProfile.upsert({
    where: { userId: session.userId },
    update: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      city: parsed.data.city,
    },
    create: {
      userId: session.userId,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      city: parsed.data.city,
      totalPoints: 0,
    },
  });

  revalidatePath("/citoyen/profil");
  return { success: true };
}

