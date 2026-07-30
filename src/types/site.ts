export interface SiteSettingsData {
  businessName: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  serviceArea: string;
  businessHours: string;
  emergencyAvailability: string;
  specialOfferText?: string;
  specialOfferActive?: boolean;
  footerDescription?: string;
  copyrightText?: string;
  analyticsId?: string;
  socialLinks?: Record<string, string | undefined>;
  pricingDisclaimer?: string;
  mapEmbed?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
}

export interface ServiceNavItem {
  name: string;
  slug: string;
  isEmergency: boolean;
  category: "electrical" | "hvac" | "plumbing" | string;
}
