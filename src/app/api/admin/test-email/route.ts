import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendTestEmail, verifyEmailTransport, isEmailConfigured } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configured = isEmailConfigured();
  const verify = await verifyEmailTransport();

  return NextResponse.json({
    configured,
    smtpHost: process.env.SMTP_HOST || null,
    smtpUser: process.env.SMTP_USER || null,
    smtpPassSet: Boolean(process.env.SMTP_PASS?.trim()),
    contactEmail: process.env.CONTACT_EMAIL || null,
    verify,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const to = typeof body.to === "string" ? body.to : undefined;
  const result = await sendTestEmail(to);

  return NextResponse.json(result);
}
