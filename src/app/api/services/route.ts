import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { ActivityLog } from "@/models/ActivityLog";
import { serviceSchema } from "@/lib/validations";
import { revalidateServices } from "@/lib/revalidate";
import { requireAdmin, handleRouteError, jsonError } from "@/lib/admin";
import { createSlug } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (active === "true") filter.active = true;
    if (active === "false") filter.active = false;

    const services = await Service.find(filter).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ services });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch services.");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = serviceSchema.safeParse({
      ...body,
      slug: body.slug ? createSlug(body.slug) : createSlug(body.name || ""),
    });
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    await connectDB();
    const exists = await Service.findOne({ slug: parsed.data.slug });
    if (exists) return jsonError("A service with this slug already exists", 409);

    const service = await Service.create(parsed.data);

    await ActivityLog.create({
      actorEmail: session.user.email,
      actorId: session.user.id,
      action: "service.created",
      entityType: "Service",
      entityId: service._id.toString(),
      summary: `Created service ${service.name}`,
    });

    revalidateServices(service.slug);
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Failed to create service.");
  }
}
