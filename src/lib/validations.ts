import { z } from "zod";

const emailField = z.email("Valid email required");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: emailField,
  phone: z.string().min(10, "Valid phone required"),
  customerType: z.enum([
    "homeowner",
    "property_manager",
    "landlord",
    "realtor",
    "business",
    "other",
  ]),
  propertyType: z.enum(["residential", "commercial"]),
  serviceCategory: z.enum(["electrical", "hvac", "plumbing", "general"]),
  isEmergency: z.boolean(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  message: z.string().min(10, "Please provide more detail"),
  consent: z.literal(true, { error: "Consent is required" }),
  website: z.string().max(0).optional(), // honeypot
});

export const serviceRequestSchema = z.object({
  serviceCategory: z.enum(["electrical", "hvac", "plumbing"]),
  isEmergency: z.boolean(),
  specificService: z.string().min(1),
  propertyType: z.enum(["residential", "commercial"]),
  issueDetails: z.string().min(10),
  location: z.string().min(2),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  fullName: z.string().min(2),
  email: emailField,
  phone: z.string().min(10),
  customerType: z.enum([
    "homeowner",
    "property_manager",
    "landlord",
    "realtor",
    "business",
    "other",
  ]),
  imageUrls: z.array(z.url()).optional(),
  consent: z.literal(true, { error: "Consent is required" }),
  website: z.string().max(0).optional(),
});

export const leadStatusSchema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "appointment_scheduled",
    "in_progress",
    "completed",
    "closed",
    "spam",
  ]),
  internalNotes: z.string().optional(),
});

const mediaImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string(),
  publicId: z.string().optional(),
});

export const pageSectionSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaUrl: z.string().optional(),
  images: z.array(mediaImageSchema).optional(),
  background: z.string().optional(),
  layoutVariant: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().default(0),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const pageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(1),
  status: z.enum(["draft", "published"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  sections: z.array(pageSectionSchema).optional(),
});

export const pageUpdateSchema = pageSchema.partial().omit({ slug: true });

export const mediaUploadSchema = z.object({
  dataUri: z.string().min(1, "Image data required"),
  alt: z.string().optional(),
  filename: z.string().optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const mediaUpdateSchema = z.object({
  id: z.string().min(1),
  alt: z.string(),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(["electrical", "hvac", "plumbing"]),
  isEmergency: z.boolean(),
  shortDescription: z.string().min(10),
  fullDescription: z.string().min(20),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroImage: mediaImageSchema.optional(),
  gallery: z.array(mediaImageSchema).optional(),
  commonProblems: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  residentialApps: z.array(z.string()).optional(),
  commercialApps: z.array(z.string()).optional(),
  whyProfessional: z.string().optional(),
  safetyStatement: z.string().optional(),
  processSteps: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  relatedServiceSlugs: z.array(z.string()).optional(),
  startingPriceLabel: z.string().optional(),
  ctaLabel: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
});

export const pricingSchema = z.object({
  serviceName: z.string().min(2),
  category: z.enum(["electrical", "hvac", "plumbing"]),
  startingPrice: z.string().min(1),
  priceRange: z.string().optional(),
  description: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isEmergency: z.boolean().optional(),
  displayOrder: z.number().optional(),
  active: z.boolean().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  linkedServiceSlug: z.string().optional(),
  disclaimer: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  featuredImage: mediaImageSchema.optional(),
  inlineImages: z.array(mediaImageSchema).optional(),
  author: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  publishedAt: z.string().optional(),
});

export const settingsSchema = z.object({
  businessName: z.string().min(1),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().min(7),
  emergencyPhone: z.string().min(7),
  email: emailField,
  serviceArea: z.string().min(2),
  businessHours: z.string().min(2),
  emergencyAvailability: z.string().min(2),
  emergencyAvailable: z.boolean().optional(),
  specialOfferText: z.string().optional(),
  specialOfferPercent: z.number().optional(),
  specialOfferActive: z.boolean().optional(),
  footerDescription: z.string().optional(),
  contactFormRecipient: emailField.optional(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  analyticsId: z.string().optional(),
  mapEmbed: z.string().optional(),
  copyrightText: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      google: z.string().optional(),
    })
    .optional(),
  pricingDisclaimer: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LeadStatusInput = z.infer<typeof leadStatusSchema>;
export type PageSectionInput = z.infer<typeof pageSectionSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
