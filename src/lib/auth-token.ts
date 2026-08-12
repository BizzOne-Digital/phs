import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

/** Auth.js uses __Secure- cookie names on HTTPS; middleware must match. */
function isSecureAuthCookie(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }
  return request.nextUrl.protocol === "https:";
}

export async function readAuthToken(request: NextRequest) {
  return getToken({
    req: request,
    secret: authSecret,
    secureCookie: isSecureAuthCookie(request),
  });
}
