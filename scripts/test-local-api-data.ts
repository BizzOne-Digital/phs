import mongoose from "mongoose";
import { Service } from "../src/models/Service";
import { Page } from "../src/models/Page";

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/phs";
  console.log("Connecting:", uri.replace(/\/\/.*@/, "//***@"));
  await mongoose.connect(uri);

  const services = await Service.find({}).sort({ displayOrder: 1 }).lean();
  const pages = await Page.find({}).lean();

  console.log("DB:", mongoose.connection.name);
  console.log("Services via model:", services.length);
  if (services[0]) console.log("  first:", (services[0] as { name?: string }).name);

  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection unavailable");
  const raw = await db.collection("services").countDocuments();
  console.log("Services raw collection:", raw);
  console.log("Pages via model:", pages.length);

  await mongoose.disconnect();
}

main().catch(console.error);
