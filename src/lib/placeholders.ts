import type { PlaceholderImage } from "@/types";

/**
 * Shared catalog mapped to local /public/images assets.
 * Page-specific art lives in `site-images.ts`.
 */
export const PLACEHOLDER_IMAGES = {
  electricalTech: "/images/home-hero-electrical.webp",
  electricalPanel: "/images/home-core-electrical.webp",
  wiring: "/images/about-work-1.webp",
  lighting: "/images/about-values.webp",
  hvacUnit: "/images/home-hero-hvac.webp",
  hvacTech: "/images/home-core-hvac.webp",
  furnace: "/images/services-card-em-hvac.webp",
  thermostat: "/images/svc-hvac-g2.webp",
  plumbingRepair: "/images/home-hero-plumbing.webp",
  plumbingTools: "/images/services-hero-3.webp",
  pipes: "/images/blog-hero-3.webp",
  bathroom: "/images/home-core-plumbing.webp",
  kitchen: "/images/svc-plumb-g1.webp",
  commercialMech: "/images/about-story-commercial.webp",
  residentialHome: "/images/home-cta-home.webp",
  torontoSkyline: "/images/home-areas-skyline.webp",
  officeBuilding: "/images/home-areas-office.webp",
  nightCity: "/images/home-hero-bg.webp",
  emergencyResponse: "/images/home-emergency-main.webp",
  safetyGear: "/images/home-about-safety.webp",
  tools: "/images/home-about-tools.webp",
  teamWork: "/images/home-about-main.webp",
  blueprint: "/images/home-process.webp",
  van: "/images/home-emergency-van.webp",
} as const;

export type PlaceholderKey = keyof typeof PLACEHOLDER_IMAGES;

export const IMAGE_ALTS: Record<PlaceholderKey, string> = {
  electricalTech: "Licensed electrician performing electrical diagnostics",
  electricalPanel: "Premium electrical panel and breaker work",
  wiring: "Professional electrical wiring installation",
  lighting: "Professional lighting installation",
  hvacUnit: "HVAC outdoor unit inspection",
  hvacTech: "Technician servicing heating and cooling equipment",
  furnace: "Residential furnace and heating system",
  thermostat: "Air conditioning outdoor unit and climate system",
  plumbingRepair: "Professional plumbing repair in progress",
  plumbingTools: "Plumbing tools and materials",
  pipes: "Pipe repair and plumbing infrastructure",
  bathroom: "Bathroom plumbing fixture installation",
  kitchen: "Kitchen plumbing and fixture work",
  commercialMech: "Commercial mechanical room systems",
  residentialHome: "Greater Toronto Area residential property",
  torontoSkyline: "Greater Toronto Area skyline and service region",
  officeBuilding: "Commercial property mechanical services",
  nightCity: "Night-time emergency service availability",
  emergencyResponse: "Emergency response technician on call",
  safetyGear: "Safety equipment and protective gear",
  tools: "Professional trade tools and workmanship",
  teamWork: "Skilled technician completing service work",
  blueprint: "Technical planning and project layout",
  van: "Service vehicle ready for GTA dispatch",
};

const THEMES: Record<PlaceholderKey, PlaceholderImage["theme"]> = {
  electricalTech: "electrical",
  electricalPanel: "electrical",
  wiring: "electrical",
  lighting: "electrical",
  hvacUnit: "hvac",
  hvacTech: "hvac",
  furnace: "hvac",
  thermostat: "hvac",
  plumbingRepair: "plumbing",
  plumbingTools: "plumbing",
  pipes: "plumbing",
  bathroom: "plumbing",
  kitchen: "plumbing",
  commercialMech: "property",
  residentialHome: "property",
  torontoSkyline: "property",
  officeBuilding: "property",
  nightCity: "property",
  emergencyResponse: "technician",
  safetyGear: "technician",
  tools: "tools",
  teamWork: "technician",
  blueprint: "tools",
  van: "technician",
};

export const PLACEHOLDER_IMAGE_LIST: PlaceholderImage[] = (
  Object.keys(PLACEHOLDER_IMAGES) as PlaceholderKey[]
).map((key) => ({
  url: PLACEHOLDER_IMAGES[key],
  alt: IMAGE_ALTS[key],
  theme: THEMES[key],
}));

export function getPlaceholder(key: PlaceholderKey): { url: string; alt: string } {
  return { url: PLACEHOLDER_IMAGES[key], alt: IMAGE_ALTS[key] };
}

export function getPlaceholdersByTheme(
  theme: PlaceholderImage["theme"]
): PlaceholderImage[] {
  return PLACEHOLDER_IMAGE_LIST.filter((image) => image.theme === theme);
}

export function getPlaceholderUrls(): string[] {
  return PLACEHOLDER_IMAGE_LIST.map((image) => image.url);
}
