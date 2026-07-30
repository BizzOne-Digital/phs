import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { BlogPost } from "@/models/BlogPost";
import { Service } from "@/models/Service";
import { ActivityLog } from "@/models/ActivityLog";
import { requireAdmin, handleRouteError } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setHours(0, 0, 0, 0);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);

    const [
      totalLeads,
      newLeads,
      emergencyLeads,
      scheduledLeads,
      byCategory,
      recentLeads,
      blogPublished,
      blogDrafts,
      activeServices,
      recentActivity,
      leadTrendRaw,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ isEmergency: true }),
      Lead.countDocuments({ status: "appointment_scheduled" }),
      Lead.aggregate([{ $group: { _id: "$serviceCategory", count: { $sum: 1 } } }]),
      Lead.find().sort({ createdAt: -1 }).limit(8).lean(),
      BlogPost.countDocuments({ status: "published" }),
      BlogPost.countDocuments({ status: "draft" }),
      Service.countDocuments({ active: true }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(12).lean(),
      Lead.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
            emergency: {
              $sum: { $cond: ["$isEmergency", 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const trendMap = new Map(
      leadTrendRaw.map((row: { _id: string; count: number; emergency: number }) => [
        row._id,
        { count: row.count, emergency: row.emergency },
      ])
    );

    const leadTrend = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(fourteenDaysAgo);
      d.setDate(fourteenDaysAgo.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const entry = trendMap.get(key) || { count: 0, emergency: 0 };
      return { date: key, count: entry.count, emergency: entry.emergency };
    });

    const categoryStats = byCategory.map((row: { _id: string; count: number }) => ({
      category: row._id || "unknown",
      count: row.count,
    }));

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        emergencyLeads,
        scheduledLeads,
        blogPublished,
        blogDrafts,
        activeServices,
      },
      byCategory: categoryStats,
      recentLeads,
      recentActivity,
      leadTrend,
    });
  } catch (error) {
    return handleRouteError(error, "Failed to load dashboard.");
  }
}
