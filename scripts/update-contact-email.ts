import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.local" });
config({ path: ".env" });

const EMAIL = "contact@premierhomeservice.com";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(uri);
  const result = await mongoose.connection.db!.collection("sitesettings").findOneAndUpdate(
    { singletonKey: "site" },
    { $set: { email: EMAIL, contactFormRecipient: EMAIL } },
    { returnDocument: "after" }
  );
  console.log("updated:", {
    email: result?.email,
    contactFormRecipient: result?.contactFormRecipient,
  });
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
