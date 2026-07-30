import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { ActivityLog } from "@/models/ActivityLog";
import { serviceSchema } from "@/lib/validations";
import { revalidateServices } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import { createSlug } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const service = await Service.findById(id).lean();
    if (!service) return jsonError("Service not found", 404);
    return NextResponse.json({ service });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch service.");
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = serviceSchema.partial().safeParse({
      ...body,
      ...(body.slug ? { slug: createSlug(body.slug) } : {}),
    });
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    if (parsed.data.slug) {
      const clash = await Service.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (clash) return jsonError("A service with this slug already exists", 409);
    }

    const service = await Service.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!service) return jsonError("Service not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "service.updated",
      entityType: "Service",
      entityId: id,
      summary: `Updated service ${service.name}`,
    });

    revalidateServices(service.slug);
    return NextResponse.json({ service });
  } catch (error) {
    return handleRouteError(error, "Failed to update service.");
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const service = await Service.findByIdAndDelete(id).lean();
    if (!service) return jsonError("Service not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "service.deleted",
      entityType: "Service",
      entityId: id,
      summary: `Deleted service ${service.name}`,
    });

    revalidateServices(service.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete service.");
  }
}
