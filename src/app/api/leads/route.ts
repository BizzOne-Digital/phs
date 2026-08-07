import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ActivityLog } from "@/models/ActivityLog";
import { serviceRequestSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { generateReferenceNumber } from "@/lib/utils";
import { sendLeadNotification, sendLeadConfirmation } from "@/lib/email";
import { getSettings } from "@/lib/data";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = rateLimit(`lead:${ip}`, 5, 60_000);
    if (!limited.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = serviceRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.website) {
      return NextResponse.json({ success: true, referenceNumber: "OK" });
    }

    await connectDB();
    const referenceNumber = generateReferenceNumber();
    const settings = await getSettings();

    const lead = await Lead.create({
      referenceNumber,
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      customerType: parsed.data.customerType,
      propertyType: parsed.data.propertyType,
      serviceCategory: parsed.data.serviceCategory,
      specificService: parsed.data.specificService,
      isEmergency: parsed.data.isEmergency,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      location: parsed.data.location,
      message: parsed.data.issueDetails,
      uploadedImages: (parsed.data.imageUrls || []).map((url) => ({ url, alt: "Customer upload" })),
      source: "request-service",
      status: "new",
    });

    await ActivityLog.create({
      action: "lead.created",
      entityType: "Lead",
      entityId: lead._id.toString(),
      summary: `Service request ${referenceNumber}`,
    });

    const mailResults = await Promise.allSettled([
      sendLeadNotification({
        to: settings.contactFormRecipient || settings.email,
        referenceNumber,
        name: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        serviceCategory: parsed.data.serviceCategory,
        specificService: parsed.data.specificService,
        isEmergency: parsed.data.isEmergency,
        message: parsed.data.issueDetails,
        location: parsed.data.location,
        propertyType: parsed.data.propertyType,
        customerType: parsed.data.customerType,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
        source: "request-service",
      }),
      sendLeadConfirmation({
        to: parsed.data.email,
        name: parsed.data.fullName,
        referenceNumber,
        isEmergency: parsed.data.isEmergency,
        phone: settings.emergencyPhone || settings.phone,
      }),
    ]);
    mailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`lead email #${i} failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true, referenceNumber });
  } catch (error) {
    console.error("lead create error", error);
    return NextResponse.json({ error: "Unable to submit request." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.serviceCategory = category;
  if (q) filter.$text = { $search: q };

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return NextResponse.json({ leads, total, page, limit });
}
