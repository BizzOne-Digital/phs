import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ActivityLog } from "@/models/ActivityLog";
import { leadStatusSchema } from "@/lib/validations";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const lead = await Lead.findById(id).lean();
    if (!lead) return jsonError("Lead not found", 404);
    return NextResponse.json({ lead });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch lead.");
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = leadStatusSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        status: parsed.data.status,
        ...(parsed.data.internalNotes !== undefined
          ? { internalNotes: parsed.data.internalNotes }
          : {}),
      },
      { new: true }
    ).lean();

    if (!lead) return jsonError("Lead not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "lead.updated",
      entityType: "Lead",
      entityId: id,
      summary: `Lead ${lead.referenceNumber} → ${parsed.data.status}`,
    });

    return NextResponse.json({ lead });
  } catch (error) {
    return handleRouteError(error, "Failed to update lead.");
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    const { id } = await ctx.params;
    await connectDB();
    const lead = await Lead.findByIdAndDelete(id).lean();
    if (!lead) return jsonError("Lead not found", 404);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "lead.deleted",
      entityType: "Lead",
      entityId: id,
      summary: `Deleted lead ${lead.referenceNumber}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Failed to delete lead.");
  }
}
