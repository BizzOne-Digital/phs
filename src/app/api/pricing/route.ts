import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PricingItem } from "@/models/PricingItem";
import { ActivityLog } from "@/models/ActivityLog";
import { pricingSchema } from "@/lib/validations";
import { revalidatePricing } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const items = await PricingItem.find().sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch pricing.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = pricingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const item = await PricingItem.create(parsed.data);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "pricing.created",
      entityType: "PricingItem",
      entityId: item._id.toString(),
      summary: `Created pricing card ${item.serviceName}`,
    });

    revalidatePricing();
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create pricing item.");
  }
}
