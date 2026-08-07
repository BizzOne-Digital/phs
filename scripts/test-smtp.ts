import { config } from "dotenv";
import nodemailer from "nodemailer";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_EMAIL || user;

  console.log("host=", host);
  console.log("user=", user);
  console.log("passLen=", (pass || "").length);
  console.log("to=", to);

  if (!host || !user || !pass) {
    console.error("Missing SMTP_HOST / SMTP_USER / SMTP_PASS");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  await transporter.verify();
  console.log("SMTP_VERIFY_OK");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || user,
    to,
    subject: `PHS SMTP test ${new Date().toISOString()}`,
    text: "If you received this, SMTP is working.",
    html: "<p>If you received this, <strong>SMTP is working</strong>.</p>",
  });

  console.log("SMTP_SEND_OK", info.messageId);
}

main().catch((e) => {
  console.error("SMTP_FAIL", e?.message || e);
  process.exit(1);
});
