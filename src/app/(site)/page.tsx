import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrustMarquee } from "@/components/home/HomeTrustMarquee";
import { HomeCoreServices } from "@/components/home/HomeCoreServices";
import { HomeEmergencyFeature } from "@/components/home/HomeEmergencyFeature";
import { HomeAboutPreview } from "@/components/home/HomeAboutPreview";
import { HomeWhyChooseUs } from "@/components/home/HomeWhyChooseUs";
import { HomeProcessTimeline } from "@/components/home/HomeProcessTimeline";
import { HomePricingPreview } from "@/components/home/HomePricingPreview";
import { HomeSpecialOffer } from "@/components/home/HomeSpecialOffer";
import { HomeServiceAreas } from "@/components/home/HomeServiceAreas";
import { HomeTestimonialsCarousel } from "@/components/home/HomeTestimonialsCarousel";
import { HomeBlogPreview } from "@/components/home/HomeBlogPreview";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import {
  getSettings,
  getServices,
  getPricingItems,
  getPublishedBlogs,
  getTestimonials,
  getPageBySlug,
} from "@/lib/data";
import {
  FALLBACK_SETTINGS,
  FALLBACK_SERVICES,
  FALLBACK_PRICING,
  FALLBACK_TESTIMONIALS,
  FALLBACK_BLOGS,
  BUSINESS,
  withFallback,
} from "@/lib/constants";
import { findSection, sectionText } from "@/lib/cms";
import { resolveCmsImage } from "@/lib/upload/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home").catch(() => null);
  return {
    title: page?.seoTitle || "Licensed Electrical, HVAC & Plumbing Experts | Premier Home Services",
    description:
      page?.seoDescription ||
      "Your trusted licensed Electrical, HVAC & Plumbing experts serving the Greater Toronto Area. Scheduled appointments and 24/7 emergency support.",
  };
}

export default async function HomePage() {
  const [settings, services, pricing, testimonials, blogs, homePage] = await Promise.all([
    withFallback(getSettings, FALLBACK_SETTINGS),
    withFallback(async () => getServices({ activeOnly: true }), FALLBACK_SERVICES),
    withFallback(getPricingItems, FALLBACK_PRICING),
    withFallback(getTestimonials, FALLBACK_TESTIMONIALS),
    withFallback(async () => {
      const { posts } = await getPublishedBlogs(3, 0);
      return posts;
    }, FALLBACK_BLOGS),
    getPageBySlug("home").catch(() => null),
  ]);

  const serviceList = services.length ? services : FALLBACK_SERVICES;
  const pricingList = pricing.length ? pricing : FALLBACK_PRICING;
  const testimonialList = testimonials.length ? testimonials : FALLBACK_TESTIMONIALS;
  const blogList = blogs.length ? blogs : FALLBACK_BLOGS;

  const hero = findSection(homePage, "hero");
  const about = findSection(homePage, "about-preview");

  return (
    <>
      <HomeHero
        phone={settings.phone}
        emergencyPhone={settings.emergencyPhone || settings.phone}
        serviceArea={settings.serviceArea}
        emergencyAvailability={settings.emergencyAvailability}
        eyebrow={sectionText(hero, "eyebrow", "Premier Home Services")}
        headline={sectionText(hero, "heading", BUSINESS.headline)}
        description={sectionText(
          hero,
          "subheading",
          "Fast, reliable electrical, HVAC, and plumbing support for homes and businesses across the Greater Toronto Area—scheduled appointments and 24/7 emergency response."
        )}
      />
      <HomeTrustMarquee />
      <HomeCoreServices services={serviceList} />
      <HomeEmergencyFeature
        services={serviceList}
        phone={settings.emergencyPhone || settings.phone}
      />
      <HomeAboutPreview
        eyebrow={sectionText(about, "eyebrow", "About Premier Home Services")}
        title={sectionText(
          about,
          "heading",
          "Built around reliability, safety, and clear communication"
        )}
        description={sectionText(
          about,
          "body",
          "Our mission is to deliver fast, reliable, and professional electrical, HVAC, and plumbing services through licensed, skilled technicians—with transparent communication and workmanship you can trust."
        )}
        ctaLabel={sectionText(about, "ctaLabel", "Learn more about us")}
        ctaUrl={sectionText(about, "ctaUrl", "/about")}
        imageUrl={about?.images?.[0]?.url ? resolveCmsImage(about.images[0].url) : undefined}
        imageAlt={about?.images?.[0]?.alt}
      />
      <HomeWhyChooseUs />
      <HomeProcessTimeline />
      <HomePricingPreview
        items={pricingList}
        disclaimer={settings.pricingDisclaimer || BUSINESS.pricingDisclaimer}
      />
      <HomeSpecialOffer
        text={settings.specialOfferText}
        active={settings.specialOfferActive}
      />
      <HomeServiceAreas serviceArea={settings.serviceArea} />
      <HomeTestimonialsCarousel testimonials={testimonialList} />
      <HomeBlogPreview posts={blogList} />
      <HomeFinalCta
        phone={settings.emergencyPhone || settings.phone}
        email={settings.email}
        emergencyAvailability={settings.emergencyAvailability}
      />
    </>
  );
}
