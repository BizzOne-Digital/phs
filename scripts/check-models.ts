import mongoose from "mongoose";
import { Service } from "../src/models/Service";
import { Page } from "../src/models/Page";

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/phs";
  console.log("URI:", uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@"));
  await mongoose.connect(uri);

  const services = await Service.find({}).sort({ displayOrder: 1 }).lean();
  const pages = await Page.find({}).lean();
  console.log("Services:", services.length, services.map((s) => s.name));
  console.log("Pages:", pages.length, pages.map((p) => p.slug));

  await mongoose.disconnect();
}

main().catch(console.error);
