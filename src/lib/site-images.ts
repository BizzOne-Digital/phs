/**
 * Local images in /public/images — page-specific assets generated for Premier Home Services.
 * Missing files fall back to a nearby existing image.
 */
const I = (file: string) => `/images/${file}`;

export const SITE_IMAGES = {
  home: {
    heroBg: I("home-hero-bg.webp"),
    heroElectrical: I("home-hero-electrical.webp"),
    heroHvac: I("home-hero-hvac.webp"),
    heroPlumbing: I("home-hero-plumbing.webp"),
    coreElectrical: I("home-core-electrical.webp"),
    coreHvac: I("home-core-hvac.webp"),
    corePlumbing: I("home-core-plumbing.webp"),
    emergencyMain: I("home-emergency-main.webp"),
    emergencyVan: I("home-emergency-van.webp"),
    aboutMain: I("home-about-main.webp"),
    aboutTools: I("home-about-tools.webp"),
    aboutSafety: I("home-about-safety.webp"),
    process: I("home-process.webp"),
    areasSkyline: I("home-areas-skyline.webp"),
    areasOffice: I("home-areas-office.webp"),
    ctaHome: I("home-cta-home.webp"),
  },
  about: {
    hero: [I("about-hero-1.webp"), I("about-hero-2.webp"), I("about-hero-3.webp")],
    mission: [I("about-mission-1.webp"), I("about-mission-2.webp")],
    whatWeDo: [I("about-what-electrical.webp"), I("about-what-hvac.webp"), I("about-what-plumbing.webp")],
    story: [I("about-story-home.webp"), I("about-story-commercial.webp")],
    safety: [I("about-safety.webp")],
    capabilities: [I("about-cap-residential.webp"), I("about-cap-commercial.webp")],
    workmanship: [I("about-work-1.webp"), I("about-work-2.webp")],
    values: [I("about-values.webp")],
    process: [I("about-process.webp")],
    cta: [I("about-cta.webp")],
  },
  servicesIndex: {
    hero: [
      I("services-hero-1.webp"),
      I("services-hero-2.webp"),
      I("services-hero-3.webp"),
      I("services-hero-4.webp"),
      I("services-hero-5.webp"),
    ],
    cards: {
      "24-7-emergency-electrical-services": I("services-card-em-electrical.webp"),
      "electrical-services": I("services-card-electrical.webp"),
      "24-7-emergency-hvac-services": I("services-card-em-hvac.webp"),
      "hvac-services": I("services-card-hvac.webp"),
      "24-7-emergency-plumbing-services": I("services-card-em-plumbing.webp"),
      "plumbing-services": I("services-card-plumbing.webp"),
    } as Record<string, string>,
  },
  services: {
    "24-7-emergency-electrical-services": {
      hero: I("svc-em-elec-hero.webp"),
      gallery: [I("svc-em-elec-g1.webp"), I("svc-em-elec-g2.webp"), I("svc-em-elec-g3.webp")],
      residential: I("svc-em-elec-res.webp"),
      commercial: I("svc-em-elec-com.webp"),
      cta: I("svc-em-elec-cta.webp"),
    },
    "electrical-services": {
      hero: I("svc-elec-hero.webp"),
      gallery: [I("svc-elec-g1.webp"), I("svc-elec-g2.webp"), I("svc-elec-g3.webp")],
      residential: I("svc-elec-res.webp"),
      commercial: I("svc-elec-com.webp"),
      cta: I("svc-elec-cta.webp"),
    },
    "24-7-emergency-hvac-services": {
      hero: I("svc-em-hvac-hero.webp"),
      gallery: [I("svc-em-hvac-g1.webp"), I("svc-em-hvac-g2.webp"), I("svc-em-hvac-g3.webp")],
      residential: I("svc-em-hvac-res.webp"),
      commercial: I("svc-em-hvac-com.webp"),
      cta: I("svc-em-hvac-cta.webp"),
    },
    "hvac-services": {
      hero: I("svc-hvac-hero.webp"),
      gallery: [I("svc-hvac-g1.webp"), I("svc-hvac-g2.webp"), I("svc-hvac-g3.webp")],
      residential: I("svc-hvac-res.webp"),
      commercial: I("svc-hvac-com.webp"),
      cta: I("svc-hvac-cta.webp"),
    },
    "24-7-emergency-plumbing-services": {
      hero: I("svc-em-plumb-hero.webp"),
      gallery: [I("svc-em-plumb-g1.webp"), I("svc-em-plumb-g2.webp"), I("svc-em-plumb-g3.webp")],
      residential: I("svc-em-plumb-res.webp"),
      commercial: I("svc-em-plumb-com.webp"),
      cta: I("svc-em-plumb-cta.webp"),
    },
    "plumbing-services": {
      hero: I("svc-plumb-hero.webp"),
      gallery: [I("svc-plumb-g1.webp"), I("svc-plumb-g2.webp"), I("svc-plumb-g3.webp")],
      residential: I("svc-plumb-res.webp"),
      commercial: I("svc-plumb-com.webp"),
      cta: I("svc-plumb-cta.webp"),
    },
  } as Record<
    string,
    { hero: string; gallery: string[]; residential: string; commercial: string; cta: string }
  >,
  pricing: {
    hero: [I("pricing-hero-1.webp"), I("pricing-hero-2.webp"), I("pricing-hero-3.webp")],
    gallery: [I("pricing-gal-electrical.webp"), I("pricing-gal-hvac.webp"), I("pricing-gal-plumbing.webp")],
  },
  blog: {
    hero: [I("blog-hero-1.webp"), I("blog-hero-2.webp"), I("blog-hero-3.webp")],
    footer: [I("blog-footer-1.webp"), I("blog-footer-2.webp")],
    featured: {
      "signs-you-may-need-an-emergency-electrician": I("blog-feat-electrical.webp"),
      "when-to-call-for-emergency-hvac-service": I("blog-feat-hvac.webp"),
      "how-to-reduce-damage-during-a-plumbing-emergency": I("blog-feat-plumbing.webp"),
      "preventive-maintenance-tips-for-gta-property-owners": I("blog-feat-maintenance.webp"),
    } as Record<string, string>,
    inline: {
      "signs-you-may-need-an-emergency-electrician": [
        I("blog-em-elec-1.webp"),
        I("blog-em-elec-2.webp"),
        I("blog-em-elec-3.webp"),
      ],
      "when-to-call-for-emergency-hvac-service": [
        I("blog-em-hvac-1.webp"),
        I("blog-em-hvac-2.webp"),
        I("blog-em-hvac-3.webp"),
      ],
      "how-to-reduce-damage-during-a-plumbing-emergency": [
        I("blog-em-plumb-1.webp"),
        I("blog-em-plumb-2.webp"),
        I("blog-em-plumb-3.webp"),
      ],
      "preventive-maintenance-tips-for-gta-property-owners": [
        I("blog-maint-1.webp"),
        I("blog-maint-2.webp"),
        I("blog-maint-3.webp"),
      ],
    } as Record<string, string[]>,
    detailCta: I("about-cta.webp"),
  },
  contact: {
    hero: I("contact-hero.webp"),
    van: I("contact-van.webp"),
    emergency: I("contact-emergency.webp"),
    office: I("contact-office.webp"),
    mapFallback: I("contact-map-fallback.webp"),
  },
  request: {
    hero: [I("request-hero-1.webp"), I("request-hero-2.webp"), I("request-hero-3.webp")],
    gallery: [I("request-gal-1.webp"), I("request-gal-2.webp"), I("request-gal-3.webp")],
  },
  privacy: {
    hero: [
      I("privacy-hero-1.webp"),
      I("privacy-hero-2.webp"),
      I("privacy-hero-3.webp"),
      I("privacy-hero-4.webp"),
    ],
    overview: I("privacy-overview.webp"),
    use: I("privacy-use.webp"),
    retention: I("privacy-retention.webp"),
    contact: I("terms-contact.webp"), // privacy-contact.webp missing
  },
  terms: {
    hero: [
      I("terms-hero-1.webp"),
      I("terms-hero-2.webp"),
      I("terms-hero-3.webp"),
      I("terms-hero-4.webp"),
    ],
    website: I("terms-website.webp"),
    services: I("terms-services.webp"),
    safety: [I("terms-safety-1.webp"), I("terms-safety-2.webp")],
    contact: I("terms-contact.webp"),
  },
} as const;

export function localImage(url: string, alt: string) {
  return { url, alt };
}

export function localImages(urls: string[], alts: string[]) {
  return urls.map((url, i) => ({ url, alt: alts[i] || alts[0] || "Premier Home Services" }));
}
