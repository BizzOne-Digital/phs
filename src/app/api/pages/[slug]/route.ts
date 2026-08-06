import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Page } from "@/models/Page";
import { ActivityLog } from "@/models/ActivityLog";
import { pageUpdateSchema } from "@/lib/validations";
import { revalidatePages } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { slug } = await ctx.params;
    await connectDB();
    const page = await Page.findOne({ slug }).lean();
    if (!page) return jsonError("Page not found", 404);
    return NextResponse.json({ page });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch page.");
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { slug } = await ctx.params;
    const body = await req.json();
    const parsed = pageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const page = await Page.findOneAndUpdate({ slug }, { $set: parsed.data }, { new: true }).lean();
    if (!page) return jsonError("Page not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "page.updated",
      entityType: "Page",
      entityId: page._id.toString(),
      summary: `Updated page ${slug} (${page.status})`,
      meta: { status: page.status },
    });

    revalidatePages(slug);
    return NextResponse.json({ page });
  } catch (error) {
    return handleRouteError(error, "Failed to update page.");
  }
}
