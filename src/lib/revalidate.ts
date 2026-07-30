import { revalidatePath, revalidateTag } from "next/cache";

/** Immediate expiry so admin saves show on the next public request. */
function tag(name: string) {
  revalidateTag(name, { expire: 0 });
}

function refreshPublicSite() {
  revalidatePath("/", "layout");
}

export function revalidateSettings() {
  tag("settings");
  refreshPublicSite();
  revalidatePath("/contact");
  revalidatePath("/request-service");
  revalidatePath("/pricing");
}

export function revalidatePages(slug?: string) {
  tag("pages");
  refreshPublicSite();
  if (slug) {
    tag(`page:${slug}`);
    const path =
      slug === "home"
        ? "/"
        : slug.startsWith("/")
          ? slug
          : `/${slug}`;
    revalidatePath(path);
  } else {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/services");
    revalidatePath("/pricing");
    revalidatePath("/blog");
    revalidatePath("/request-service");
    revalidatePath("/privacy-policy");
    revalidatePath("/terms-and-conditions");
  }
}

export function revalidateServices(slug?: string) {
  tag("services");
  refreshPublicSite();
  revalidatePath("/services");
  revalidatePath("/");
  if (slug) {
    tag(`service:${slug}`);
    revalidatePath(`/services/${slug}`);
  }
}

export function revalidatePricing() {
  tag("pricing");
  refreshPublicSite();
  revalidatePath("/pricing");
  revalidatePath("/");
}

export function revalidateBlogs(slug?: string) {
  tag("blogs");
  refreshPublicSite();
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) {
    tag(`blog:${slug}`);
    revalidatePath(`/blog/${slug}`);
  }
}

export function revalidateTestimonials() {
  tag("testimonials");
  refreshPublicSite();
  revalidatePath("/");
}
