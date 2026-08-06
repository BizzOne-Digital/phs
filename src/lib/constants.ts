import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import type { Service, PricingItem, Testimonial, BlogPost, SiteSettings } from "@/types";

export const BUSINESS = {
  name: "Premier Home Services",
  phone: "437-256-1028",
  email: "vnecconstruction@gmail.com",
  serviceArea: "Greater Toronto Area, Ontario",
  businessHours: "Monday–Saturday: 9:00 AM–5:00 PM",
  emergencyAvailability: "Available 24/7",
  headline: "Your Trusted Licensed Electrical, HVAC & Plumbing Experts",
  specialOffer: "5% OFF for Seniors, Veterans & First-Time Customers",
  pricingDisclaimer:
    "Prices shown are starting estimates only. Final pricing may vary based on inspection findings, labour, materials, accessibility, urgency, system condition, and the scope of work. Customers will receive clear pricing before approved work begins.",
} as const;

export const TRUST_ITEMS = [
  "Licensed & Insured",
  "Same-Day Service",
  "24/7 Emergency Support",
  "Transparent Pricing",
  "Satisfaction Guaranteed",
] as const;

export const WHY_CHOOSE = [
  {
    title: "Licensed professionals",
    body: "Every job is handled by licensed technicians who prioritize safety and quality.",
  },
  {
    title: "Code-compliant workmanship",
    body: "Installations and repairs follow applicable electrical, HVAC, and plumbing standards.",
  },
  {
    title: "Prompt response",
    body: "Scheduled appointments and 24/7 emergency support across the Greater Toronto Area.",
  },
  {
    title: "Transparent communication",
    body: "Clear explanations, upfront scope, and pricing before approved work begins.",
  },
  {
    title: "Long-lasting solutions",
    body: "We focus on durable repairs and installations—not temporary patches.",
  },
  {
    title: "Customer-focused service",
    body: "Respectful technicians, tidy work areas, and guidance you can understand.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    title: "Submit request",
    description: "Tell us what you need through our request form or by phone.",
  },
  {
    title: "Speak with the team",
    description: "We review urgency, location, and the right service category.",
  },
  {
    title: "Technician dispatch",
    description: "A licensed technician is scheduled or dispatched for emergencies.",
  },
  {
    title: "Inspection & upfront quote",
    description: "We inspect the issue and share clear pricing before work proceeds.",
  },
  {
    title: "Professional completion",
    description: "Repairs or installations are completed carefully and efficiently.",
  },
  {
    title: "Final quality check",
    description: "We verify results and walk you through what was completed.",
  },
] as const;

export const SERVICE_AREAS = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Markham",
  "Vaughan",
  "Richmond Hill",
  "Oakville",
  "Burlington",
  "Pickering",
  "Ajax",
  "Whitby",
  "Across the GTA",
] as const;

export const FALLBACK_SETTINGS: SiteSettings = {
  _id: "fallback",
  singletonKey: "site",
  businessName: BUSINESS.name,
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.svg",
  phone: BUSINESS.phone,
  emergencyPhone: BUSINESS.phone,
  email: BUSINESS.email,
  serviceArea: BUSINESS.serviceArea,
  businessHours: BUSINESS.businessHours,
  emergencyAvailability: BUSINESS.emergencyAvailability,
  emergencyAvailable: true,
  specialOfferText: BUSINESS.specialOffer,
  specialOfferPercent: 5,
  specialOfferActive: true,
  footerDescription:
    "Licensed Electrical, HVAC & Plumbing experts serving the Greater Toronto Area with scheduled appointments and 24/7 emergency support.",
  defaultSeoTitle: "Premier Home Services | Licensed Electrical, HVAC & Plumbing — Greater Toronto Area",
  defaultSeoDescription:
    "Fast, reliable electrical, HVAC, and plumbing services from licensed technicians across the GTA. Scheduled appointments and 24/7 emergency repairs.",
  copyrightText: "© Premier Home Services. All rights reserved.",
  pricingDisclaimer: BUSINESS.pricingDisclaimer,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function img(key: keyof typeof PLACEHOLDER_IMAGES) {
  return { url: PLACEHOLDER_IMAGES[key], alt: IMAGE_ALTS[key] };
}

export const FALLBACK_SERVICES: Service[] = [
  {
    _id: "1",
    name: "24/7 Emergency Electrical Services",
    slug: "24-7-emergency-electrical-services",
    category: "electrical",
    isEmergency: true,
    shortDescription:
      "Rapid response for power outages, sparking outlets, hot panels, and urgent electrical faults.",
    fullDescription:
      "When electrical problems create safety risks or leave your property without power, Premier Home Services provides 24/7 emergency electrical support across the Greater Toronto Area. Licensed technicians diagnose urgent issues and restore safer conditions as quickly as possible.",
    heroHeading: "24/7 Emergency Electrical Support Across the GTA",
    heroSubheading:
      "Power outages, sparking outlets, hot panels, and sudden electrical faults—help when you need it.",
    heroImage: img("emergencyResponse"),
    gallery: [img("electricalPanel"), img("wiring"), img("electricalTech"), img("nightCity")],
    commonProblems: [
      "Power outages limited to the property",
      "Burning smells from outlets or panels",
      "Sparking outlets",
      "Hot electrical panels",
      "Frequently tripping breakers",
      "Exposed or damaged wiring",
      "Sudden electrical faults",
    ],
    inclusions: [
      "Emergency troubleshooting",
      "Safety assessment",
      "Urgent repairs where feasible",
      "Clear next-step guidance",
    ],
    residentialApps: ["Homes", "Townhomes", "Condos", "Rental properties"],
    commercialApps: ["Offices", "Retail spaces", "Light commercial properties"],
    whyProfessional:
      "Electrical emergencies can escalate quickly. A licensed technician can identify hazards, isolate risks, and complete repairs safely—without guesswork.",
    safetyStatement:
      "Do not touch exposed wiring or damaged equipment. If there is a fire, smoke, or immediate danger, leave the property and contact emergency services before calling Premier Home Services.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "When should I call emergency electrical service?",
        answer:
          "Call immediately for burning smells, sparking, hot panels, exposed wiring, sudden outages limited to your property, or any situation that feels unsafe.",
      },
      {
        question: "Are you available overnight?",
        answer: "Yes. Emergency electrical support is available 24/7 across the Greater Toronto Area.",
      },
    ],
    relatedServiceSlugs: ["electrical-services", "24-7-emergency-hvac-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request Emergency Service",
    seoTitle: "24/7 Emergency Electrician | Premier Home Services Greater Toronto Area",
    seoDescription:
      "Urgent electrical repairs for GTA homes and businesses. Call 437-256-1028 for 24/7 emergency electrical support.",
    displayOrder: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Electrical Services",
    slug: "electrical-services",
    category: "electrical",
    isEmergency: false,
    shortDescription:
      "Repairs, installations, panel work, lighting, outlets, wiring, inspections, and maintenance.",
    fullDescription:
      "Premier Home Services provides residential and commercial electrical services across the GTA—from troubleshooting and repairs to installations, lighting, outlets, switches, wiring, and panel-related work performed by licensed technicians.",
    heroHeading: "Professional Electrical Services for Homes & Businesses",
    heroSubheading:
      "Reliable repairs, installations, and maintenance with clear communication and quality workmanship.",
    heroImage: img("electricalTech"),
    gallery: [img("lighting"), img("electricalPanel"), img("wiring"), img("residentialHome")],
    commonProblems: [
      "Flickering lights",
      "Non-working outlets",
      "Aging panels",
      "Overloaded circuits",
      "Outdated wiring concerns",
    ],
    inclusions: [
      "Electrical repairs",
      "Electrical installations",
      "Panel and breaker services",
      "Lighting installation",
      "Outlet and switch services",
      "Wiring and rewiring",
      "Electrical inspections",
      "Maintenance and troubleshooting",
    ],
    residentialApps: ["Homes", "Renovations", "Additions", "Rental units"],
    commercialApps: ["Offices", "Retail", "Property management work"],
    whyProfessional:
      "Electrical systems demand precision. Professional service helps protect people, property, and equipment while keeping work aligned with applicable codes.",
    safetyStatement:
      "All electrical work is performed with safety as the priority. Customers receive clear guidance before work begins.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "Do you handle both residential and commercial electrical work?",
        answer: "Yes. We serve homeowners, landlords, property managers, and businesses across the GTA.",
      },
    ],
    relatedServiceSlugs: ["24-7-emergency-electrical-services", "hvac-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request Electrical Service",
    seoTitle: "Electrical Services GTA | Premier Home Services Licensed Electricians",
    seoDescription:
      "Electrical repairs, installations, lighting, panels, and maintenance across the Greater Toronto Area.",
    displayOrder: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "24/7 Emergency HVAC Services",
    slug: "24-7-emergency-hvac-services",
    category: "hvac",
    isEmergency: true,
    shortDescription:
      "Urgent help for no heat, no cooling, system shutdowns, unusual noises, and equipment failure.",
    fullDescription:
      "When heating or cooling fails—especially in extreme weather—Premier Home Services provides 24/7 emergency HVAC diagnostics and repair support for residential and commercial properties across the GTA.",
    heroHeading: "24/7 Emergency HVAC Response",
    heroSubheading:
      "No heat, no cooling, system shutdowns, and suspected equipment failure—help when comfort and safety matter.",
    heroImage: img("hvacTech"),
    gallery: [img("furnace"), img("hvacUnit"), img("thermostat"), img("emergencyResponse")],
    commonProblems: [
      "No heat",
      "No cooling during extreme conditions",
      "Burning smells from HVAC equipment",
      "System shutdown",
      "Unusual noises",
      "Suspected equipment failure",
    ],
    inclusions: ["Emergency diagnostics", "Urgent repair assessment", "System safety checks"],
    residentialApps: ["Furnaces", "Air conditioning systems", "Thermostat issues"],
    commercialApps: ["Light commercial HVAC systems", "Tenant comfort issues"],
    whyProfessional:
      "HVAC emergencies affect comfort, indoor air, and sometimes safety. Professional diagnostics help restore systems correctly and quickly.",
    safetyStatement:
      "If you suspect a gas leak or carbon monoxide danger, leave the property immediately and contact the relevant emergency or utility service before calling Premier Home Services.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "What counts as an HVAC emergency?",
        answer:
          "No heat in cold weather, no cooling in extreme heat, sudden shutdowns, burning smells, or conditions that affect safety and occupancy.",
      },
    ],
    relatedServiceSlugs: ["hvac-services", "24-7-emergency-plumbing-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request Emergency HVAC",
    seoTitle: "24/7 Emergency HVAC | Premier Home Services Greater Toronto Area",
    seoDescription:
      "Emergency heating and cooling support for GTA properties. Call 437-256-1028 anytime.",
    displayOrder: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "HVAC Services",
    slug: "hvac-services",
    category: "hvac",
    isEmergency: false,
    shortDescription:
      "Heating, cooling, diagnostics, repairs, installation support, maintenance, and thermostat service.",
    fullDescription:
      "Keep your property comfortable year-round with Premier Home Services HVAC services—diagnostics, repairs, maintenance, ventilation support, and thermostat services for homes and businesses in the Greater Toronto Area.",
    heroHeading: "Heating, Cooling & HVAC Care for the GTA",
    heroSubheading:
      "Reliable HVAC service focused on performance, comfort, and clear recommendations.",
    heroImage: img("hvacUnit"),
    gallery: [img("furnace"), img("hvacTech"), img("thermostat"), img("commercialMech")],
    commonProblems: [
      "Uneven temperatures",
      "Weak airflow",
      "Rising energy use",
      "Noisy equipment",
      "Thermostat issues",
    ],
    inclusions: [
      "Heating services",
      "Cooling services",
      "HVAC diagnostics",
      "Repairs",
      "Installation support",
      "Maintenance",
      "Ventilation support",
      "Thermostat services",
    ],
    residentialApps: ["Homes", "Townhomes", "Rental properties"],
    commercialApps: ["Offices", "Retail", "Managed properties"],
    whyProfessional:
      "Professional HVAC service helps systems run efficiently, catch issues early, and avoid larger failures during peak seasons.",
    safetyStatement:
      "Technicians follow safe service practices and will advise you clearly if additional specialized attention is required.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "Do you offer maintenance as well as repairs?",
        answer: "Yes. We help with diagnostics, repairs, and maintenance to keep systems performing reliably.",
      },
    ],
    relatedServiceSlugs: ["24-7-emergency-hvac-services", "plumbing-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request HVAC Service",
    seoTitle: "HVAC Services GTA | Heating & Cooling | Premier Home Services",
    seoDescription:
      "Heating, cooling, diagnostics, repairs, and maintenance for Greater Toronto Area properties.",
    displayOrder: 4,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "24/7 Emergency Plumbing Services",
    slug: "24-7-emergency-plumbing-services",
    category: "plumbing",
    isEmergency: true,
    shortDescription:
      "Burst pipes, major leaks, overflowing fixtures, sewer backups, and urgent water emergencies.",
    fullDescription:
      "Plumbing emergencies can cause rapid water damage. Premier Home Services provides 24/7 emergency plumbing support for burst pipes, major leaks, backups, and loss of water across the Greater Toronto Area.",
    heroHeading: "24/7 Emergency Plumbing When Every Minute Matters",
    heroSubheading:
      "Burst pipes, major leaks, overflowing fixtures, and backups—urgent help for GTA properties.",
    heroImage: img("plumbingRepair"),
    gallery: [img("pipes"), img("bathroom"), img("plumbingTools"), img("emergencyResponse")],
    commonProblems: [
      "Burst pipes",
      "Major leaks",
      "Overflowing fixtures",
      "Sewer backups",
      "Loss of water",
      "Water damage risks",
    ],
    inclusions: [
      "Emergency leak response",
      "Shutoff assistance guidance",
      "Urgent diagnostics",
      "Damage-mitigation support",
    ],
    residentialApps: ["Homes", "Basements", "Kitchens", "Bathrooms"],
    commercialApps: ["Restrooms", "Tenant spaces", "Light commercial plumbing"],
    whyProfessional:
      "Fast professional response helps stop water damage and restore plumbing systems safely.",
    safetyStatement:
      "If it is safe to do so, shut off the water supply at the main valve. Avoid electrical contact near standing water. For immediate danger, contact emergency services.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "What should I do before the technician arrives?",
        answer:
          "If safe, shut off the water supply, move valuables away from water, and avoid using affected fixtures. Do not attempt unsafe repairs.",
      },
    ],
    relatedServiceSlugs: ["plumbing-services", "24-7-emergency-electrical-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request Emergency Plumbing",
    seoTitle: "24/7 Emergency Plumber | Premier Home Services Greater Toronto Area",
    seoDescription:
      "Urgent plumbing repairs for burst pipes, leaks, and backups across the GTA. Call 437-256-1028.",
    displayOrder: 5,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "Plumbing Services",
    slug: "plumbing-services",
    category: "plumbing",
    isEmergency: false,
    shortDescription:
      "Leak repairs, fixtures, pipe work, drain-related service, maintenance, and troubleshooting.",
    fullDescription:
      "From leak repairs and fixture installation to pipe work, drain-related service, and maintenance, Premier Home Services delivers dependable plumbing solutions for residential and commercial properties in the GTA.",
    heroHeading: "Reliable Plumbing Services for Homes & Businesses",
    heroSubheading:
      "Professional leak repairs, installations, maintenance, and troubleshooting across the GTA.",
    heroImage: img("plumbingTools"),
    gallery: [img("kitchen"), img("bathroom"), img("pipes"), img("residentialHome")],
    commonProblems: [
      "Persistent leaks",
      "Low water pressure",
      "Clogged drains",
      "Faulty fixtures",
      "Aging pipe concerns",
    ],
    inclusions: [
      "Leak repairs",
      "Fixture installation",
      "Pipe repairs",
      "Drain-related services",
      "Plumbing maintenance",
      "Installation support",
      "Troubleshooting",
    ],
    residentialApps: ["Kitchens", "Bathrooms", "Basements", "Whole-home plumbing"],
    commercialApps: ["Offices", "Retail washrooms", "Managed properties"],
    whyProfessional:
      "Professional plumbing protects your property from hidden damage and keeps water systems working reliably.",
    safetyStatement:
      "Technicians prioritize clean, careful work and will explain findings before recommending repairs.",
    processSteps: [...PROCESS_STEPS],
    faqs: [
      {
        question: "Can you help with both repairs and new fixtures?",
        answer: "Yes. We handle repairs, fixture work, maintenance, and troubleshooting for residential and commercial clients.",
      },
    ],
    relatedServiceSlugs: ["24-7-emergency-plumbing-services", "electrical-services"],
    startingPriceLabel: "Contact for starting price",
    ctaLabel: "Request Plumbing Service",
    seoTitle: "Plumbing Services GTA | Premier Home Services Licensed Plumbers",
    seoDescription:
      "Plumbing repairs, fixtures, pipe work, and maintenance for Greater Toronto Area properties.",
    displayOrder: 6,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_PRICING: PricingItem[] = FALLBACK_SERVICES.map((s, i) => ({
  _id: `price-${i}`,
  serviceName: s.name,
  category: s.category,
  startingPrice: "Contact for starting price",
  description: s.shortDescription,
  included: s.inclusions?.slice(0, 4),
  featured: s.isEmergency,
  isEmergency: s.isEmergency,
  displayOrder: s.displayOrder,
  active: true,
  ctaLabel: "Request Service",
  ctaUrl: "/request-service",
  linkedServiceSlug: s.slug,
  disclaimer: BUSINESS.pricingDisclaimer,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    _id: "t1",
    quote:
      "Sample testimonial — editable in admin. The technician arrived promptly, explained the issue clearly, and completed the repair carefully.",
    attribution: "GTA Homeowner (Sample)",
    role: "Residential client",
    serviceCategory: "electrical",
    rating: 5,
    isSample: true,
    active: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "t2",
    quote:
      "Sample testimonial — editable in admin. Communication was transparent from booking through completion. Would request service again.",
    attribution: "Property Manager (Sample)",
    role: "Commercial client",
    serviceCategory: "hvac",
    rating: 5,
    isSample: true,
    active: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "t3",
    quote:
      "Sample testimonial — editable in admin. Emergency plumbing response helped limit water damage and restored service the same day.",
    attribution: "Toronto Resident (Sample)",
    role: "Residential client",
    serviceCategory: "plumbing",
    rating: 5,
    isSample: true,
    active: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_BLOGS: BlogPost[] = [
  {
    _id: "b1",
    title: "Signs You May Need an Emergency Electrician",
    slug: "signs-you-may-need-an-emergency-electrician",
    excerpt:
      "Burning smells, sparking outlets, hot panels, and sudden outages are warning signs that deserve immediate professional attention.",
    content:
      "<p>Electrical issues can escalate quickly. If you notice burning smells, sparking, hot panels, exposed wiring, or outages limited to your property, treat the situation seriously.</p><p>Do not touch damaged wiring. If there is fire or immediate danger, leave and contact emergency services first. Then call a licensed electrician for urgent support.</p>",
    featuredImage: img("electricalPanel"),
    author: "PHS Team",
    category: "Electrical",
    tags: ["emergency", "electrical", "safety"],
    status: "published",
    publishedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "b2",
    title: "When to Call for Emergency HVAC Service",
    slug: "when-to-call-for-emergency-hvac-service",
    excerpt:
      "No heat in winter or no cooling in extreme heat can quickly become an occupancy and safety concern for GTA properties.",
    content:
      "<p>HVAC emergencies often involve complete loss of heat or cooling, sudden shutdowns, unusual burning smells, or equipment that will not restart.</p><p>If you suspect a gas leak or carbon monoxide risk, leave the property and contact the utility or emergency service before calling for HVAC support.</p>",
    featuredImage: img("furnace"),
    author: "PHS Team",
    category: "HVAC",
    tags: ["emergency", "hvac"],
    status: "published",
    publishedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "b3",
    title: "How to Reduce Damage During a Plumbing Emergency",
    slug: "how-to-reduce-damage-during-a-plumbing-emergency",
    excerpt:
      "Knowing when and how to shut off water—and when to call for help—can limit damage from leaks and burst pipes.",
    content:
      "<p>During a plumbing emergency, act quickly but safely. If it is safe, shut off the main water supply, move belongings away from water, and avoid electrical contact near standing water.</p><p>Avoid DIY repairs that could worsen damage. Call a licensed plumber for burst pipes, major leaks, backups, and overflowing fixtures.</p>",
    featuredImage: img("pipes"),
    author: "PHS Team",
    category: "Plumbing",
    tags: ["emergency", "plumbing"],
    status: "published",
    publishedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fn();
    if (result == null) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch {
    return fallback;
  }
}
