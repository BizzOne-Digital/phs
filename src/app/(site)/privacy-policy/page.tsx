import type { Metadata } from "next";
import { CmsHero, CmsBodySections } from "@/components/cms/CmsPageSections";
import { getPageBySlug } from "@/lib/data";
import { visibleSections, findSection } from "@/lib/cms";
import type { Page } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy-policy").catch(() => null);
  return {
    title: page?.seoTitle || "Privacy Policy",
    description:
      page?.seoDescription ||
      "How VNEC collects and uses contact and service-request information for customers in the Greater Toronto Area.",
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy").catch(() => null);
  const sections = visibleSections(page);
  const hero =
    findSection(page, "hero") ||
    ({
      key: "hero",
      type: "hero",
      eyebrow: "Legal",
      heading: page?.title || "Privacy Policy",
      subheading: page?.seoDescription || "How we handle information submitted through this website.",
      visible: true,
      order: 0,
    } satisfies Page["sections"][number]);

  const body = sections.filter((s) => s.key !== "hero");

  return (
    <div>
      <CmsHero section={hero} crumbs={[{ label: "Privacy Policy" }]} />
      {body.length ? (
        <CmsBodySections sections={body} skipKeys={[]} />
      ) : (
        <CmsBodySections
          sections={[
            {
              key: "overview",
              type: "content",
              heading: "Overview",
              body: "VNEC collects information you submit through contact and service-request forms to respond to inquiries and schedule service. We do not sell your personal information.",
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
