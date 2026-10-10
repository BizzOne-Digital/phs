import { NextResponse } from "next/server";
import {
  deleteStoredUpload,
  getStoredUpload,
  isSafeUploadFilename,
  isUploadFolder,
} from "@/lib/upload/store";
import { storedDataToBuffer } from "@/lib/upload/binary";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const body = storedDataToBuffer(doc?.data);
    if (!body?.length) {
      return jsonError("Not found", 404);
    }

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
