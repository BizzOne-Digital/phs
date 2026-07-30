import { Schema, models, model } from "mongoose";

const PricingItemSchema = new Schema(
  {
    serviceName: { type: String, required: true },
    category: {
      type: String,
      enum: ["electrical", "hvac", "plumbing"],
      required: true,
      index: true,
    },
    startingPrice: { type: String, required: true, default: "Contact for starting price" },
    priceRange: String,
    description: String,
    included: [String],
    excluded: [String],
    featured: { type: Boolean, default: false },
    isEmergency: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    ctaLabel: { type: String, default: "Request Service" },
    ctaUrl: { type: String, default: "/request-service" },
    linkedServiceSlug: String,
    disclaimer: String,
  },
  { timestamps: true }
);

export const PricingItem = models.PricingItem || model("PricingItem", PricingItemSchema);
