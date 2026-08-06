/**
 * Premier Home Services MongoDB seed — idempotent (safe to re-run).
 * Run: npm run seed
 * Requires MONGODB_URI; admin from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "../src/models/AdminUser";
import { SiteSettings } from "../src/models/SiteSettings";
import { Service } from "../src/models/Service";
import { PricingItem } from "../src/models/PricingItem";
import { BlogPost } from "../src/models/BlogPost";
import { BlogCategory } from "../src/models/BlogCategory";
import { Testimonial } from "../src/models/Testimonial";
import { Page } from "../src/models/Page";
import {
  PLACEHOLDER_IMAGES,
  IMAGE_ALTS,
  type PlaceholderKey,
} from "../src/lib/placeholders";

/** Load .env.local / .env without requiring the dotenv package. */
function loadEnvFile(filename: string) {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

function img(key: PlaceholderKey) {
  const url = PLACEHOLDER_IMAGES?.[key];
  const alt = IMAGE_ALTS?.[key];
  if (!url) {
    throw new Error(`Missing placeholder image key: ${String(key)}`);
  }
  return { url, alt: alt || String(key) };
}

function imgs(...keys: PlaceholderKey[]) {
  return keys.map(img);
}

const PRICING_DISCLAIMER =
  "Prices shown are starting estimates only. Final pricing may vary based on inspection findings, labour, materials, accessibility, urgency, system condition, and the scope of work. Customers will receive clear pricing before approved work begins.";

const HEADLINE = "Your Trusted Licensed Electrical, HVAC & Plumbing Experts";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "PHS Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment");
  }

  const hash = await bcrypt.hash(password, 12);
  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name,
      email: email.toLowerCase(),
      password: hash,
      role: "admin",
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✓ AdminUser upserted: ${email}`);
}

async function seedSettings() {
  await SiteSettings.findOneAndUpdate(
    { singletonKey: "site" },
    {
      singletonKey: "site",
      businessName: "Premier Home Services",
      logoUrl: "/logo.svg",
      faviconUrl: "/favicon.svg",
      phone: "437-256-1028",
      emergencyPhone: "437-256-1028",
      email: "vnecconstruction@gmail.com",
      serviceArea: "Greater Toronto Area, Ontario",
      businessHours: "Monday–Saturday: 9:00 AM–5:00 PM",
      emergencyAvailability: "Available 24/7",
      specialOfferText: "5% OFF for Seniors, Veterans & First-Time Customers",
      specialOfferPercent: 5,
      specialOfferActive: true,
      footerDescription:
        "Licensed Electrical, HVAC & Plumbing experts serving the Greater Toronto Area with scheduled appointments and 24/7 emergency support.",
      footerLinks: [
        { label: "Services", href: "/services" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Request Service", href: "/request-service" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" },
      ],
      contactFormRecipient: "vnecconstruction@gmail.com",
      defaultSeoTitle:
        "Premier Home Services | Licensed Electrical, HVAC & Plumbing — Greater Toronto Area",
      defaultSeoDescription:
        "Fast, reliable electrical, HVAC, and plumbing services from licensed technicians across the GTA. Scheduled appointments and 24/7 emergency repairs.",
      copyrightText: "© Premier Home Services. All rights reserved.",
      socialLinks: {},
      pricingDisclaimer: PRICING_DISCLAIMER,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("✓ SiteSettings upserted");
}

type ServiceSeed = {
  name: string;
  slug: string;
  category: "electrical" | "hvac" | "plumbing";
  isEmergency: boolean;
  shortDescription: string;
  fullDescription: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: PlaceholderKey;
  gallery: PlaceholderKey[];
  commonProblems: string[];
  inclusions: string[];
  residentialApps: string[];
  commercialApps: string[];
  whyProfessional: string;
  safetyStatement: string;
  processSteps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServiceSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  displayOrder: number;
};

const SERVICES: ServiceSeed[] = [
  {
    name: "24/7 Emergency Electrical Services",
    slug: "24-7-emergency-electrical-services",
    category: "electrical",
    isEmergency: true,
    shortDescription:
      "Round-the-clock emergency electrical response for sudden outages, sparking outlets, hot panels, and urgent electrical faults across the GTA.",
    fullDescription:
      "When electrical problems threaten safety or leave a property without power, prompt professional attention matters. Premier Home Services provides 24/7 emergency electrical services for homeowners and businesses in the Greater Toronto Area. Our licensed technicians diagnose urgent issues, stabilize unsafe conditions, and restore power when it is safe to do so — with clear communication every step of the way.",
    heroHeading: "24/7 Emergency Electrical Services",
    heroSubheading:
      "Fast response for power outages, sparking outlets, hot panels, and urgent electrical faults across the Greater Toronto Area.",
    heroImage: "emergencyResponse",
    gallery: [
      "electricalPanel",
      "wiring",
      "electricalTech",
      "safetyGear",
      "nightCity",
      "tools",
    ],
    commonProblems: [
      "Power outages limited to the property",
      "Burning smells near outlets, switches, or panels",
      "Sparking outlets or switches",
      "Hot electrical panels",
      "Frequently tripping breakers",
      "Exposed or damaged wiring",
      "Sudden electrical faults",
      "Emergency troubleshooting after storms or equipment failure",
    ],
    inclusions: [
      "Priority emergency dispatch when available",
      "On-site safety assessment",
      "Diagnostic troubleshooting",
      "Temporary stabilization of unsafe conditions when possible",
      "Clear explanation of findings before approved work",
      "Code-conscious repair recommendations",
    ],
    residentialApps: [
      "Home power loss affecting circuits or the full dwelling",
      "Kitchen, bathroom, or bedroom outlet emergencies",
      "Panel overheating or breaker failures",
      "After-hours residential electrical faults",
    ],
    commercialApps: [
      "Business power disruptions affecting operations",
      "Tenant or retail suite electrical emergencies",
      "Office lighting and circuit faults after hours",
      "Urgent commercial panel and distribution issues",
    ],
    whyProfessional:
      "Electrical emergencies can escalate quickly. Licensed technicians have the training, tools, and safety practices needed to identify hazards, isolate faults, and restore systems without guesswork. Professional service helps protect people, property, and connected equipment.",
    safetyStatement:
      "SAFETY WARNING: Do not touch exposed wiring, sparking outlets, or a hot electrical panel. If you smell burning, see smoke or flames, or face immediate danger, leave the area and call emergency services (911) first. Only contact Premier Home Services once it is safe to do so. Never attempt DIY repairs on live electrical systems during an emergency.",
    processSteps: [
      {
        title: "Call or submit an emergency request",
        description:
          "Reach us by phone or online request and describe the symptoms, property type, and any safety concerns.",
      },
      {
        title: "Safety triage",
        description:
          "We help you confirm whether to shut off power at the breaker (when safe) and whether emergency services should be contacted first.",
      },
      {
        title: "Technician dispatch",
        description:
          "A licensed technician is dispatched based on urgency, location in the GTA, and availability.",
      },
      {
        title: "Inspection and diagnosis",
        description:
          "On arrival we assess hazards, identify the likely cause, and explain options before work begins.",
      },
      {
        title: "Approved repair and verification",
        description:
          "Approved work is completed carefully, then systems are checked for safe operation before we leave.",
      },
    ],
    faqs: [
      {
        question: "What counts as an electrical emergency?",
        answer:
          "Urgent issues include burning smells, sparking, hot panels, exposed wiring, frequent breaker trips that suggest a fault, and sudden partial or full power loss at the property. If fire or immediate danger is present, call 911 first.",
      },
      {
        question: "Are you available overnight and on weekends?",
        answer:
          "Emergency electrical support is available 24/7. Scheduled non-emergency appointments are offered Monday–Saturday, 9:00 AM–5:00 PM.",
      },
      {
        question: "Should I shut off the main breaker?",
        answer:
          "If it is safe to access the panel and you are not standing in water, shutting off the affected breaker or main can reduce risk. If you are unsure or conditions feel unsafe, leave the area and call emergency services.",
      },
      {
        question: "Do you serve the Greater Toronto Area?",
        answer:
          "Yes. Premier Home Services provides emergency and scheduled electrical services across the Greater Toronto Area, Ontario.",
      },
      {
        question: "How is pricing handled for emergencies?",
        answer:
          "Starting prices are placeholders until confirmed. Final pricing depends on inspection findings, labour, materials, urgency, and scope. You receive clear pricing before approved work begins.",
      },
    ],
    relatedServiceSlugs: ["electrical-services", "24-7-emergency-hvac-services", "24-7-emergency-plumbing-services"],
    seoTitle: "24/7 Emergency Electrician | Premier Home Services — Greater Toronto Area",
    seoDescription:
      "24/7 emergency electrical services in the GTA for outages, sparking outlets, hot panels, and urgent faults. Licensed technicians. Call 437-256-1028.",
    displayOrder: 1,
  },
  {
    name: "Electrical Services",
    slug: "electrical-services",
    category: "electrical",
    isEmergency: false,
    shortDescription:
      "Scheduled electrical repairs, installations, panel work, lighting, outlets, wiring, inspections, and maintenance for homes and businesses.",
    fullDescription:
      "Premier Home Services delivers professional electrical services for residential and commercial properties across the Greater Toronto Area. From repairs and installations to panel work, lighting, outlets, wiring, inspections, and maintenance, our licensed technicians focus on safe, code-conscious workmanship and clear communication — so you know what is being done and why.",
    heroHeading: "Electrical Services",
    heroSubheading:
      "Repairs, installations, panels, lighting, wiring, and maintenance — licensed technicians serving homes and businesses across the GTA.",
    heroImage: "electricalTech",
    gallery: [
      "lighting",
      "electricalPanel",
      "wiring",
      "residentialHome",
      "officeBuilding",
      "blueprint",
    ],
    commonProblems: [
      "Outlets or switches that fail intermittently",
      "Flickering or dimming lights",
      "Aging panels needing assessment",
      "Insufficient lighting in living or work spaces",
      "Damaged or outdated wiring concerns",
      "New fixture or circuit installation needs",
      "Routine electrical maintenance overdue",
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
      "Residential electrical work",
      "Commercial electrical work",
    ],
    residentialApps: [
      "Home lighting upgrades and fixture installs",
      "Kitchen and bathroom outlet and GFCI work",
      "Panel assessments and breaker replacements",
      "Basement, garage, and outdoor circuit needs",
    ],
    commercialApps: [
      "Office and retail lighting projects",
      "Suite fit-out electrical work",
      "Commercial panel and circuit troubleshooting",
      "Scheduled maintenance for business properties",
    ],
    whyProfessional:
      "Electrical systems affect safety, insurance considerations, and the reliability of every connected device. Professional licensed service helps ensure work is planned carefully, completed to applicable standards, and documented clearly for the property owner.",
    safetyStatement:
      "All electrical work should be performed by licensed technicians. De-energize circuits before any homeowner troubleshooting of switches or outlets, and never open a panel if you are not qualified. If you detect burning smells, sparking, or heat at the panel, treat it as an emergency and call for professional help.",
    processSteps: [
      {
        title: "Request service",
        description:
          "Tell us about the electrical concern, property type, and preferred timing for a scheduled visit.",
      },
      {
        title: "Consultation",
        description:
          "We review the scope, ask clarifying questions, and arrange a convenient appointment window.",
      },
      {
        title: "On-site inspection",
        description:
          "A licensed technician inspects the system and explains findings in plain language.",
      },
      {
        title: "Upfront quote",
        description:
          "You receive clear pricing for the recommended work before anything is approved.",
      },
      {
        title: "Completion and walkthrough",
        description:
          "Approved work is completed, tested, and reviewed with you before we wrap up.",
      },
    ],
    faqs: [
      {
        question: "Do you handle both residential and commercial electrical work?",
        answer:
          "Yes. We provide electrical repairs, installations, and maintenance for homes and businesses in the Greater Toronto Area.",
      },
      {
        question: "Can you install lighting and outlets?",
        answer:
          "Yes. Lighting installation, outlet and switch services, and related wiring work are part of our scheduled electrical services.",
      },
      {
        question: "What are your regular business hours?",
        answer:
          "Scheduled appointments are available Monday–Saturday, 9:00 AM–5:00 PM. For after-hours emergencies, use our 24/7 emergency electrical line.",
      },
      {
        question: "Is there a discount for seniors, veterans, or first-time customers?",
        answer:
          "Yes. When the special offer is active, eligible customers can receive 5% OFF. Ask when you request service for current details.",
      },
      {
        question: "How do starting prices work?",
        answer:
          "Listed starting prices are placeholders until confirmed. Final pricing depends on inspection, materials, labour, and scope. Pricing is confirmed before approved work begins.",
      },
    ],
    relatedServiceSlugs: [
      "24-7-emergency-electrical-services",
      "hvac-services",
      "plumbing-services",
    ],
    seoTitle: "Electrical Services | Premier Home Services — Repairs & Installations in the GTA",
    seoDescription:
      "Licensed electrical repairs, installations, panels, lighting, wiring, and maintenance for GTA homes and businesses. Request service with Premier Home Services.",
    displayOrder: 2,
  },
  {
    name: "24/7 Emergency HVAC Services",
    slug: "24-7-emergency-hvac-services",
    category: "hvac",
    isEmergency: true,
    shortDescription:
      "Urgent heating and cooling response for no-heat, no-cooling, system shutdowns, unusual noises, and suspected equipment failure — day or night.",
    fullDescription:
      "HVAC failures can quickly become unsafe or uncomfortable — especially during extreme weather. Premier Home Services offers 24/7 emergency HVAC services across the Greater Toronto Area for no heat, no cooling, system shutdowns, unusual noises, and suspected equipment failure. Licensed technicians focus on safe diagnostics and clear next steps.",
    heroHeading: "24/7 Emergency HVAC Services",
    heroSubheading:
      "Urgent heating and cooling support when systems fail — available around the clock across the Greater Toronto Area.",
    heroImage: "furnace",
    gallery: [
      "hvacUnit",
      "hvacTech",
      "thermostat",
      "emergencyResponse",
      "van",
      "safetyGear",
    ],
    commonProblems: [
      "No heat",
      "No cooling during extreme conditions",
      "Burning smells from HVAC equipment",
      "System shutdown",
      "Unusual noises",
      "Suspected equipment failure",
      "Emergency diagnostics after sudden performance loss",
    ],
    inclusions: [
      "24/7 emergency HVAC response when available",
      "Safety-first triage guidance",
      "On-site diagnostics",
      "Temporary comfort and safety recommendations",
      "Transparent findings before approved repairs",
      "Residential and commercial emergency support",
    ],
    residentialApps: [
      "Furnace or heat failure overnight",
      "Air conditioning failure during heat waves",
      "Thermostat-related sudden system loss",
      "Unusual furnace or condenser noises at home",
    ],
    commercialApps: [
      "Business climate control failures affecting staff or customers",
      "After-hours rooftop or mechanical equipment issues",
      "Suite or office HVAC shutdowns",
      "Urgent commercial diagnostic visits",
    ],
    whyProfessional:
      "Heating and cooling systems involve electrical components, combustion equipment, refrigerants, and airflow pathways. Professional emergency service reduces the risk of improper resets, missed hazards, and incomplete repairs when comfort and safety are on the line.",
    safetyStatement:
      "SAFETY WARNING: If you suspect a gas leak or carbon monoxide danger, leave the property immediately. Do not operate switches or use phones inside if gas is suspected. Contact the relevant emergency services and your gas utility before contacting Premier Home Services. Only request HVAC service once the property has been declared safe.",
    processSteps: [
      {
        title: "Emergency contact",
        description:
          "Call or submit a request describing symptoms, equipment type if known, and any safety concerns.",
      },
      {
        title: "Hazard screening",
        description:
          "We screen for gas, carbon monoxide, smoke, or flooding risks and advise contacting emergency services when needed.",
      },
      {
        title: "Dispatch",
        description:
          "A technician is dispatched based on urgency and GTA location.",
      },
      {
        title: "Diagnostics",
        description:
          "We inspect the system, identify likely causes, and outline repair options with clear pricing before work proceeds.",
      },
      {
        title: "Repair and confirmation",
        description:
          "Approved repairs are completed and the system is checked for safe, expected operation.",
      },
    ],
    faqs: [
      {
        question: "What should I do if I smell gas?",
        answer:
          "Leave the property immediately and contact emergency services and your gas utility. Do not return until the property is safe. Contact Premier Home Services only after authorities or the utility confirm it is safe.",
      },
      {
        question: "Can you help if my furnace stops at night?",
        answer:
          "Yes. No-heat situations are a common reason for emergency HVAC calls. We provide 24/7 emergency support across the GTA.",
      },
      {
        question: "Do you service both heating and cooling emergencies?",
        answer:
          "Yes. Emergency HVAC coverage includes heating failures, cooling failures in extreme conditions, shutdowns, unusual noises, and diagnostic visits.",
      },
      {
        question: "Will I know the price before repairs start?",
        answer:
          "Yes. After inspection you receive clear pricing for recommended work before approved repairs begin.",
      },
      {
        question: "Are seniors or veterans eligible for a discount?",
        answer:
          "When our special offer is active, seniors, veterans, and first-time customers may receive 5% OFF. Ask when you book for current eligibility.",
      },
    ],
    relatedServiceSlugs: [
      "hvac-services",
      "24-7-emergency-electrical-services",
      "24-7-emergency-plumbing-services",
    ],
    seoTitle: "24/7 Emergency HVAC | Premier Home Services — Greater Toronto Area",
    seoDescription:
      "24/7 emergency heating and cooling service in the GTA for no heat, no cooling, shutdowns, and equipment failure. Call 437-256-1028.",
    displayOrder: 3,
  },
  {
    name: "HVAC Services",
    slug: "hvac-services",
    category: "hvac",
    isEmergency: false,
    shortDescription:
      "Heating, cooling, diagnostics, repairs, installation support, maintenance, ventilation, and thermostat services for GTA properties.",
    fullDescription:
      "Keep your indoor climate reliable with Premier Home Services HVAC services. We support residential and commercial properties across the Greater Toronto Area with heating and cooling service, diagnostics, repairs, installation support, maintenance, ventilation work, and thermostat services — delivered by licensed technicians with transparent communication.",
    heroHeading: "HVAC Services",
    heroSubheading:
      "Heating, cooling, diagnostics, repairs, maintenance, ventilation, and thermostat services for homes and businesses in the GTA.",
    heroImage: "hvacTech",
    gallery: [
      "hvacUnit",
      "thermostat",
      "furnace",
      "commercialMech",
      "residentialHome",
      "teamWork",
    ],
    commonProblems: [
      "Uneven heating or cooling",
      "Reduced airflow",
      "Rising energy use with weaker performance",
      "Thermostat not communicating reliably",
      "Seasonal maintenance overdue",
      "Noisy operation during normal use",
      "System not keeping up with weather demands",
    ],
    inclusions: [
      "Heating services",
      "Cooling services",
      "HVAC diagnostics",
      "Repairs",
      "Installation support",
      "Maintenance",
      "Ventilation",
      "Thermostat services",
      "Residential systems",
      "Commercial systems",
    ],
    residentialApps: [
      "Home furnace and AC maintenance",
      "Thermostat upgrades and troubleshooting",
      "Seasonal tune-ups before peak weather",
      "Comfort improvements for living spaces",
    ],
    commercialApps: [
      "Office and retail climate maintenance",
      "Commercial equipment diagnostics",
      "Scheduled preventive HVAC visits",
      "Tenant comfort troubleshooting",
    ],
    whyProfessional:
      "Proper HVAC care protects comfort, equipment life, and indoor air pathways. Licensed technicians can diagnose issues accurately, recommend appropriate repairs, and help avoid incomplete fixes that lead to repeat failures.",
    safetyStatement:
      "Follow manufacturer guidance for filter changes and basic thermostat settings. Do not attempt combustion-equipment repairs or refrigerant work yourself. If you suspect gas or carbon monoxide issues, leave the property and contact emergency services and your utility immediately.",
    processSteps: [
      {
        title: "Book an appointment",
        description:
          "Request HVAC service online or by phone with preferred dates during business hours.",
      },
      {
        title: "Scope review",
        description:
          "We confirm system type, symptoms, and access needs before the visit.",
      },
      {
        title: "Inspection and diagnosis",
        description:
          "A technician evaluates performance and explains findings clearly.",
      },
      {
        title: "Quote and approval",
        description:
          "Recommended work is priced upfront for your approval.",
      },
      {
        title: "Service completion",
        description:
          "Approved maintenance or repairs are completed and verified.",
      },
    ],
    faqs: [
      {
        question: "Do you offer both heating and cooling service?",
        answer:
          "Yes. Our HVAC services cover heating, cooling, diagnostics, repairs, maintenance, ventilation, and thermostat support.",
      },
      {
        question: "Can you help with commercial HVAC?",
        answer:
          "Yes. We support residential and commercial HVAC needs across the Greater Toronto Area.",
      },
      {
        question: "When should I schedule maintenance?",
        answer:
          "Many property owners schedule maintenance before peak heating or cooling seasons. Contact us to arrange a convenient appointment.",
      },
      {
        question: "What if my system fails after hours?",
        answer:
          "Use our 24/7 emergency HVAC service for urgent no-heat, no-cooling, or shutdown situations.",
      },
      {
        question: "How is pricing confirmed?",
        answer:
          "Starting prices are placeholders until confirmed. Final pricing is based on inspection findings, parts, labour, and scope, and is shared before approved work begins.",
      },
    ],
    relatedServiceSlugs: [
      "24-7-emergency-hvac-services",
      "electrical-services",
      "plumbing-services",
    ],
    seoTitle: "HVAC Services | Premier Home Services — Heating & Cooling in the GTA",
    seoDescription:
      "Licensed HVAC heating, cooling, diagnostics, repairs, and maintenance for Greater Toronto Area homes and businesses. Request service today.",
    displayOrder: 4,
  },
  {
    name: "24/7 Emergency Plumbing Services",
    slug: "24-7-emergency-plumbing-services",
    category: "plumbing",
    isEmergency: true,
    shortDescription:
      "Urgent plumbing response for burst pipes, major leaks, overflowing fixtures, sewer backups, and loss of water — available 24/7 in the GTA.",
    fullDescription:
      "Plumbing emergencies can damage property within minutes. Premier Home Services provides 24/7 emergency plumbing services across the Greater Toronto Area for burst pipes, major leaks, overflowing fixtures, sewer backups, loss of water, and water-damage risks. Technicians prioritize shutoff guidance, damage control, and clear repair recommendations.",
    heroHeading: "24/7 Emergency Plumbing Services",
    heroSubheading:
      "Rapid help for burst pipes, major leaks, backups, and water emergencies — day or night across the Greater Toronto Area.",
    heroImage: "plumbingRepair",
    gallery: [
      "pipes",
      "plumbingTools",
      "bathroom",
      "emergencyResponse",
      "kitchen",
      "van",
    ],
    commonProblems: [
      "Burst pipes",
      "Major leaks",
      "Overflowing fixtures",
      "Sewer backups",
      "Loss of water",
      "Water damage risks",
      "Emergency shutoff assistance",
    ],
    inclusions: [
      "24/7 emergency plumbing dispatch when available",
      "Shutoff guidance when safe",
      "Leak source identification",
      "Damage-control recommendations",
      "Upfront repair options after inspection",
      "Residential and commercial emergency support",
    ],
    residentialApps: [
      "Home burst supply lines",
      "Overflowing toilets or tubs",
      "Basement backup emergencies",
      "Sudden loss of water to the dwelling",
    ],
    commercialApps: [
      "Business restroom overflows",
      "Commercial kitchen leak emergencies",
      "After-hours tenant plumbing failures",
      "Urgent shutoff and leak response for commercial suites",
    ],
    whyProfessional:
      "Water emergencies escalate through floors, walls, and electrical spaces. Professional plumbers locate sources quickly, protect surrounding areas when possible, and complete durable repairs rather than temporary guesses.",
    safetyStatement:
      "SAFETY GUIDANCE: If it is safe to do so, shut off the water supply at the fixture shutoff or main valve to limit damage. Stay clear of standing water near electrical outlets, panels, or appliances. If flooding creates electrical risk or structural concern, leave the area and contact emergency services. Call Premier Home Services for emergency plumbing once immediate hazards are addressed.",
    processSteps: [
      {
        title: "Call for emergency help",
        description:
          "Describe the leak, backup, or water loss and whether you have shut off the supply.",
      },
      {
        title: "Damage-limiting guidance",
        description:
          "When safe, we guide you on shutoffs and steps that can reduce water spread before arrival.",
      },
      {
        title: "Technician arrival",
        description:
          "We assess the source, protect surrounding areas when possible, and explain findings.",
      },
      {
        title: "Quoted repair plan",
        description:
          "You receive clear pricing for recommended emergency repairs before work is approved.",
      },
      {
        title: "Repair and check",
        description:
          "Approved repairs are completed and the affected system is checked for leaks and function.",
      },
    ],
    faqs: [
      {
        question: "Where is my main water shutoff?",
        answer:
          "Many homes have a main shutoff near where the water line enters the building, often in a basement, utility room, or near a water meter. If you cannot locate it safely, describe the situation when you call and we will guide you.",
      },
      {
        question: "Is a slow leak an emergency?",
        answer:
          "Active flooding, burst pipes, sewage backups, and rapidly spreading water are emergencies. Smaller leaks can still cause damage — contact us promptly so we can help prioritize urgency.",
      },
      {
        question: "Do you respond overnight?",
        answer:
          "Yes. Emergency plumbing support is available 24/7 across the Greater Toronto Area.",
      },
      {
        question: "Can standing water be dangerous?",
        answer:
          "Yes. Standing water near electrical equipment is hazardous. Avoid contact and call emergency services if there is immediate danger.",
      },
      {
        question: "How does emergency pricing work?",
        answer:
          "Starting prices are placeholders until confirmed. After inspection we provide clear pricing based on labour, materials, urgency, and scope before approved work begins.",
      },
    ],
    relatedServiceSlugs: [
      "plumbing-services",
      "24-7-emergency-electrical-services",
      "24-7-emergency-hvac-services",
    ],
    seoTitle: "24/7 Emergency Plumber | Premier Home Services — Greater Toronto Area",
    seoDescription:
      "24/7 emergency plumbing for burst pipes, major leaks, backups, and water loss in the GTA. Call 437-256-1028 for urgent help.",
    displayOrder: 5,
  },
  {
    name: "Plumbing Services",
    slug: "plumbing-services",
    category: "plumbing",
    isEmergency: false,
    shortDescription:
      "Leak repairs, fixture installation, pipe repairs, drain-related service, maintenance, troubleshooting, and residential or commercial plumbing support.",
    fullDescription:
      "Premier Home Services provides professional plumbing services for homes and businesses in the Greater Toronto Area. From leak repairs and fixture installation to pipe repairs, drain-related service, maintenance, and troubleshooting, our technicians focus on reliable workmanship and clear communication — without overstating specialized services beyond what is confirmed.",
    heroHeading: "Plumbing Services",
    heroSubheading:
      "Leak repairs, fixtures, pipes, drains, maintenance, and troubleshooting for residential and commercial properties in the GTA.",
    heroImage: "bathroom",
    gallery: [
      "kitchen",
      "plumbingRepair",
      "pipes",
      "plumbingTools",
      "residentialHome",
      "officeBuilding",
    ],
    commonProblems: [
      "Persistent fixture leaks",
      "Low water flow at fixtures",
      "Drain performance issues",
      "Aging supply or drain lines needing repair",
      "Fixture replacement needs",
      "Routine plumbing maintenance overdue",
      "Intermittent troubleshooting after renovations",
    ],
    inclusions: [
      "Leak repairs",
      "Fixture installation",
      "Pipe repairs",
      "Drain-related services",
      "Plumbing maintenance",
      "Installation",
      "Troubleshooting",
      "Residential plumbing",
      "Commercial plumbing",
    ],
    residentialApps: [
      "Kitchen and bathroom fixture installs",
      "Supply line and shutoff repairs",
      "Drain troubleshooting in homes",
      "Scheduled residential plumbing maintenance",
    ],
    commercialApps: [
      "Restroom fixture service for businesses",
      "Commercial suite leak repairs",
      "Scheduled maintenance for commercial properties",
      "Tenant plumbing troubleshooting",
    ],
    whyProfessional:
      "Plumbing systems interconnect water supply, drainage, and finished surfaces. Professional service helps prevent repeat leaks, improper fixture installs, and incomplete diagnoses that can lead to hidden moisture damage.",
    safetyStatement:
      "Shut off local fixture valves before attempting basic homeowner checks. Avoid chemical drain products that may damage pipes or create hazards for technicians. For major leaks, backups, or flooding near electrical equipment, treat the situation as an emergency.",
    processSteps: [
      {
        title: "Request plumbing service",
        description:
          "Share the issue, property type, and preferred appointment window.",
      },
      {
        title: "Scheduling",
        description:
          "We confirm timing during Monday–Saturday business hours or escalate to emergency service if needed.",
      },
      {
        title: "Inspection",
        description:
          "A technician inspects the affected area and explains findings.",
      },
      {
        title: "Transparent quote",
        description:
          "Recommended repairs or installs are priced clearly before approval.",
      },
      {
        title: "Completion",
        description:
          "Approved work is completed and checked for proper function.",
      },
    ],
    faqs: [
      {
        question: "Do you install fixtures?",
        answer:
          "Yes. Fixture installation and related plumbing work are part of our scheduled plumbing services.",
      },
      {
        question: "Can you help with drain-related issues?",
        answer:
          "Yes. Drain-related services and troubleshooting are available. For severe backups, emergency plumbing may be more appropriate.",
      },
      {
        question: "Do you serve commercial properties?",
        answer:
          "Yes. We provide residential and commercial plumbing support across the Greater Toronto Area.",
      },
      {
        question: "What are regular service hours?",
        answer:
          "Scheduled appointments run Monday–Saturday, 9:00 AM–5:00 PM. Emergency plumbing is available 24/7.",
      },
      {
        question: "Is there a first-time customer offer?",
        answer:
          "When active, seniors, veterans, and first-time customers may receive 5% OFF. Ask when requesting service.",
      },
    ],
    relatedServiceSlugs: [
      "24-7-emergency-plumbing-services",
      "electrical-services",
      "hvac-services",
    ],
    seoTitle: "Plumbing Services | Premier Home Services — Repairs & Installs in the GTA",
    seoDescription:
      "Licensed plumbing repairs, fixture installs, pipe work, drains, and maintenance for Greater Toronto Area homes and businesses.",
    displayOrder: 6,
  },
];

async function seedServices() {
  for (const s of SERVICES) {
    await Service.findOneAndUpdate(
      { slug: s.slug },
      {
        name: s.name,
        slug: s.slug,
        category: s.category,
        isEmergency: s.isEmergency,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        heroHeading: s.heroHeading,
        heroSubheading: s.heroSubheading,
        heroImage: img(s.heroImage),
        gallery: imgs(...s.gallery),
        commonProblems: s.commonProblems,
        inclusions: s.inclusions,
        residentialApps: s.residentialApps,
        commercialApps: s.commercialApps,
        whyProfessional: s.whyProfessional,
        safetyStatement: s.safetyStatement,
        processSteps: s.processSteps,
        faqs: s.faqs,
        relatedServiceSlugs: s.relatedServiceSlugs,
        startingPriceLabel: "Contact for starting price",
        ctaLabel: "Request Service",
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        displayOrder: s.displayOrder,
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ Services upserted: ${SERVICES.length}`);
}

async function seedPricing() {
  const items = SERVICES.map((s, index) => ({
    serviceName: s.name,
    category: s.category,
    startingPrice: "Contact for starting price",
    description: s.shortDescription,
    included: s.inclusions.slice(0, 5),
    excluded: [
      "Materials not specified after inspection",
      "Permit fees if required by the municipality",
      "Work outside the approved scope",
    ],
    featured: !s.isEmergency,
    isEmergency: s.isEmergency,
    displayOrder: index + 1,
    active: true,
    ctaLabel: "Request Service",
    ctaUrl: "/request-service",
    linkedServiceSlug: s.slug,
    disclaimer: PRICING_DISCLAIMER,
  }));

  for (const item of items) {
    await PricingItem.findOneAndUpdate(
      { linkedServiceSlug: item.linkedServiceSlug },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ PricingItem placeholders upserted: ${items.length}`);
}

async function seedBlogCategories() {
  const categories = [
    {
      name: "Electrical",
      slug: "electrical",
      description: "Electrical safety tips and service guidance for GTA property owners.",
    },
    {
      name: "HVAC",
      slug: "hvac",
      description: "Heating and cooling guidance for homes and businesses.",
    },
    {
      name: "Plumbing",
      slug: "plumbing",
      description: "Plumbing emergency preparedness and maintenance ideas.",
    },
    {
      name: "Maintenance",
      slug: "maintenance",
      description: "Preventive maintenance tips for Greater Toronto Area properties.",
    },
  ];

  for (const cat of categories) {
    await BlogCategory.findOneAndUpdate({ slug: cat.slug }, cat, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`✓ BlogCategory upserted: ${categories.length}`);
}

async function seedBlogPosts() {
  const now = new Date();
  const posts = [
    {
      title: "Signs You May Need an Emergency Electrician",
      slug: "signs-you-may-need-an-emergency-electrician",
      excerpt:
        "Learn which electrical warning signs call for immediate professional help — and when to contact emergency services first.",
      content: `
<p>Electrical problems can range from inconvenient to dangerous. Knowing the difference helps you protect people and property while avoiding unsafe DIY attempts.</p>
<h2>Warning signs that need urgent attention</h2>
<ul>
<li>Burning smells near outlets, switches, or the electrical panel</li>
<li>Sparking receptacles or switches</li>
<li>A panel that feels unusually hot</li>
<li>Breakers that trip repeatedly without an obvious overload</li>
<li>Visible damaged or exposed wiring</li>
<li>Sudden loss of power limited to your property</li>
</ul>
<h2>When to call 911 first</h2>
<p>If you see smoke or flames, or anyone is in immediate danger, leave the area and call emergency services. Do not touch exposed wiring. Contact a licensed electrician only after it is safe.</p>
<h2>What you can do while waiting</h2>
<p>If it is safe, shut off the affected breaker. Keep people and pets away from the hazard. Note what happened and when — this helps the technician diagnose faster.</p>
<p>Premier Home Services provides 24/7 emergency electrical services across the Greater Toronto Area. Call <strong>437-256-1028</strong> when you need urgent professional help.</p>
`.trim(),
      featuredImage: img("electricalPanel"),
      inlineImages: imgs("wiring", "electricalTech", "safetyGear"),
      author: "PHS Team",
      category: "Electrical",
      tags: ["electrical", "emergency", "safety", "GTA"],
      metaTitle: "Signs You May Need an Emergency Electrician | Premier Home Services",
      metaDescription:
        "Recognize urgent electrical warning signs and learn when to call emergency services or a licensed electrician in the GTA.",
      ogImage: PLACEHOLDER_IMAGES.electricalPanel,
      status: "published" as const,
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      readingTimeMinutes: 4,
    },
    {
      title: "When to Call for Emergency HVAC Service",
      slug: "when-to-call-for-emergency-hvac-service",
      excerpt:
        "No heat, no cooling, unusual smells, or a sudden shutdown — here is how to decide when HVAC issues become emergencies.",
      content: `
<p>Heating and cooling failures are stressful, especially during extreme weather. Not every issue is an emergency, but some situations should not wait for regular business hours.</p>
<h2>Situations that often need emergency HVAC help</h2>
<ul>
<li>No heat during cold conditions</li>
<li>No cooling during extreme heat</li>
<li>Sudden system shutdown</li>
<li>Burning smells from equipment</li>
<li>Loud or unusual noises followed by failure</li>
<li>Suspected equipment failure affecting safety or occupancy</li>
</ul>
<h2>Gas and carbon monoxide concerns</h2>
<p>If you suspect a gas leak or carbon monoxide danger, leave the property immediately. Contact emergency services and your gas utility before calling any HVAC provider. Only request service after the property is safe.</p>
<h2>Helpful details to share</h2>
<p>Note whether the thermostat has power, whether breakers are tripped, and when the problem started. Avoid repeated reset attempts if equipment smells unusual or feels unsafe.</p>
<p>Premier Home Services offers 24/7 emergency HVAC support across the Greater Toronto Area. Call <strong>437-256-1028</strong> for urgent assistance.</p>
`.trim(),
      featuredImage: img("furnace"),
      inlineImages: imgs("hvacUnit", "thermostat", "hvacTech"),
      author: "PHS Team",
      category: "HVAC",
      tags: ["hvac", "emergency", "heating", "cooling"],
      metaTitle: "When to Call for Emergency HVAC Service | Premier Home Services",
      metaDescription:
        "Know when no heat, no cooling, or HVAC shutdowns require emergency service — and what to do for gas or CO concerns.",
      ogImage: PLACEHOLDER_IMAGES.furnace,
      status: "published" as const,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      readingTimeMinutes: 4,
    },
    {
      title: "How to Reduce Damage During a Plumbing Emergency",
      slug: "how-to-reduce-damage-during-a-plumbing-emergency",
      excerpt:
        "Practical steps to limit water damage during bursts, major leaks, and backups — without unsafe DIY repairs.",
      content: `
<p>Minutes matter when water is escaping into finished spaces. While you wait for a licensed plumber, a few careful steps can reduce damage.</p>
<h2>Priority actions</h2>
<ul>
<li>If safe, shut off water at the fixture valve or main shutoff</li>
<li>Keep people away from standing water near electrical outlets or panels</li>
<li>Move valuables and electronics out of the wet path when safe</li>
<li>Photograph conditions for your records if time allows</li>
<li>Avoid chemical drain additives during active emergencies</li>
</ul>
<h2>Common emergency scenarios</h2>
<p>Burst pipes, major supply leaks, overflowing fixtures, sewer backups, and sudden loss of water all deserve prompt professional attention. If flooding creates electrical or structural risk, leave and contact emergency services.</p>
<h2>What not to do</h2>
<p>Do not attempt major pipe repairs yourself during an active flood. Do not enter water that may be energized. Do not ignore sewage backups — treat them as contamination hazards.</p>
<p>Premier Home Services provides 24/7 emergency plumbing across the Greater Toronto Area. Call <strong>437-256-1028</strong> when you need urgent help.</p>
`.trim(),
      featuredImage: img("pipes"),
      inlineImages: imgs("plumbingRepair", "bathroom", "plumbingTools"),
      author: "PHS Team",
      category: "Plumbing",
      tags: ["plumbing", "emergency", "water damage", "GTA"],
      metaTitle: "How to Reduce Damage During a Plumbing Emergency | Premier Home Services",
      metaDescription:
        "Limit water damage during plumbing emergencies with safe shutoff steps and clear guidance on when to call professionals.",
      ogImage: PLACEHOLDER_IMAGES.pipes,
      status: "published" as const,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      readingTimeMinutes: 5,
    },
    {
      title: "Preventive Maintenance Tips for GTA Property Owners",
      slug: "preventive-maintenance-tips-for-gta-property-owners",
      excerpt:
        "Simple seasonal habits that help electrical, HVAC, and plumbing systems stay reliable for Greater Toronto Area homes and businesses.",
      content: `
<p>Preventive care will not eliminate every repair, but it can reduce surprise failures and help you catch issues earlier — especially through GTA seasonal swings.</p>
<h2>Electrical</h2>
<ul>
<li>Test GFCI outlets periodically using the built-in test/reset buttons</li>
<li>Note flickering lights or warm switch plates and schedule an inspection</li>
<li>Keep panels accessible and free of storage clutter</li>
<li>Schedule professional review if you are planning renovations or added loads</li>
</ul>
<h2>HVAC</h2>
<ul>
<li>Replace or clean filters on the schedule recommended for your system</li>
<li>Book seasonal checkups before peak heating and cooling periods</li>
<li>Keep outdoor units clear of debris and snow buildup</li>
<li>Confirm thermostats are set correctly when seasons change</li>
</ul>
<h2>Plumbing</h2>
<ul>
<li>Know the location of your main water shutoff</li>
<li>Watch for slow drips at supply lines and fixture bases</li>
<li>Avoid putting grease and inappropriate waste down drains</li>
<li>Address minor leaks early before they damage finishes</li>
</ul>
<p>For scheduled service or questions about maintenance visits, contact Premier Home Services at <strong>437-256-1028</strong> or request service online. Emergency support remains available 24/7.</p>
`.trim(),
      featuredImage: img("tools"),
      inlineImages: imgs("blueprint", "teamWork", "torontoSkyline"),
      author: "PHS Team",
      category: "Maintenance",
      tags: ["maintenance", "electrical", "hvac", "plumbing", "GTA"],
      metaTitle: "Preventive Maintenance Tips for GTA Property Owners | Premier Home Services",
      metaDescription:
        "Seasonal electrical, HVAC, and plumbing maintenance tips for Greater Toronto Area homes and businesses.",
      ogImage: PLACEHOLDER_IMAGES.tools,
      status: "published" as const,
      publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      readingTimeMinutes: 5,
    },
  ];

  for (const post of posts) {
    await BlogPost.findOneAndUpdate({ slug: post.slug }, post, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`✓ BlogPost upserted: ${posts.length}`);
}

async function seedTestimonials() {
  const samples = [
    {
      quote:
        "[SAMPLE — EDITABLE] Prompt scheduling and clear communication on our electrical repair. Replace this with a real customer quote when available.",
      attribution: "Sample Customer (Editable)",
      role: "Homeowner — Sample",
      serviceCategory: "electrical" as const,
      rating: 5,
      image: img("residentialHome"),
      isSample: true,
      active: true,
      displayOrder: 1,
    },
    {
      quote:
        "[SAMPLE — EDITABLE] The technician explained HVAC findings before any work began. This is placeholder testimonial content for layout preview only.",
      attribution: "Sample Customer (Editable)",
      role: "Property Manager — Sample",
      serviceCategory: "hvac" as const,
      rating: 5,
      image: img("officeBuilding"),
      isSample: true,
      active: true,
      displayOrder: 2,
    },
    {
      quote:
        "[SAMPLE — EDITABLE] Helpful guidance during a plumbing leak until the technician arrived. Not a real review — replace in the admin portal.",
      attribution: "Sample Customer (Editable)",
      role: "Homeowner — Sample",
      serviceCategory: "plumbing" as const,
      rating: 5,
      image: img("kitchen"),
      isSample: true,
      active: true,
      displayOrder: 3,
    },
    {
      quote:
        "[SAMPLE — EDITABLE] Straightforward booking and professional on-site communication. Marked as a sample for design and CMS testing.",
      attribution: "Sample Customer (Editable)",
      role: "Business Owner — Sample",
      serviceCategory: "general" as const,
      rating: 5,
      image: img("teamWork"),
      isSample: true,
      active: true,
      displayOrder: 4,
    },
  ];

  await Testimonial.deleteMany({ isSample: true });
  await Testimonial.insertMany(samples);
  console.log(`✓ Sample testimonials replaced: ${samples.length}`);
}

type SectionInput = {
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
  images?: ReturnType<typeof img>[];
  background?: string;
  layoutVariant?: string;
  visible?: boolean;
  order: number;
  meta?: Record<string, unknown>;
};

function section(partial: SectionInput): SectionInput {
  return {
    visible: true,
    layoutVariant: "default",
    ...partial,
  };
}

async function seedPages() {
  const pages: {
    title: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    ogImage?: string;
    sections: SectionInput[];
  }[] = [
    {
      title: "Home",
      slug: "home",
      seoTitle: "Premier Home Services | Licensed Electrical, HVAC & Plumbing — GTA",
      seoDescription:
        "Your trusted licensed electrical, HVAC & plumbing experts serving the Greater Toronto Area. Scheduled service and 24/7 emergency support.",
      ogImage: PLACEHOLDER_IMAGES.torontoSkyline,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Greater Toronto Area · Licensed Technicians",
          heading: HEADLINE,
          subheading:
            "Fast, reliable electrical, HVAC, and plumbing services with scheduled appointments and 24/7 emergency support.",
          body: "Serving homes and businesses across the GTA with clear communication and code-conscious workmanship.",
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          secondaryCtaLabel: "Call 24/7 Emergency Line",
          secondaryCtaUrl: "tel:4372561028",
          images: imgs("torontoSkyline", "electricalTech", "van"),
          order: 0,
          meta: { trustBadges: ["Licensed technicians", "GTA service area", "24/7 emergency"] },
        }),
        section({
          key: "trust-marquee",
          type: "marquee",
          heading: "Why property owners call Premier Home Services",
          bullets: [
            "Licensed & Insured",
            "Same-Day Service",
            "24/7 Emergency Support",
            "Transparent Pricing",
            "Satisfaction Guaranteed",
          ],
          images: imgs("tools"),
          order: 1,
        }),
        section({
          key: "core-services",
          type: "services-grid",
          eyebrow: "What we do",
          heading: "Electrical, HVAC & Plumbing",
          subheading: "Explore scheduled service categories built for homes and businesses.",
          body: "Each category includes dedicated emergency coverage when urgent issues cannot wait.",
          images: imgs("electricalPanel", "hvacUnit", "plumbingRepair"),
          ctaLabel: "View All Services",
          ctaUrl: "/services",
          order: 2,
        }),
        section({
          key: "emergency-feature",
          type: "emergency",
          eyebrow: "Always on call",
          heading: "24/7 Emergency Coverage",
          subheading: "Electrical, HVAC, and plumbing emergencies across the Greater Toronto Area.",
          body: "When systems fail after hours, call 437-256-1028 for urgent professional help.",
          bullets: [
            "Emergency electrical response",
            "Emergency HVAC response",
            "Emergency plumbing response",
          ],
          images: imgs("nightCity", "emergencyResponse"),
          ctaLabel: "Call Now",
          ctaUrl: "tel:4372561028",
          secondaryCtaLabel: "Request Emergency Service",
          secondaryCtaUrl: "/request-service",
          order: 3,
        }),
        section({
          key: "about-preview",
          type: "content-image",
          eyebrow: "About Premier Home Services",
          heading: "Built around reliability and clear communication",
          body: "Our mission is to deliver fast, reliable, and professional electrical, HVAC, and plumbing services through licensed, certified, and highly skilled technicians.",
          images: imgs("teamWork", "blueprint"),
          ctaLabel: "About Us",
          ctaUrl: "/about",
          layoutVariant: "split",
          order: 4,
        }),
        section({
          key: "why-choose",
          type: "feature-list",
          heading: "Why choose us",
          bullets: [
            "Licensed professionals",
            "Code-compliant workmanship",
            "Prompt response",
            "Transparent communication",
            "Long-lasting solutions",
            "Customer-focused service",
          ],
          images: imgs("safetyGear", "tools"),
          order: 5,
        }),
        section({
          key: "process",
          type: "process",
          eyebrow: "How it works",
          heading: "A clear service process",
          bullets: [
            "Submit request",
            "Speak with the team",
            "Technician dispatch",
            "Inspection and upfront quote",
            "Professional completion",
            "Final quality check",
          ],
          images: imgs("van", "electricalTech"),
          order: 6,
        }),
        section({
          key: "pricing-preview",
          type: "pricing-preview",
          heading: "Starting prices",
          subheading: "Transparent placeholders until confirmed after inspection.",
          body: PRICING_DISCLAIMER,
          images: imgs("commercialMech"),
          ctaLabel: "View Pricing",
          ctaUrl: "/pricing",
          order: 7,
        }),
        section({
          key: "special-offer",
          type: "offer-banner",
          heading: "5% OFF for Seniors, Veterans & First-Time Customers",
          body: "Ask about current eligibility when you request service. Offer managed in site settings.",
          images: imgs("residentialHome"),
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          order: 8,
        }),
        section({
          key: "service-areas",
          type: "service-area",
          heading: "Serving the Greater Toronto Area",
          body: "Premier Home Services supports residential and commercial properties across the Greater Toronto Area, Ontario — without overstating coverage of specific municipalities.",
          images: imgs("torontoSkyline", "officeBuilding"),
          order: 9,
        }),
        section({
          key: "testimonials",
          type: "testimonials",
          heading: "Sample testimonials",
          subheading: "Editable samples — replace with real reviews in the admin portal.",
          images: imgs("teamWork"),
          order: 10,
        }),
        section({
          key: "blog-preview",
          type: "blog-preview",
          heading: "From the blog",
          subheading: "Practical guidance for GTA property owners.",
          images: imgs("lighting"),
          ctaLabel: "Read the Blog",
          ctaUrl: "/blog",
          order: 11,
        }),
        section({
          key: "final-cta",
          type: "cta",
          heading: "Need help now?",
          body: "Call 437-256-1028 or request service online. Emergency support available 24/7.",
          images: imgs("nightCity", "van"),
          ctaLabel: "Call Now",
          ctaUrl: "tel:4372561028",
          secondaryCtaLabel: "Request Service",
          secondaryCtaUrl: "/request-service",
          order: 12,
        }),
      ],
    },
    {
      title: "About",
      slug: "about",
      seoTitle: "About Premier Home Services | Licensed Electrical, HVAC & Plumbing — GTA",
      seoDescription:
        "Learn about Premier Home Services' mission, story, safety commitment, and residential and commercial electrical, HVAC, and plumbing services in the GTA.",
      ogImage: PLACEHOLDER_IMAGES.teamWork,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "About Premier Home Services",
          heading: HEADLINE,
          subheading:
            "Licensed electrical, HVAC, and plumbing experts serving homes and businesses across the Greater Toronto Area.",
          images: imgs("teamWork", "torontoSkyline", "blueprint"),
          order: 0,
        }),
        section({
          key: "mission",
          type: "content",
          eyebrow: "Our mission",
          heading: "Safe, reliable service you can trust",
          body: "Our mission is to deliver fast, reliable, and professional electrical, HVAC, and plumbing services through licensed, certified, and highly skilled technicians. We are committed to providing safe, code-compliant workmanship, transparent communication, and exceptional customer service, ensuring every home and business receives quality solutions they can trust.",
          images: imgs("safetyGear", "tools"),
          order: 1,
        }),
        section({
          key: "what-we-do",
          type: "feature-list",
          heading: "What we do",
          body: "We provide residential and commercial services performed by licensed technicians.",
          bullets: [
            "Emergency Electrical Services",
            "Electrical Repairs, Installations & Maintenance",
            "Emergency HVAC Services",
            "Heating, Ventilation & Air Conditioning",
            "Emergency Plumbing Services",
            "Plumbing Repairs, Installations & Maintenance",
          ],
          images: imgs("electricalTech", "hvacTech", "plumbingRepair"),
          order: 2,
        }),
        section({
          key: "story",
          type: "content-image",
          eyebrow: "Our story",
          heading: "Founded to make trusted help easier to access",
          body: "Our company was founded with one goal: to make it simple for homeowners and businesses to access trusted, licensed technicians whenever they need professional electrical, HVAC, or plumbing services. We understand that emergencies and unexpected repairs require prompt attention, which is why the company is built around reliability, quality workmanship, and customer satisfaction. The company continues to earn customer trust by connecting customers with licensed professionals who take pride in their work, uphold strong safety standards, and deliver lasting solutions with honesty, integrity, and professionalism.",
          images: imgs("residentialHome", "commercialMech"),
          layoutVariant: "split",
          order: 3,
        }),
        section({
          key: "safety",
          type: "content",
          heading: "Safety commitment",
          body: "Every technician is qualified, experienced, and committed to completing each job safely, efficiently, and in accordance with applicable codes and industry standards. We prioritize hazard awareness, clear customer guidance, and careful workmanship on every visit.",
          images: imgs("safetyGear"),
          order: 4,
        }),
        section({
          key: "capabilities",
          type: "split-cards",
          heading: "Residential and commercial capabilities",
          bullets: [
            "Homes, suites, and residential properties across the GTA",
            "Offices, retail, and commercial suites needing reliable trade support",
          ],
          images: imgs("residentialHome", "officeBuilding"),
          order: 5,
        }),
        section({
          key: "workmanship",
          type: "content",
          heading: "Workmanship standards",
          body: "We focus on code-conscious installations and repairs, clean job sites, and clear explanations of findings so property owners can make informed decisions before work is approved.",
          images: imgs("blueprint", "tools"),
          order: 6,
        }),
        section({
          key: "values",
          type: "feature-list",
          heading: "Core values",
          bullets: [
            "Reliability",
            "Safety",
            "Transparency",
            "Integrity",
            "Customer focus",
          ],
          images: imgs("lighting"),
          order: 7,
        }),
        section({
          key: "process",
          type: "process",
          heading: "Service process",
          bullets: [
            "Request or call",
            "Scope review",
            "On-site inspection",
            "Upfront quote",
            "Approved completion",
          ],
          images: imgs("van"),
          order: 8,
        }),
        section({
          key: "cta",
          type: "cta",
          heading: "Ready to work with Premier Home Services?",
          body: "Request service or call 437-256-1028. Monday–Saturday 9–5 for scheduled visits; emergencies 24/7.",
          images: imgs("nightCity"),
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          secondaryCtaLabel: "Contact Us",
          secondaryCtaUrl: "/contact",
          order: 9,
        }),
      ],
    },
    {
      title: "Services",
      slug: "services",
      seoTitle: "Services | Premier Home Services Electrical, HVAC & Plumbing — GTA",
      seoDescription:
        "Explore Premier Home Services' six service categories: emergency and scheduled electrical, HVAC, and plumbing across the Greater Toronto Area.",
      ogImage: PLACEHOLDER_IMAGES.commercialMech,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Services",
          heading: "Six dedicated service pathways",
          subheading:
            "Emergency and scheduled electrical, HVAC, and plumbing support for the Greater Toronto Area.",
          images: imgs("commercialMech", "electricalPanel", "hvacUnit", "pipes", "van"),
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          order: 0,
        }),
        section({
          key: "intro",
          type: "content",
          heading: "Choose the right category",
          body: "Filter by trade or urgency, then open a full landing page for inclusions, safety guidance, process steps, and FAQs.",
          images: imgs("blueprint"),
          order: 1,
        }),
        section({
          key: "services-grid",
          type: "services-grid",
          heading: "All services",
          subheading: "Emergency badges and scheduled-service options for every trade.",
          images: imgs("electricalTech", "furnace", "bathroom"),
          order: 2,
        }),
        section({
          key: "filters-note",
          type: "content",
          heading: "Filter by need",
          bullets: ["All", "Electrical", "HVAC", "Plumbing", "Emergency"],
          images: imgs("tools"),
          order: 3,
        }),
        section({
          key: "cta",
          type: "cta",
          heading: "Not sure which service you need?",
          body: "Call 437-256-1028 and describe the symptoms — we will help route your request.",
          images: imgs("emergencyResponse"),
          ctaLabel: "Call Now",
          ctaUrl: "tel:4372561028",
          secondaryCtaLabel: "Request Service",
          secondaryCtaUrl: "/request-service",
          order: 4,
        }),
      ],
    },
    {
      title: "Pricing",
      slug: "pricing",
      seoTitle: "Pricing | Premier Home Services — Starting Estimates for GTA Services",
      seoDescription:
        "View starting price placeholders for Premier Home Services electrical, HVAC, and plumbing services. Final pricing confirmed after inspection.",
      ogImage: PLACEHOLDER_IMAGES.officeBuilding,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Pricing",
          heading: "Starting estimates only",
          subheading: "Contact for starting price until amounts are confirmed in the admin portal.",
          images: imgs("officeBuilding", "blueprint", "tools", "commercialMech", "torontoSkyline"),
          order: 0,
        }),
        section({
          key: "disclaimer",
          type: "notice",
          heading: "Pricing disclaimer",
          body: PRICING_DISCLAIMER,
          images: imgs("safetyGear"),
          order: 1,
        }),
        section({
          key: "pricing-grid",
          type: "pricing-grid",
          heading: "Service pricing",
          subheading: "Dynamic cards loaded from MongoDB pricing records.",
          images: imgs("electricalPanel", "hvacUnit", "plumbingTools"),
          order: 2,
        }),
        section({
          key: "offer",
          type: "offer-banner",
          heading: "5% OFF for Seniors, Veterans & First-Time Customers",
          body: "Ask about eligibility when you request service.",
          images: imgs("residentialHome"),
          order: 3,
        }),
        section({
          key: "cta",
          type: "cta",
          heading: "Ready for a clear quote?",
          body: "Request service and we will inspect, explain findings, and confirm pricing before approved work begins.",
          images: imgs("van"),
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          order: 4,
        }),
      ],
    },
    {
      title: "Blog",
      slug: "blog",
      seoTitle: "Blog | Premier Home Services Electrical, HVAC & Plumbing Tips",
      seoDescription:
        "Practical articles on electrical, HVAC, and plumbing emergencies and preventive maintenance for GTA property owners.",
      ogImage: PLACEHOLDER_IMAGES.lighting,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Blog",
          heading: "Guides for GTA property owners",
          subheading: "Responsible, general information — not DIY repair instructions.",
          images: imgs("lighting", "furnace", "pipes", "tools", "torontoSkyline"),
          order: 0,
        }),
        section({
          key: "featured",
          type: "blog-featured",
          heading: "Featured reading",
          images: imgs("electricalPanel"),
          order: 1,
        }),
        section({
          key: "listing",
          type: "blog-listing",
          heading: "Latest articles",
          body: "Filter by category or search topics across electrical, HVAC, plumbing, and maintenance.",
          images: imgs("hvacTech", "plumbingRepair"),
          order: 2,
        }),
        section({
          key: "cta",
          type: "cta",
          heading: "Need hands-on help?",
          body: "Articles educate — licensed technicians solve the problem. Request service anytime.",
          images: imgs("emergencyResponse"),
          ctaLabel: "Request Service",
          ctaUrl: "/request-service",
          order: 3,
        }),
      ],
    },
    {
      title: "Contact",
      slug: "contact",
      seoTitle: "Contact Premier Home Services | 437-256-1028 — Greater Toronto Area",
      seoDescription:
        "Contact Premier Home Services for electrical, HVAC, and plumbing service in the GTA. Phone 437-256-1028 · vnecconstruction@gmail.com · Emergency 24/7.",
      ogImage: PLACEHOLDER_IMAGES.van,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Contact",
          heading: "Talk with Premier Home Services",
          subheading: "Phone, email, or send a message — we serve the Greater Toronto Area.",
          images: imgs("van", "torontoSkyline", "officeBuilding", "nightCity", "teamWork"),
          ctaLabel: "Call 437-256-1028",
          ctaUrl: "tel:4372561028",
          order: 0,
        }),
        section({
          key: "details",
          type: "contact-details",
          heading: "Contact details",
          bullets: [
            "Phone: 437-256-1028",
            "Email: vnecconstruction@gmail.com",
            "Service area: Greater Toronto Area, Ontario",
            "Hours: Monday–Saturday 9:00 AM–5:00 PM",
            "Emergency services: 24/7",
          ],
          images: imgs("emergencyResponse"),
          order: 1,
        }),
        section({
          key: "form",
          type: "contact-form",
          heading: "Send a message",
          body: "Share your details and service needs. Inquiries are saved securely and can trigger email notifications when configured.",
          images: imgs("blueprint"),
          order: 2,
        }),
        section({
          key: "service-area",
          type: "service-area",
          heading: "Service area",
          body: "We serve residential and commercial properties across the Greater Toronto Area, Ontario.",
          images: imgs("torontoSkyline", "residentialHome"),
          order: 3,
        }),
        section({
          key: "faq",
          type: "faq",
          heading: "Contact FAQs",
          bullets: [
            "Q: What is the emergency number? A: Call 437-256-1028 anytime for emergencies.",
            "Q: What are regular hours? A: Monday–Saturday, 9:00 AM–5:00 PM for scheduled appointments.",
            "Q: Do you reply by email? A: Yes — reach us at vnecconstruction@gmail.com.",
          ],
          images: imgs("tools"),
          order: 4,
        }),
        section({
          key: "map",
          type: "map",
          heading: "Greater Toronto Area",
          body: "Map embed is configurable in site settings when available.",
          images: imgs("torontoSkyline"),
          order: 5,
        }),
      ],
    },
    {
      title: "Request Service",
      slug: "request-service",
      seoTitle: "Request Service | Premier Home Services — Electrical, HVAC & Plumbing",
      seoDescription:
        "Request electrical, HVAC, or plumbing service from Premier Home Services in the Greater Toronto Area. Emergency and scheduled options available.",
      ogImage: PLACEHOLDER_IMAGES.tools,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Request service",
          heading: "Tell us what you need",
          subheading:
            "Submit a multi-step request for residential or commercial electrical, HVAC, or plumbing help.",
          images: imgs("tools", "van", "electricalTech", "hvacTech", "plumbingRepair"),
          order: 0,
        }),
        section({
          key: "form",
          type: "request-form",
          heading: "Service request form",
          body: "Include customer type, service category, emergency status, preferred timing, location, and message. Consent is required.",
          images: imgs("blueprint"),
          order: 1,
        }),
        section({
          key: "what-to-expect",
          type: "process",
          heading: "What happens next",
          bullets: [
            "We review your request",
            "A team member follows up",
            "Inspection and clear pricing before approved work",
          ],
          images: imgs("teamWork"),
          order: 2,
        }),
        section({
          key: "emergency-note",
          type: "notice",
          heading: "Immediate danger?",
          body: "If there is fire, suspected gas leak, carbon monoxide danger, or flooding near electrical equipment, contact emergency services first.",
          images: imgs("safetyGear", "emergencyResponse"),
          order: 3,
        }),
        section({
          key: "cta",
          type: "cta",
          heading: "Prefer to call?",
          body: "Reach us at 437-256-1028 — emergency line available 24/7.",
          images: imgs("nightCity"),
          ctaLabel: "Call Now",
          ctaUrl: "tel:4372561028",
          order: 4,
        }),
      ],
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      seoTitle: "Privacy Policy | Premier Home Services",
      seoDescription:
        "How Premier Home Services collects and uses contact and service-request information for customers in the Greater Toronto Area.",
      ogImage: PLACEHOLDER_IMAGES.blueprint,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Legal",
          heading: "Privacy Policy",
          subheading: "How we handle information submitted through this website.",
          images: imgs("blueprint", "officeBuilding", "tools", "torontoSkyline", "safetyGear"),
          order: 0,
        }),
        section({
          key: "overview",
          type: "content",
          heading: "Overview",
          body: "Premier Home Services collects information you submit through contact and service-request forms — such as name, email, phone, property details, and message content — to respond to inquiries and schedule service. We do not sell your personal information.",
          images: imgs("blueprint"),
          order: 1,
        }),
        section({
          key: "use",
          type: "content",
          heading: "How we use information",
          bullets: [
            "Responding to service requests and questions",
            "Scheduling appointments and follow-ups",
            "Improving website operations and communication",
            "Complying with applicable legal obligations",
          ],
          images: imgs("tools"),
          order: 2,
        }),
        section({
          key: "retention",
          type: "content",
          heading: "Retention and security",
          body: "Inquiry records may be stored in our systems so we can serve you. We apply reasonable administrative and technical safeguards. No method of transmission or storage is completely secure.",
          images: imgs("safetyGear"),
          order: 3,
        }),
        section({
          key: "contact",
          type: "content",
          heading: "Questions",
          body: "For privacy questions, email vnecconstruction@gmail.com or call 437-256-1028.",
          images: imgs("van"),
          order: 4,
        }),
      ],
    },
    {
      title: "Terms and Conditions",
      slug: "terms-and-conditions",
      seoTitle: "Terms and Conditions | Premier Home Services",
      seoDescription:
        "Terms of use for the Premier Home Services website and general guidance regarding service requests in the Greater Toronto Area.",
      ogImage: PLACEHOLDER_IMAGES.commercialMech,
      sections: [
        section({
          key: "hero",
          type: "hero",
          eyebrow: "Legal",
          heading: "Terms and Conditions",
          subheading: "Website use and general service request terms.",
          images: imgs(
            "commercialMech",
            "blueprint",
            "officeBuilding",
            "tools",
            "torontoSkyline"
          ),
          order: 0,
        }),
        section({
          key: "website",
          type: "content",
          heading: "Website use",
          body: "Content on this website is provided for general information about Premier Home Services electrical, HVAC, and plumbing services in the Greater Toronto Area. Information may change and should not be treated as a binding quote until confirmed after inspection.",
          images: imgs("blueprint"),
          order: 1,
        }),
        section({
          key: "services",
          type: "content",
          heading: "Service requests",
          body: "Submitting a request does not guarantee appointment timing. Emergency dispatch depends on technician availability, location, and safety conditions. Final pricing is confirmed before approved work begins.",
          images: imgs("van"),
          order: 2,
        }),
        section({
          key: "safety",
          type: "content",
          heading: "Safety",
          body: "Website guidance is educational and not a substitute for emergency services. In immediate danger, call 911. Suspected gas leaks or carbon monoxide hazards require leaving the property and contacting the appropriate utility and emergency services.",
          images: imgs("safetyGear", "emergencyResponse"),
          order: 3,
        }),
        section({
          key: "contact",
          type: "content",
          heading: "Contact",
          body: "Questions about these terms: vnecconstruction@gmail.com · 437-256-1028.",
          images: imgs("torontoSkyline"),
          order: 4,
        }),
      ],
    },
  ];

  for (const page of pages) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      {
        title: page.title,
        slug: page.slug,
        status: "published",
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        ogImage: page.ogImage,
        sections: page.sections,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ Pages upserted: ${pages.length}`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local or pass via --env-file.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const dbName = mongoose.connection.name;
  console.log(`Connected. Database: ${dbName}`);

  await seedAdmin();
  await seedSettings();
  await seedServices();
  await seedPricing();
  await seedBlogCategories();
  await seedBlogPosts();
  await seedTestimonials();
  await seedPages();

  console.log("\n✅ Seed completed successfully");
  console.log(`   Database: ${dbName}`);
  console.log(`   URI host: ${mongoose.connection.host}`);
  console.log(`   Connection name: ${dbName}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
