import { Schema, models, model } from "mongoose";
import { ImageSchema } from "./Page";

const ProcessStepSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["electrical", "hvac", "plumbing"],
      required: true,
      index: true,
    },
    isEmergency: { type: Boolean, default: false, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    heroHeading: String,
    heroSubheading: String,
    heroImage: ImageSchema,
    gallery: [ImageSchema],
    commonProblems: [String],
    inclusions: [String],
    residentialApps: [String],
    commercialApps: [String],
    whyProfessional: String,
    safetyStatement: String,
    processSteps: [ProcessStepSchema],
    faqs: [FaqSchema],
    relatedServiceSlugs: [String],
    startingPriceLabel: { type: String, default: "Contact for starting price" },
    ctaLabel: { type: String, default: "Request Service" },
    seoTitle: String,
    seoDescription: String,
    displayOrder: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ createdAt: -1 });

export const Service = models.Service || model("Service", ServiceSchema);
