import { PLACEHOLDER_IMAGES } from "@/lib/placeholders";

const DEFAULT_FALLBACK = PLACEHOLDER_IMAGES.tools;

/**
 * Resolve CMS / product image URLs for storefront rendering.
 * - `/api/uploads/...` → MongoDB-backed uploads (keep)
 * - `/images/...` → local public assets (keep)
 * - legacy `/uploads/...` disk paths → safe fallback (broken on Vercel)
 * - empty / missing → fallback
 * - remote URLs (Unsplash, Cloudinary) → as-is
 */
export function resolveCmsImage(
  url?: string | null,
  fallback: string = DEFAULT_FALLBACK
): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/api/uploads/")) return trimmed;
  if (trimmed.startsWith("/images/")) return trimmed;
  if (trimmed.startsWith("/logo") || trimmed.startsWith("/favicon")) return trimmed;
  if (trimmed.startsWith("/uploads/")) return fallback;
  // Migrate leftover Unsplash placeholders to local fallback
  if (trimmed.includes("images.unsplash.com")) return fallback;
  return trimmed;
}

export function resolveCmsImages(
  images: Array<{ url?: string; alt?: string } | null | undefined> | undefined,
  fallback: string = DEFAULT_FALLBACK
): Array<{ url: string; alt: string }> {
  if (!images?.length) return [];
  return images
    .filter((img): img is { url?: string; alt?: string } => Boolean(img))
    .map((img) => ({
      url: resolveCmsImage(img.url, fallback),
      alt: img.alt || "",
    }))
    .filter((img) => Boolean(img.url));
}
