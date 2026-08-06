import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { ActivityLog } from "@/models/ActivityLog";
import { blogSchema } from "@/lib/validations";
import { revalidateBlogs } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import { createSlug, readingTime } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const post = await BlogPost.findById(id).lean();
    if (!post) return jsonError("Blog post not found", 404);
    return NextResponse.json({ post });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch blog.");
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = blogSchema.partial().safeParse({
      ...body,
      ...(body.slug ? { slug: createSlug(body.slug) } : {}),
    });
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    if (parsed.data.slug) {
      const clash = await BlogPost.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (clash) return jsonError("A post with this slug already exists", 409);
    }

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.content) {
      update.content = sanitizeHtml(parsed.data.content);
      update.readingTimeMinutes = readingTime(parsed.data.content);
    }
    if (parsed.data.status === "published" && !parsed.data.publishedAt) {
      const existing = await BlogPost.findById(id).select("publishedAt").lean();
      if (!existing?.publishedAt) update.publishedAt = new Date();
    }
    if (parsed.data.publishedAt) {
      update.publishedAt = new Date(parsed.data.publishedAt);
    }

    const post = await BlogPost.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!post) return jsonError("Blog post not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "blog.updated",
      entityType: "BlogPost",
      entityId: id,
      summary: `Updated blog ${post.title}`,
    });

    revalidateBlogs(post.slug);
    return NextResponse.json({ post });
  } catch (error) {
    return handleRouteError(error, "Failed to update blog.");
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const post = await BlogPost.findByIdAndDelete(id).lean();
    if (!post) return jsonError("Blog post not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "blog.deleted",
      entityType: "BlogPost",
      entityId: id,
      summary: `Deleted blog ${post.title}`,
    });

    revalidateBlogs(post.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete blog.");
  }
}
