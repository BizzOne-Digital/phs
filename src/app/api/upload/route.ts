import { NextResponse } from "next/server";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import {
  isUploadFolder,
  saveFolderUpload,
  MAX_UPLOAD_BYTES,
} from "@/lib/upload/store";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "misc");

    if (!(file instanceof File)) {
      return jsonError("file is required", 400);
    }
    if (!isUploadFolder(folderRaw)) {
      return jsonError('folder must be one of: pages, products, gallery, misc', 400);
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonError("Image must be 8MB or smaller", 413);
    }

    const saved = await saveFolderUpload(file, folderRaw);

    await connectDB();
    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "upload.created",
      entityType: "StoredUpload",
      entityId: `${saved.folder}/${saved.filename}`,
      summary: `Uploaded ${saved.filename} to ${saved.folder}`,
    });

    return NextResponse.json(
      {
        success: true,
        url: saved.url,
        filename: saved.filename,
        folder: saved.folder,
        size: saved.size,
        mimeType: saved.mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error, "Upload failed.");
  }
}
