import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ActivityLog } from "@/models/ActivityLog";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { generateReferenceNumber } from "@/lib/utils";
import { sendContactNotification, sendLeadConfirmation } from "@/lib/email";
import { getSettings } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limited.success) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
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
      isEmergency: parsed.data.isEmergency,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      location: parsed.data.location,
      message: parsed.data.message,
      source: "contact",
      status: "new",
    });

    await ActivityLog.create({
      action: "lead.created",
      entityType: "Lead",
      entityId: lead._id.toString(),
      summary: `Contact form lead ${referenceNumber}`,
    });

    const [notifyResult, confirmResult] = await Promise.all([
      sendContactNotification({
        to: settings.contactFormRecipient || settings.email,
        referenceNumber,
        name: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        serviceCategory: parsed.data.serviceCategory,
        propertyType: parsed.data.propertyType,
        customerType: parsed.data.customerType,
        location: parsed.data.location,
        isEmergency: parsed.data.isEmergency,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
      }),
      sendLeadConfirmation({
        to: parsed.data.email,
        name: parsed.data.fullName,
        referenceNumber,
        isEmergency: parsed.data.isEmergency,
        phone: settings.emergencyPhone || settings.phone,
      }),
    ]);

    if (!notifyResult.ok) {
      console.error("contact business email failed:", notifyResult.error);
    }
    if (!confirmResult.ok) {
      console.error("contact customer email failed:", confirmResult.error);
    }

    return NextResponse.json({
      success: true,
      referenceNumber,
      email: {
        business: notifyResult,
        customer: confirmResult,
      },
    });
  } catch (error) {
    console.error("contact error", error);
    return NextResponse.json({ error: "Unable to submit. Please call us directly." }, { status: 500 });
  }
}
