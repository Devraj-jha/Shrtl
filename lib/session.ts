import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Resolve the signed-in user's DB record (with plan) from the session.
 * Returns null when no session is present — the caller decides the response.
 */
export async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user || !email) return null;
  return prisma.user.findUnique({ where: { email } });
}

/** Variant that throws typed 401/response-friendly results for API routes. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}