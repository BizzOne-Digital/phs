import type { Metadata } from "next";
import { CmsHero, CmsBodySections } from "@/components/cms/CmsPageSections";
import { getPageBySlug } from "@/lib/data";
import { visibleSections, findSection } from "@/lib/cms";
import type { Page } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms-and-conditions").catch(() => null);
  return {
    title: page?.seoTitle || "Terms and Conditions",
    description:
      page?.seoDescription ||
      "Terms of use for the Premier Home Services website and general guidance regarding service requests in the Greater Toronto Area.",
  };
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms-and-conditions").catch(() => null);
  const sections = visibleSections(page);
  const hero =
    findSection(page, "hero") ||
    ({
      key: "hero",
      type: "hero",
      eyebrow: "Legal",
      heading: page?.title || "Terms and Conditions",
      subheading: page?.seoDescription || "Website use and general service request terms.",
      visible: true,
      order: 0,
    } satisfies Page["sections"][number]);

  const body = sections.filter((s) => s.key !== "hero");

  return (
    <div>
      <CmsHero section={hero} crumbs={[{ label: "Terms and Conditions" }]} />
      {body.length ? (
        <CmsBodySections sections={body} skipKeys={[]} />
      ) : (
        <CmsBodySections
          sections={[
            {
              key: "website-use",
              type: "content",
              heading: "Website use",
              body: "Content on this website is provided for general information about Premier Home Services electrical, HVAC, and plumbing services in the Greater Toronto Area.",
              visible: true,
              order: 1,
            },
          ]}
          skipKeys={[]}
        />
      )}
    </div>
  );
}
