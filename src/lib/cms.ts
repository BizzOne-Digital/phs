import type { Page, PageSection } from "@/types";

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
