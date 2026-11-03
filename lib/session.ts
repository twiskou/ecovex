import type { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  email?: string;
  role?: "CITIZEN" | "VERIFIER" | "ADMIN";
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "ecovex-session-secret-change-in-production-min-32-chars",
  cookieName: "ecovex_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
