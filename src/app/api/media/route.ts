import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MediaAsset } from "@/models/MediaAsset";
import { ActivityLog } from "@/models/ActivityLog";
import { mediaUpdateSchema } from "@/lib/validations";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import {
  deleteStoredUploadByUrl,
  isUploadFolder,
  listStoredUploads,
  saveFolderUpload,
  type UploadFolder,
} from "@/lib/upload/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 40), 100);
    const folderParam = searchParams.get("folder") || undefined;
    const folder =
      folderParam && isUploadFolder(folderParam) ? (folderParam as UploadFolder) : undefined;

    const listed = await listStoredUploads({ folder, q, page, limit });

    const assets = listed.items.map((item) => ({
      _id: String(item._id),
      url: item.url,
      alt: item.filename,
      filename: item.filename,
      format: item.mimeType?.split("/")[1],
      bytes: item.size,
      folder: item.folder,
      createdAt: (item as { createdAt?: string | Date }).createdAt,
      source: "stored" as const,
    }));

    return NextResponse.json({
      assets,
      total: listed.total,
      page: listed.page,
      limit: listed.limit,
    });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch media.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      const folderRaw = String(form.get("folder") || "gallery");
      const alt = String(form.get("alt") || "");

      if (!(file instanceof File)) return jsonError("file is required", 400);
      if (!isUploadFolder(folderRaw)) {
        return jsonError("Invalid folder", 400);
      }

      const saved = await saveFolderUpload(file, folderRaw);
      await connectDB();
      const asset = await MediaAsset.create({
        url: saved.url,
        publicId: `${saved.folder}/${saved.filename}`,
        alt: alt || saved.filename,
        filename: saved.filename,
        format: saved.mimeType.split("/")[1],
        bytes: saved.size,
        folder: saved.folder,
      });

      await ActivityLog.create({
        actorEmail: session.user.email,
        actorId: session.user.id,
        action: "media.uploaded",
        entityType: "MediaAsset",
        entityId: asset._id.toString(),
        summary: `Uploaded media ${saved.filename}`,
      });

      return NextResponse.json({ asset, url: saved.url, success: true }, { status: 201 });
    }

    return jsonError(
      "Send multipart FormData with file + folder. Local disk and Cloudinary are not required for uploads.",
      400
    );
  } catch (error) {
    return handleRouteError(error, "Failed to upload media.");
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = mediaUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const asset = await MediaAsset.findByIdAndUpdate(
      parsed.data.id,
      { $set: { alt: parsed.data.alt } },
      { new: true }
    ).lean();
    if (!asset) return jsonError("Media not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "media.updated",
      entityType: "MediaAsset",
      entityId: parsed.data.id,
      summary: `Updated media alt text`,
    });

    return NextResponse.json({ asset });
  } catch (error) {
    return handleRouteError(error, "Failed to update media.");
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const url = searchParams.get("url");

    await connectDB();

    if (url?.startsWith("/api/uploads/")) {
      await deleteStoredUploadByUrl(url);
      await MediaAsset.deleteMany({ url });
      await ActivityLog.create({
        actorEmail: session.user.email,
        actorId: session.user.id,
        action: "media.deleted",
        entityType: "StoredUpload",
        summary: `Deleted upload ${url}`,
      });
      return NextResponse.json({ success: true });
    }

    if (!id) return jsonError("Media id or url required");

    const asset = await MediaAsset.findByIdAndDelete(id).lean();
    if (asset) {
      if (asset.url?.startsWith("/api/uploads/")) {
        await deleteStoredUploadByUrl(asset.url);
      }
      await ActivityLog.create({
        actorEmail: session.user.email,
        actorId: session.user.id,
        action: "media.deleted",
        entityType: "MediaAsset",
        entityId: id,
        summary: `Deleted media ${asset.filename || asset.publicId}`,
      });
      return NextResponse.json({ success: true });
    }

    // StoredUpload document id
    const { StoredUpload } = await import("@/models/StoredUpload");
    const stored = await StoredUpload.findByIdAndDelete(id).lean();
    if (!stored) return jsonError("Media not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "media.deleted",
      entityType: "StoredUpload",
      entityId: id,
      summary: `Deleted stored upload ${stored.filename}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete media.");
  }
}
