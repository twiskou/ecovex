"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { prisma as prismaInstance } from "@/lib/prisma";

// ─── Validation schemas ────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  firstName: z.string().min(2, "Prénom requis (min 2 caractères)").max(50),
  lastName: z.string().min(2, "Nom requis (min 2 caractères)").max(50),
});

// ─── Types ─────────────────────────────────────────────────────────────────

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Login ─────────────────────────────────────────────────────────────────

export async function loginAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
    },
  });

  // Constant-time comparison to prevent timing attacks
  const validPassword = user
    ? await bcrypt.compare(password, user.passwordHash)
    : await bcrypt.compare(password, "$2b$12$invalidhashfortimingequalizer");

  if (!user || !validPassword || !user.isActive) {
    return {
      success: false,
      error: "Email ou mot de passe incorrect.",
    };
  }

  // Create session
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role as "CITIZEN" | "VERIFIER" | "ADMIN";
  session.isLoggedIn = true;
  await session.save();

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
    },
  });

  const redirectTo =
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "VERIFIER"
        ? "/verificateur"
        : "/citoyen";

  return { success: true, data: { redirectTo } };
}

// ─── Register ──────────────────────────────────────────────────────────────

export async function registerAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password, firstName, lastName } = parsed.data;

  // Check existing email
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      success: false,
      error: "Un compte existe déjà avec cet email.",
    };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user and profile atomically
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "CITIZEN",
      isActive: true,
      profile: {
        create: {
          firstName,
          lastName,
          totalPoints: 0,
        },
      },
    },
  });

  // Create session
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.role = "CITIZEN";
  session.isLoggedIn = true;
  await session.save();

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
    },
  });

  return { success: true, data: { redirectTo: "/citoyen" } };
}

// ─── Logout ────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const session = await getSession();

  if (session.userId) {
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "LOGOUT",
        entity: "User",
        entityId: session.userId,
      },
    });
  }

  session.destroy();
}

