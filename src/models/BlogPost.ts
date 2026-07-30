import { Schema, models, model } from "mongoose";
import { ImageSchema } from "./Page";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: ImageSchema,
    inlineImages: [ImageSchema],
    author: { type: String, default: "VNEC Team" },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, index: true },
    readingTimeMinutes: { type: Number, default: 3 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ title: "text", excerpt: "text", content: "text" });

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
