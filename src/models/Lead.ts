import { Schema, models, model } from "mongoose";
import { ImageSchema } from "./Page";

const LeadSchema = new Schema(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    customerType: {
      type: String,
      enum: ["homeowner", "property_manager", "landlord", "realtor", "business", "other"],
      default: "homeowner",
    },
    propertyType: {
      type: String,
      enum: ["residential", "commercial"],
      default: "residential",
    },
    serviceCategory: {
      type: String,
      enum: ["electrical", "hvac", "plumbing", "general"],
      required: true,
      index: true,
    },
    specificService: String,
    isEmergency: { type: Boolean, default: false, index: true },
    preferredDate: String,
    preferredTime: String,
    location: String,
    message: String,
    uploadedImages: [ImageSchema],
    source: {
      type: String,
      enum: ["contact", "request-service", "service-page", "other"],
      default: "contact",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "appointment_scheduled",
        "in_progress",
        "completed",
        "closed",
        "spam",
      ],
      default: "new",
      index: true,
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ name: "text", email: "text", message: "text", referenceNumber: "text" });

export const Lead = models.Lead || model("Lead", LeadSchema);
