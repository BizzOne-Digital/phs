/**
 * Maps CMS / service / blog documents to local /public/images assets.
 * Run: npx tsx --env-file=.env.local scripts/apply-local-images.ts
 */
import { connectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import { Service } from "../src/models/Service";
import { BlogPost } from "../src/models/BlogPost";
import { SITE_IMAGES, localImage, localImages } from "../src/lib/site-images";

function setSectionImages(
  sections: Array<Record<string, unknown>>,
  key: string,
  urls: string[],
  alt: string
) {
  const section = sections.find((s) => s.key === key);
  if (!section) return;
  section.images = localImages(urls, urls.map(() => alt));
}

async function main() {
  await connectDB();

  // About page
  const about = await Page.findOne({ slug: "about" });
  if (about?.sections) {
    const sections = about.sections as unknown as Array<Record<string, unknown>>;
    setSectionImages(sections, "hero", [...SITE_IMAGES.about.hero], "About Premier Home Services");
    setSectionImages(sections, "mission", [...SITE_IMAGES.about.mission], "Our mission");
    setSectionImages(sections, "what-we-do", [...SITE_IMAGES.about.whatWeDo], "What we do");
    setSectionImages(sections, "story", [...SITE_IMAGES.about.story], "Our story");
    setSectionImages(sections, "safety", [...SITE_IMAGES.about.safety], "Safety");
    setSectionImages(sections, "capabilities", [...SITE_IMAGES.about.capabilities], "Capabilities");
    setSectionImages(sections, "workmanship", [...SITE_IMAGES.about.workmanship], "Workmanship");
    setSectionImages(sections, "values", [...SITE_IMAGES.about.values], "Values");
    setSectionImages(sections, "process", [...SITE_IMAGES.about.process], "Process");
    setSectionImages(sections, "cta", [...SITE_IMAGES.about.cta], "Get in touch");
    about.markModified("sections");
    about.ogImage = SITE_IMAGES.about.hero[0];
    await about.save();
    console.log("✓ about page images");
  }

  // Privacy
  const privacy = await Page.findOne({ slug: "privacy-policy" });
  if (privacy?.sections) {
    const sections = privacy.sections as unknown as Array<Record<string, unknown>>;
    setSectionImages(sections, "hero", [...SITE_IMAGES.privacy.hero], "Privacy Policy");
    setSectionImages(sections, "overview", [SITE_IMAGES.privacy.overview], "Overview");
    // Seed keys may differ — update by type/order fallbacks
    for (const section of sections) {
      if (section.key === "use" || section.heading === "How we use information") {
        section.images = [localImage(SITE_IMAGES.privacy.use, "How we use information")];
      }
      if (section.key === "retention" || String(section.heading || "").includes("Retention")) {
        section.images = [localImage(SITE_IMAGES.privacy.retention, "Retention")];
      }
      if (section.key === "contact" || section.key === "questions" || String(section.heading || "").includes("Questions")) {
        section.images = [localImage(SITE_IMAGES.privacy.contact, "Contact")];
      }
    }
    privacy.markModified("sections");
    privacy.ogImage = SITE_IMAGES.privacy.hero[0];
    await privacy.save();
    console.log("✓ privacy-policy page images");
  }

  // Terms
  const terms = await Page.findOne({ slug: "terms-and-conditions" });
  if (terms?.sections) {
    const sections = terms.sections as unknown as Array<Record<string, unknown>>;
    setSectionImages(sections, "hero", [...SITE_IMAGES.terms.hero], "Terms");
    for (const section of sections) {
      const heading = String(section.heading || "").toLowerCase();
      if (section.key === "website" || heading.includes("website")) {
        section.images = [localImage(SITE_IMAGES.terms.website, "Website use")];
      }
      if (section.key === "services" || heading.includes("service request")) {
        section.images = [localImage(SITE_IMAGES.terms.services, "Service requests")];
      }
      if (section.key === "safety" || heading.includes("safety")) {
        section.images = localImages([...SITE_IMAGES.terms.safety], ["Safety", "Emergency guidance"]);
      }
      if (section.key === "contact" || heading === "contact") {
        section.images = [localImage(SITE_IMAGES.terms.contact, "Contact")];
      }
    }
    terms.markModified("sections");
    terms.ogImage = SITE_IMAGES.terms.hero[0];
    await terms.save();
    console.log("✓ terms-and-conditions page images");
  }

  // Home about-preview image
  const home = await Page.findOne({ slug: "home" });
  if (home?.sections) {
    const sections = home.sections as unknown as Array<Record<string, unknown>>;
    setSectionImages(
      sections,
      "about-preview",
      [SITE_IMAGES.home.aboutMain, SITE_IMAGES.home.process],
      "About Premier Home Services"
    );
    home.markModified("sections");
    home.ogImage = SITE_IMAGES.home.areasSkyline;
    await home.save();
    console.log("✓ home page CMS images");
  }

  // Services
  for (const [slug, pack] of Object.entries(SITE_IMAGES.services)) {
    const service = await Service.findOne({ slug });
    if (!service) continue;
    service.heroImage = localImage(pack.hero, service.name);
    service.gallery = pack.gallery.map((url, i) =>
      localImage(url, `${service.name} gallery ${i + 1}`)
    );
    await service.save();
    console.log(`✓ service ${slug}`);
  }

  // Blogs
  for (const [slug, featured] of Object.entries(SITE_IMAGES.blog.featured)) {
    const post = await BlogPost.findOne({ slug });
    if (!post) continue;
    post.featuredImage = localImage(featured, post.title);
    const inline = SITE_IMAGES.blog.inline[slug] || [];
    post.inlineImages = inline.map((url, i) => localImage(url, `${post.title} ${i + 1}`));
    post.ogImage = featured;
    await post.save();
    console.log(`✓ blog ${slug}`);
  }

  console.log("Done applying local images.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
