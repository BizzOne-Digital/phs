import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { requireAdmin, handleRouteError } from "@/lib/admin";

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.serviceCategory = category;
    if (q) filter.$text = { $search: q };

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const headers = [
      "referenceNumber",
      "name",
      "email",
      "phone",
      "customerType",
      "propertyType",
      "serviceCategory",
      "specificService",
      "isEmergency",
      "preferredDate",
      "preferredTime",
      "location",
      "message",
      "source",
      "status",
      "internalNotes",
      "createdAt",
    ];

    const rows = leads.map((lead) =>
      headers
        .map((h) => {
          const val = (lead as unknown as Record<string, unknown>)[h];
          if (h === "createdAt" && val) return csvEscape(new Date(val as string).toISOString());
          if (typeof val === "boolean") return csvEscape(val ? "yes" : "no");
          return csvEscape(val);
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const filename = `phs-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleRouteError(error, "Failed to export leads.");
  }
}
