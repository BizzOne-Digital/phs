import { NextResponse } from "next/server";
import {
  deleteStoredUpload,
  getStoredUpload,
  isSafeUploadFilename,
  isUploadFolder,
} from "@/lib/upload/store";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { folder: folderRaw, filename: filenameRaw } = await ctx.params;
    const folder = decodeURIComponent(folderRaw);
    const filename = decodeURIComponent(filenameRaw);

    if (!isUploadFolder(folder) || !isSafeUploadFilename(filename)) {
      return jsonError("Invalid upload path", 400);
    }

    const doc = await getStoredUpload(folder, filename);
    if (!doc?.data) {
      return jsonError("Not found", 404);
    }

    const body = Buffer.isBuffer(doc.data)
      ? doc.data
      : Buffer.from((doc.data as { buffer?: ArrayBuffer } | Uint8Array) as Uint8Array);

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return handleRouteError(error, "Failed to load upload.");
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { folder: folderRaw, filename: filenameRaw } = await ctx.params;
    const folder = decodeURIComponent(folderRaw);
    const filename = decodeURIComponent(filenameRaw);

    if (!isUploadFolder(folder) || !isSafeUploadFilename(filename)) {
      return jsonError("Invalid upload path", 400);
    }

    const ok = await deleteStoredUpload(folder, filename);
    if (!ok) return jsonError("Not found", 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete upload.");
  }
}
