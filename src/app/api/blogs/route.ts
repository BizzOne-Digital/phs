import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { ActivityLog } from "@/models/ActivityLog";
import { blogSchema } from "@/lib/validations";
import { revalidateBlogs } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import { createSlug, readingTime } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q) filter.$text = { $search: q };

    const posts = await BlogPost.find(filter).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ posts });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch blogs.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = blogSchema.safeParse({
      ...body,
      slug: body.slug ? createSlug(body.slug) : createSlug(body.title || ""),
    });
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const exists = await BlogPost.findOne({ slug: parsed.data.slug });
    if (exists) return jsonError("A post with this slug already exists", 409);

    const content = sanitizeHtml(parsed.data.content);
    const publishedAt =
      parsed.data.status === "published"
        ? parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date()
        : parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : undefined;

    const post = await BlogPost.create({
      ...parsed.data,
      content,
      publishedAt,
      readingTimeMinutes: readingTime(content),
    });

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "blog.created",
      entityType: "BlogPost",
      entityId: post._id.toString(),
      summary: `Created blog ${post.title}`,
    });

    revalidateBlogs(post.slug);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create blog.");
  }
}
