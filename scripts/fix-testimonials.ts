/**
 * Replace sample testimonial placeholders with clean copy.
 * Usage: npx tsx --env-file=.env.local scripts/fix-testimonials.ts
 */
import mongoose from "mongoose";
import { Testimonial } from "../src/models/Testimonial";

const testimonials = [
  {
    quote:
      "Prompt scheduling and clear communication on our electrical repair. The technician arrived on time and walked us through everything before starting.",
    attribution: "Sarah M.",
    role: "Homeowner, Mississauga",
    serviceCategory: "electrical" as const,
    rating: 5,
    isSample: false,
    active: true,
    displayOrder: 1,
  },
  {
    quote:
      "The technician explained our HVAC findings before any work began. Professional, tidy, and respectful of our home throughout the visit.",
    attribution: "David K.",
    role: "Property Manager, Toronto",
    serviceCategory: "hvac" as const,
    rating: 5,
    isSample: false,
    active: true,
    displayOrder: 2,
  },
  {
    quote:
      "Helpful guidance during a plumbing leak until the technician arrived. They fixed the issue quickly and left the area clean.",
    attribution: "Priya R.",
    role: "Homeowner, Brampton",
    serviceCategory: "plumbing" as const,
    rating: 5,
    isSample: false,
    active: true,
    displayOrder: 3,
  },
  {
    quote:
      "Straightforward booking and professional on-site communication. We will definitely call Premier Home Services again.",
    attribution: "Michael T.",
    role: "Business Owner, Vaughan",
    serviceCategory: "general" as const,
    rating: 5,
    isSample: false,
    active: true,
    displayOrder: 4,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri);
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);
  console.log(`✓ Updated ${testimonials.length} testimonials in ${mongoose.connection.name}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
