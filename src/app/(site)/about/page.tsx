import type { Metadata } from "next";
import { CmsHero, CmsBodySections } from "@/components/cms/CmsPageSections";
import { getPageBySlug } from "@/lib/data";
import { visibleSections } from "@/lib/cms";
import type { Page } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about").catch(() => null);
  return {
    title: page?.seoTitle || "About Us",
    description:
      page?.seoDescription ||
      "Learn about Premier Home Services' mission to deliver licensed electrical, HVAC, and plumbing services across the Greater Toronto Area.",
  };
}

const FALLBACK_SECTIONS: Page["sections"] = [
  {
    key: "hero",
    type: "hero",
    eyebrow: "About Premier Home Services",
    heading: "Licensed trades. Clear communication. Lasting work.",
    subheading:
      "Our mission is to deliver fast, reliable, and professional electrical, HVAC, and plumbing services through licensed, certified, and highly skilled technicians.",
    visible: true,
    order: 0,
    images: [],
  },
  {
    key: "mission",
    type: "content",
    heading: "Our Mission",
    body: "We are committed to providing safe, code-compliant workmanship, transparent communication, and exceptional customer service, ensuring every home and business receives quality solutions they can trust.",
    visible: true,
    order: 1,
  },
];

export default async function AboutPage() {
  const page = await getPageBySlug("about").catch(() => null);
  const sections = visibleSections(page);
  const content = sections.length ? sections : FALLBACK_SECTIONS;
  const hero = content.find((s) => s.key === "hero") || content[0];

  return (
    <div>
      <CmsHero section={hero} crumbs={[{ label: "About Us" }]} />
      <CmsBodySections sections={content} skipKeys={[hero?.key || "hero"]} />
    </div>
  );
}
