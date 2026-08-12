import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null, uri: null };
global.mongooseCache = cached;

function hostFromUri(uri: string): string {
  const withoutProto = uri.replace(/^mongodb(\+srv)?:\/\//, "");
  const hostPart = withoutProto.includes("@")
    ? withoutProto.split("@")[1]!
    : withoutProto;
  return hostPart.split("/")[0]?.split("?")[0]?.split(":")[0] ?? "";
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in environment variables");
  }

  const expectedHost = hostFromUri(uri);
  const staleConnection =
    cached.conn &&
    (cached.uri !== uri ||
      (expectedHost && mongoose.connection.host && mongoose.connection.host !== expectedHost));

  if (staleConnection) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    cached.uri = null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.uri = uri;
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.uri = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
