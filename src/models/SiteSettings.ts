import { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "site", unique: true },
    businessName: { type: String, default: "Premier Home Services" },
    logoUrl: { type: String, default: "/logo.svg" },
    faviconUrl: { type: String, default: "/favicon.svg" },
    phone: { type: String, default: "437-256-1028" },
    emergencyPhone: { type: String, default: "437-256-1028" },
    email: { type: String, default: "vnecconstruction@gmail.com" },
    serviceArea: { type: String, default: "Greater Toronto Area, Ontario" },
    businessHours: { type: String, default: "Monday–Saturday: 9:00 AM–5:00 PM" },
    emergencyAvailability: { type: String, default: "Available 24/7" },
    emergencyAvailable: { type: Boolean, default: true },
    specialOfferText: {
      type: String,
      default: "5% OFF for Seniors, Veterans & First-Time Customers",
    },
    specialOfferPercent: { type: Number, default: 5 },
    specialOfferActive: { type: Boolean, default: true },
    footerDescription: {
      type: String,
      default:
        "Licensed Electrical, HVAC & Plumbing experts serving the Greater Toronto Area with scheduled appointments and 24/7 emergency support.",
    },
    footerLinks: [
      {
        label: String,
        href: String,
      },
    ],
    contactFormRecipient: { type: String, default: "vnecconstruction@gmail.com" },
    defaultSeoTitle: {
      type: String,
      default: "Premier Home Services | Licensed Electrical, HVAC & Plumbing — Greater Toronto Area",
    },
    defaultSeoDescription: {
      type: String,
      default:
        "Fast, reliable electrical, HVAC, and plumbing services from certified technicians across the GTA. Scheduled appointments and 24/7 emergency repairs.",
    },
    analyticsId: String,
    mapEmbed: String,
    copyrightText: { type: String, default: "© Premier Home Services. All rights reserved." },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      google: String,
    },
    pricingDisclaimer: {
      type: String,
      default:
        "Prices shown are starting estimates only. Final pricing may vary based on inspection findings, labour, materials, accessibility, urgency, system condition, and the scope of work. Customers will receive clear pricing before approved work begins.",
    },
  },
  { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
