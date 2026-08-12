import { Schema, models, model } from "mongoose";
import { ImageSchema } from "./Page";

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    attribution: { type: String, default: "" },
    role: { type: String, default: "" },
    serviceCategory: {
      type: String,
      enum: ["electrical", "hvac", "plumbing", "general"],
      default: "general",
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: ImageSchema,
    isSample: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
