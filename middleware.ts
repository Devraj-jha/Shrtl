import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge middleware: gate the authenticated app behind a session.
// Uses the edge-safe config only — no Prisma adapter in the Edge bundle.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!req.auth && !pathname.startsWith("/login")) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return Response.redirect(login);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};