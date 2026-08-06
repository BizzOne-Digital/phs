import { Schema, models, model } from "mongoose";

const BlogCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
  },
  { timestamps: true }
);

export const BlogCategory = models.BlogCategory || model("BlogCategory", BlogCategorySchema);
