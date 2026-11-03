import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    return null;
  }
  return session as SessionData & { userId: string; email: string };
}

export async function requireRole(role: "CITIZEN" | "VERIFIER" | "ADMIN") {
  const session = await requireAuth();
  if (!session || session.role !== role) {
    return null;
  }
  return session as SessionData & {
    userId: string;
    email: string;
    role: "CITIZEN" | "VERIFIER" | "ADMIN";
  };
}

export async function requireRoles(roles: ("CITIZEN" | "VERIFIER" | "ADMIN")[]) {
  const session = await requireAuth();
  if (!session || !session.role || !roles.includes(session.role)) {
    return null;
  }
  return session as SessionData & {
    userId: string;
    email: string;
    role: "CITIZEN" | "VERIFIER" | "ADMIN";
  };
}
