import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config used by middleware. No Prisma adapter and no
 * Node-only providers here — they live in auth.ts so the Edge bundle stays
 * small and runtime-safe.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [], // providers are attached in auth.ts
  callbacks: {
    authorized({ auth: session, request }) {
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return !!session;
      return true;
    },
  },
} satisfies NextAuthConfig;