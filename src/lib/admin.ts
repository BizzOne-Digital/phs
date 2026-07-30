import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

export class AdminAuthError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
  }
}

/** Requires an authenticated admin session. Throws AdminAuthError (401) if missing. */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AdminAuthError();
  }
  return session;
}

/** Returns a 401 JSON response, or null when the session is valid. */
export async function requireAdminResponse(): Promise<
  { session: Session; response: null } | { session: null; response: NextResponse }
> {
  try {
    const session = await requireAdmin();
    return { session, response: null };
  } catch {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    details !== undefined ? { error: message, details } : { error: message },
    { status }
  );
}

export function handleRouteError(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
