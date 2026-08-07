import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";

const DEFAULT_TO = "contact@premierhomeservice.com";
const DEFAULT_FROM_NAME = "Premier Home Services";

function env(name: string, fallback = ""): string {
  const value = process.env[name];
  // Treat blank env (e.g. SMTP_PASS= in .env.local) as unset
  if (value == null || !String(value).trim()) return fallback;
  return String(value).trim();
}

function getFromAddress(): string {
  const configured = env("EMAIL_FROM");
  if (configured) return configured;
  const user = env("SMTP_USER", DEFAULT_TO);
  return `${DEFAULT_FROM_NAME} <${user}>`;
}

/** Destination for bookings + contact form alerts (footer / settings email). */
export function resolveNotificationEmail(settings?: {
  email?: string;
  contactFormRecipient?: string;
} | null): string {
  return (
    settings?.contactFormRecipient?.trim() ||
    settings?.email?.trim() ||
    env("CONTACT_EMAIL", DEFAULT_TO) ||
    DEFAULT_TO
  );
}

export function isEmailConfigured(): boolean {
  if (env("RESEND_API_KEY")) return true;
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

let cachedTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = env("SMTP_HOST");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  const port = Number(env("SMTP_PORT", "587"));
  const secure =
    env("SMTP_SECURE") === "true" || port === 465;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (Gmail App Password recommended)."
    );
  }

  cachedTransporter = nodemailer.createTransport({
    // Gmail-friendly config (STARTTLS on 587)
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user,
      // App passwords are often copied with spaces — strip them
      pass: pass.replace(/\s+/g, ""),
    },
    tls: {
      rejectUnauthorized: env("SMTP_TLS_REJECT_UNAUTHORIZED") !== "false",
      minVersion: "TLSv1.2",
    },
  });

  return cachedTransporter;
}

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  const from = getFromAddress();

  if (!opts.to) {
    throw new Error("Missing notification recipient email");
  }

  // Prefer SMTP when fully configured (primary for this project)
  const smtpReady = Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
  if (smtpReady) {
    const transporter = getSmtpTransporter();
    const info = await transporter.sendMail({
      from,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    console.log("[email:smtp]", opts.subject, "→", opts.to, info.messageId);
    return;
  }

  if (env("RESEND_API_KEY")) {
    const resend = new Resend(env("RESEND_API_KEY"));
    await resend.emails.send({
      from,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    console.log("[email:resend]", opts.subject, "→", opts.to);
    return;
  }

  const passSet = Boolean(process.env.SMTP_PASS && String(process.env.SMTP_PASS).trim());
  console.warn(
    "[email:noop] Email not configured — set SMTP_PASS (App Password) in .env.local.",
    "host=",
    process.env.SMTP_HOST || "(missing)",
    "user=",
    process.env.SMTP_USER || "(missing)",
    "pass=",
    passSet ? "set" : "EMPTY",
    "| skipped:",
    opts.subject,
    "→",
    opts.to
  );
  throw new Error(
    "Email not configured: SMTP_PASS is empty. Add a Google Workspace App Password to .env.local and restart the server."
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value?: string | boolean | null): string {
  if (value === undefined || value === null || value === "") return "";
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : escapeHtml(String(value));
  return `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#0f172a;">${display}</td></tr>`;
}

export type LeadNotificationInput = {
  to?: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  specificService?: string;
  isEmergency: boolean;
  message: string;
  location: string;
  propertyType?: string;
  customerType?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: string;
};

export async function sendLeadNotification(data: LeadNotificationInput): Promise<void> {
  const to = data.to || resolveNotificationEmail();
  const subject = `${data.isEmergency ? "[EMERGENCY] " : ""}New booking ${data.referenceNumber} — ${data.serviceCategory}`;

  await sendEmail({
    to,
    replyTo: data.email,
    subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="color:#0f172a;margin-bottom:8px;">New service booking</h2>
        <p style="color:#64748b;margin-top:0;">A customer submitted a request on the website.</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          ${row("Reference", data.referenceNumber)}
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Category", data.serviceCategory)}
          ${row("Service", data.specificService)}
          ${row("Emergency", data.isEmergency)}
          ${row("Property", data.propertyType)}
          ${row("Customer type", data.customerType)}
          ${row("Location", data.location)}
          ${row("Preferred date", data.preferredDate)}
          ${row("Preferred time", data.preferredTime)}
          ${row("Source", data.source || "request-service")}
        </table>
        <h3 style="color:#0f172a;margin:20px 0 8px;">Issue details</h3>
        <p style="white-space:pre-wrap;color:#0f172a;background:#f8fafc;padding:12px;border-radius:8px;">${escapeHtml(data.message)}</p>
      </div>
    `,
    text: [
      `New booking ${data.referenceNumber}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Category: ${data.serviceCategory}`,
      data.specificService ? `Service: ${data.specificService}` : "",
      `Emergency: ${data.isEmergency ? "Yes" : "No"}`,
      `Location: ${data.location}`,
      `Details: ${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendLeadConfirmation(data: {
  to: string;
  name: string;
  referenceNumber: string;
  isEmergency: boolean;
  phone: string;
}): Promise<void> {
  await sendEmail({
    to: data.to,
    subject: `We received your request — ${data.referenceNumber}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="color:#0f172a;">Thank you, ${escapeHtml(data.name)}</h2>
        <p>Your request <strong>${escapeHtml(data.referenceNumber)}</strong> has been received.</p>
        ${
          data.isEmergency
            ? `<p><strong>For immediate emergencies, call us now at ${escapeHtml(data.phone)}.</strong></p>`
            : `<p>Our team will contact you shortly during business hours.</p>`
        }
        <p style="color:#64748b;">— Premier Home Services · Electrical, HVAC &amp; Plumbing</p>
      </div>
    `,
    text: `Thank you ${data.name}. Reference ${data.referenceNumber}. ${
      data.isEmergency ? `For emergencies call ${data.phone}.` : "We will contact you shortly."
    }`,
  });
}

export type ContactNotificationInput = {
  to?: string;
  referenceNumber?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceCategory?: string;
  propertyType?: string;
  customerType?: string;
  location?: string;
  isEmergency?: boolean;
  preferredDate?: string;
  preferredTime?: string;
};

export async function sendContactNotification(data: ContactNotificationInput): Promise<void> {
  const to = data.to || resolveNotificationEmail();
  const subject = `${data.isEmergency ? "[EMERGENCY] " : ""}Contact form — ${data.name}`;

  await sendEmail({
    to,
    replyTo: data.email,
    subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="color:#0f172a;margin-bottom:8px;">New contact form inquiry</h2>
        <p style="color:#64748b;margin-top:0;">Someone submitted the website contact form.</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          ${row("Reference", data.referenceNumber)}
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Category", data.serviceCategory)}
          ${row("Property", data.propertyType)}
          ${row("Customer type", data.customerType)}
          ${row("Location", data.location)}
          ${row("Emergency", data.isEmergency)}
          ${row("Preferred date", data.preferredDate)}
          ${row("Preferred time", data.preferredTime)}
        </table>
        <h3 style="color:#0f172a;margin:20px 0 8px;">Message</h3>
        <p style="white-space:pre-wrap;color:#0f172a;background:#f8fafc;padding:12px;border-radius:8px;">${escapeHtml(data.message)}</p>
      </div>
    `,
    text: [
      `Contact inquiry from ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      data.serviceCategory ? `Category: ${data.serviceCategory}` : "",
      `Message: ${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

/** Optional startup / admin health check */
export async function verifyEmailTransport(): Promise<{ ok: boolean; via: string; error?: string }> {
  try {
    if (env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS")) {
      await getSmtpTransporter().verify();
      return { ok: true, via: "smtp" };
    }
    if (env("RESEND_API_KEY")) {
      return { ok: true, via: "resend" };
    }
    return { ok: false, via: "none", error: "No SMTP or Resend credentials configured" };
  } catch (e) {
    return {
      ok: false,
      via: "smtp",
      error: e instanceof Error ? e.message : "SMTP verify failed",
    };
  }
}
