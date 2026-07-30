import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { ActivityLog } from "@/models/ActivityLog";
import { settingsSchema } from "@/lib/validations";
import { revalidateSettings } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    let settings = await SiteSettings.findOne({ singletonKey: "site" }).lean();
    if (!settings) {
      settings = (await SiteSettings.create({})).toObject();
    }
    return NextResponse.json({ settings });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch settings.");
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const cleaned = Object.fromEntries(
      Object.entries(body as Record<string, unknown>).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );
    const parsed = settingsSchema.partial().safeParse(cleaned);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: "site" },
      { $set: parsed.data },
      { new: true, upsert: true }
    ).lean();

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "settings.updated",
      entityType: "SiteSettings",
      entityId: settings?._id?.toString(),
      summary: "Updated site settings",
    });

    revalidateSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    return handleRouteError(error, "Failed to update settings.");
  }
}
