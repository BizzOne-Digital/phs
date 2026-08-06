import { Schema, models, model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    actorEmail: String,
    actorId: String,
    action: { type: String, required: true, index: true },
    entityType: { type: String, index: true },
    entityId: String,
    summary: { type: String, required: true },
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema);
