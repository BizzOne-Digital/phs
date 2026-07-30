import nodemailer from "nodemailer";
import { Resend } from "resend";

const from = process.env.EMAIL_FROM || "VNEC <onboarding@resend.dev>";
const contactTo = process.env.CONTACT_EMAIL || "vnecconstruction@gmail.com";

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return;
  }

  console.log("[email:noop]", opts.subject, "→", opts.to);
}

export { isEmailConfigured };

export async function sendLeadNotification(data: {
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  isEmergency: boolean;
  message: string;
  location: string;
}): Promise<void> {
  await sendEmail({
    to: contactTo,
    subject: `${data.isEmergency ? "[EMERGENCY]" : "New"} Lead ${data.referenceNumber} — ${data.serviceCategory}`,
    html: `
      <h2>New Service Request</h2>
      <p><strong>Reference:</strong> ${data.referenceNumber}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Category:</strong> ${data.serviceCategory}</p>
      <p><strong>Emergency:</strong> ${data.isEmergency ? "Yes" : "No"}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
    text: `Lead ${data.referenceNumber} from ${data.name} (${data.phone}) — ${data.serviceCategory}`,
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
      <h2>Thank you, ${data.name}</h2>
      <p>Your request <strong>${data.referenceNumber}</strong> has been received.</p>
      ${
        data.isEmergency
          ? `<p><strong>For immediate emergencies, call us now at ${data.phone}.</strong></p>`
          : `<p>Our team will contact you shortly during business hours.</p>`
      }
      <p>— VNEC Electrical, HVAC &amp; Plumbing</p>
    `,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  await sendEmail({
    to: contactTo,
    subject: `Contact form — ${data.name}`,
    html: `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p>${data.message}</p>
    `,
  });
}
