import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Email magic link is only wired once an SMTP server is configured —
    // an unset AUTH_EMAIL_SERVER must never break the build.
    ...(process.env.AUTH_EMAIL_SERVER
      ? [
          Email({
            server: process.env.AUTH_EMAIL_SERVER,
            from: process.env.AUTH_EMAIL_FROM,
          }),
        ]
      : []),
  ],
});