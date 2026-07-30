import mongoose, { Schema, models, model } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    publicId: { type: String },
  },
  { _id: false }
);

const PageSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    eyebrow: String,
    heading: String,
    subheading: String,
    body: String,
    bullets: [String],
    ctaLabel: String,
    ctaUrl: String,
    secondaryCtaLabel: String,
    secondaryCtaUrl: String,
    images: [ImageSchema],
    background: String,
    layoutVariant: { type: String, default: "default" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    meta: { type: Schema.Types.Mixed },
  },
  { _id: true }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
    seoTitle: String,
    seoDescription: String,
    ogImage: String,
    sections: [PageSectionSchema],
  },
  { timestamps: true }
);

PageSchema.index({ createdAt: -1 });

export const Page = models.Page || model("Page", PageSchema);
export { PageSectionSchema, ImageSchema };
