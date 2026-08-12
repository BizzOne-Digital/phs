import type { Page, PageSection } from "@/types";
import { resolveCmsImage, resolveCmsImages } from "@/lib/upload/resolve";

export function visibleSections(page: Page | null | undefined): PageSection[] {
  if (!page?.sections?.length) return [];
  return [...page.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function findSection(
  page: Page | null | undefined,
  key: string
): PageSection | undefined {
  return visibleSections(page).find((s) => s.key === key);
}

export function sectionText(
  section: PageSection | undefined,
  field: "eyebrow" | "heading" | "subheading" | "body" | "ctaLabel" | "ctaUrl",
  fallback: string
): string {
  const value = section?.[field];
  return typeof value === "string" && value.trim() ? value : fallback;
}

/** Resolved CMS image URL at index with static fallback. */
export function sectionImageUrl(
  section: PageSection | undefined,
  index: number,
  fallback: string
): string {
  return resolveCmsImage(section?.images?.[index]?.url, fallback);
}

export function sectionImageAlt(
  section: PageSection | undefined,
  index: number,
  fallback = ""
): string {
  const alt = section?.images?.[index]?.alt;
  return typeof alt === "string" && alt.trim() ? alt : fallback;
}

export function sectionImageList(
  section: PageSection | undefined,
  fallbacks: string[] = []
) {
  const cms = resolveCmsImages(section?.images);
  if (cms.length) return cms;
  return fallbacks.map((url) => ({ url, alt: "" }));
}
