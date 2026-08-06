import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { ActivityLog } from "@/models/ActivityLog";
import { pageSchema } from "@/lib/validations";
import { revalidatePages } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import { createSlug } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const pages = await Page.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ pages });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch pages.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = pageSchema.safeParse({
      ...body,
      slug: body.slug ? createSlug(body.slug) : createSlug(body.title || ""),
    });
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const exists = await Page.findOne({ slug: parsed.data.slug });
    if (exists) return jsonError("A page with this slug already exists", 409);

    const page = await Page.create({
      ...parsed.data,
      sections: parsed.data.sections || [],
      status: parsed.data.status || "draft",
    });

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "page.created",
      entityType: "Page",
      entityId: page._id.toString(),
      summary: `Created page ${page.slug}`,
    });

    revalidatePages(page.slug);
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create page.");
  }
}
