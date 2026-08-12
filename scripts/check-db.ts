import mongoose from "mongoose";

async function inspect(uri: string) {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection unavailable");
  const dbName = mongoose.connection.name;
  const cols = await db.listCollections().toArray();
  console.log(`\n=== ${uri} (db: ${dbName}) ===`);
  if (cols.length === 0) {
    console.log("(no collections)");
  }
  for (const c of cols) {
    const n = await db.collection(c.name).countDocuments();
    console.log(`  ${c.name}: ${n}`);
  }
  await mongoose.disconnect();
}

async function main() {
  const uris = [
    process.env.MONGODB_URI,
    "mongodb://127.0.0.1:27017/phs",
  ].filter(Boolean) as string[];

  const seen = new Set<string>();
  for (const uri of uris) {
    if (seen.has(uri)) continue;
    seen.add(uri);
    try {
      await inspect(uri);
    } catch (err) {
      console.log(`\n=== ${uri} === FAILED:`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch(console.error);
