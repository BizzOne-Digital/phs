/**
 * Upsert admin password from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 * Usage: npx tsx --env-file=.env.local scripts/update-admin-password.ts
 * For Atlas: set MONGODB_URI to the Atlas URI first (or pass via env).
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AdminUser } from "../src/models/AdminUser";

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "PHS Admin";

  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");

  await mongoose.connect(uri);
  const hash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name,
      email: email.toLowerCase(),
      password: hash,
      role: "admin",
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`✓ Admin password updated for ${email}`);
  console.log(`  Database: ${mongoose.connection.name}`);
  console.log(`  Host: ${mongoose.connection.host}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("❌ Failed:", err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
