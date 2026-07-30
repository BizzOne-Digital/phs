import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PricingItem } from "@/models/PricingItem";
import { ActivityLog } from "@/models/ActivityLog";
import { pricingSchema } from "@/lib/validations";
import { revalidatePricing } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = pricingSchema.partial().safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const item = await PricingItem.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!item) return jsonError("Pricing item not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "pricing.updated",
      entityType: "PricingItem",
      entityId: id,
      summary: `Updated pricing card ${item.serviceName}`,
    });

    revalidatePricing();
    return NextResponse.json({ item });
  } catch (error) {
    return handleRouteError(error, "Failed to update pricing item.");
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const item = await PricingItem.findByIdAndDelete(id).lean();
    if (!item) return jsonError("Pricing item not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "pricing.deleted",
      entityType: "PricingItem",
      entityId: id,
      summary: `Deleted pricing card ${item.serviceName}`,
    });

    revalidatePricing();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete pricing item.");
  }
}
