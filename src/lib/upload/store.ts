import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/upload/types";

export { UPLOAD_FOLDERS, type UploadFolder };

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function buildUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${encodeURIComponent(filename)}`;
}

export function parseUploadUrl(
  url: string
): { folder: UploadFolder; filename: string } | null {
  if (!url) return null;
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/?#]+)$/);
  if (!match) return null;
  const folder = decodeURIComponent(match[1]);
  const filename = decodeURIComponent(match[2]);
  if (!isUploadFolder(folder)) return null;
  if (!isSafeUploadFilename(filename)) return null;
  return { folder, filename };
}

/** Reject path traversal and nested paths. */
export function isSafeUploadFilename(filename: string): boolean {
  if (!filename || filename.length > 180) return false;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  if (filename.includes("\0")) return false;
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

function extensionForMime(mimeType: string): string {
  return ALLOWED_MIME[mimeType] || "bin";
}

export function makeUploadFilename(_originalName: string, mimeType: string): string {
  const ext = extensionForMime(mimeType);
  return `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
}

export async function saveFolderUpload(
  file: File,
  folder: UploadFolder
): Promise<{
  url: string;
  filename: string;
  folder: UploadFolder;
  size: number;
  mimeType: string;
}> {
  if (!ALLOWED_MIME[file.type]) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }
  if (file.size <= 0) {
    throw new Error("Empty file.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be 8MB or smaller. Try compressing before upload.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = makeUploadFilename(file.name || "image", file.type);

  await connectDB();
  await StoredUpload.create({
    folder,
    filename,
    mimeType: file.type,
    size: buffer.length,
    data: buffer,
  });

  return {
    url: buildUploadUrl(folder, filename),
    filename,
    folder,
    size: buffer.length,
    mimeType: file.type,
  };
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  if (!isSafeUploadFilename(filename)) return null;
  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}

export async function deleteStoredUpload(
  folder: UploadFolder,
  filename: string
): Promise<boolean> {
  if (!isSafeUploadFilename(filename)) return false;
  await connectDB();
  const result = await StoredUpload.deleteOne({ folder, filename });
  return result.deletedCount > 0;
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  return deleteStoredUpload(parsed.folder, parsed.filename);
}

export async function listStoredUploads(opts?: {
  folder?: UploadFolder;
  q?: string;
  limit?: number;
  page?: number;
}) {
  await connectDB();
  const limit = Math.min(opts?.limit || 60, 100);
  const page = Math.max(opts?.page || 1, 1);
  const filter: Record<string, unknown> = {};
  if (opts?.folder) filter.folder = opts.folder;
  if (opts?.q?.trim()) {
    filter.filename = { $regex: opts.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }

  const [items, total] = await Promise.all([
    StoredUpload.find(filter)
      .select("-data")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    StoredUpload.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      url: buildUploadUrl(item.folder as UploadFolder, item.filename),
    })),
    total,
    page,
    limit,
  };
}
