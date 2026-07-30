export type { SiteSettingsData, ServiceNavItem } from "./site";

export type ServiceCategory = "electrical" | "hvac" | "plumbing";
export type LeadServiceCategory = ServiceCategory | "general";
export type CustomerType =
  | "homeowner"
  | "property_manager"
  | "landlord"
  | "realtor"
  | "business"
  | "other";
export type PropertyType = "residential" | "commercial";
export type PublishStatus = "draft" | "published";
export type BlogStatus = "draft" | "published" | "scheduled";
export type LeadStatus =
  | "new"
  | "contacted"
  | "appointment_scheduled"
  | "in_progress"
  | "completed"
  | "closed"
  | "spam";
export type LeadSource = "contact" | "request-service" | "service-page" | "other";
export type AdminRole = "admin" | "editor";

export interface MediaImage {
  url: string;
  alt: string;
  publicId?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageSection {
  _id?: string;
  key: string;
  type: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  images?: MediaImage[];
  background?: string;
  layoutVariant?: string;
  visible: boolean;
  order: number;
  meta?: Record<string, unknown>;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  status: PublishStatus;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections: PageSection[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  isEmergency: boolean;
  shortDescription: string;
  fullDescription: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: MediaImage;
  gallery?: MediaImage[];
  commonProblems?: string[];
  inclusions?: string[];
  residentialApps?: string[];
  commercialApps?: string[];
  whyProfessional?: string;
  safetyStatement?: string;
  processSteps?: ProcessStep[];
  faqs?: FaqItem[];
  relatedServiceSlugs?: string[];
  startingPriceLabel?: string;
  ctaLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  displayOrder: number;
  active: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PricingItem {
  _id: string;
  serviceName: string;
  category: ServiceCategory;
  startingPrice: string;
  priceRange?: string;
  description?: string;
  included?: string[];
  excluded?: string[];
  featured: boolean;
  isEmergency: boolean;
  displayOrder: number;
  active: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  linkedServiceSlug?: string;
  disclaimer?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: MediaImage;
  inlineImages?: MediaImage[];
  author: string;
  category: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: BlogStatus;
  publishedAt?: string | Date;
  readingTimeMinutes?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Lead {
  _id: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  propertyType: PropertyType;
  serviceCategory: LeadServiceCategory;
  specificService?: string;
  isEmergency: boolean;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
  uploadedImages?: MediaImage[];
  source: LeadSource;
  status: LeadStatus;
  internalNotes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SiteSettings {
  _id: string;
  singletonKey: string;
  businessName: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  serviceArea: string;
  businessHours: string;
  emergencyAvailability: string;
  emergencyAvailable: boolean;
  specialOfferText?: string;
  specialOfferPercent?: number;
  specialOfferActive?: boolean;
  footerDescription?: string;
  footerLinks?: { label: string; href: string }[];
  contactFormRecipient?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  analyticsId?: string;
  mapEmbed?: string;
  copyrightText?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    google?: string;
  };
  pricingDisclaimer?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MediaAsset {
  _id: string;
  url: string;
  publicId?: string;
  alt: string;
  filename?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder?: string;
  tags?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Testimonial {
  _id: string;
  quote: string;
  attribution: string;
  role?: string;
  serviceCategory: LeadServiceCategory;
  rating: number;
  image?: MediaImage;
  isSample: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ActivityLog {
  _id: string;
  actorEmail?: string;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  summary: string;
  meta?: Record<string, unknown>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PlaceholderImage {
  url: string;
  alt: string;
  theme?: "electrical" | "hvac" | "plumbing" | "technician" | "property" | "tools";
}
