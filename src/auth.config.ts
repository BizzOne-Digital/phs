import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Node-only imports).
 * Used by middleware / edge runtimes. Full Credentials authorize lives in `src/lib/auth.ts`.
 */
export const authConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLogin = pathname.startsWith("/admin/login");

      if (isAdminRoute && !isLogin) {
        if (!isLoggedIn) return false;
        const role = auth?.user?.role;
        return role === "admin" || role === "editor";
      }

      if (isLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
