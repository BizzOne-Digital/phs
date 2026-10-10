/**
 * Copy gallery WebPs from public/PHS-Service-Photos → public/images.
 * Filenames must match site-images.ts (svc-*-g1|g2|g3.webp).
 * Run: npm run sync:service-photos
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public", "PHS-Service-Photos");
const DEST = path.join(ROOT, "public", "images");

const EXPECTED = [
  "svc-em-elec-g1.webp",
  "svc-em-elec-g2.webp",
  "svc-em-elec-g3.webp",
  "svc-elec-g1.webp",
  "svc-elec-g2.webp",
  "svc-elec-g3.webp",
  "svc-em-hvac-g1.webp",
  "svc-em-hvac-g2.webp",
  "svc-em-hvac-g3.webp",
  "svc-hvac-g1.webp",
  "svc-hvac-g2.webp",
  "svc-hvac-g3.webp",
  "svc-em-plumb-g1.webp",
  "svc-em-plumb-g2.webp",
  "svc-em-plumb-g3.webp",
  "svc-plumb-g1.webp",
  "svc-plumb-g2.webp",
  "svc-plumb-g3.webp",
];

if (!fs.existsSync(SRC)) {
  console.error("Missing folder:", SRC);
  process.exit(1);
}

let copied = 0;
for (const name of EXPECTED) {
  const from = path.join(SRC, name);
  if (!fs.existsSync(from)) {
    console.warn("Skip (not found):", name);
    continue;
  }
  fs.copyFileSync(from, path.join(DEST, name));
  copied++;
}

const REQUEST_MAP = {
  "request-hero-1.webp": "svc-elec-g1.webp",
  "request-hero-2.webp": "svc-hvac-g2.webp",
  "request-hero-3.webp": "svc-plumb-g2.webp",
  "request-gal-1.webp": "svc-em-elec-g2.webp",
  "request-gal-2.webp": "svc-em-hvac-g1.webp",
  "request-gal-3.webp": "svc-em-plumb-g3.webp",
};

for (const [dest, src] of Object.entries(REQUEST_MAP)) {
  const from = path.join(DEST, src);
  if (!fs.existsSync(from)) {
    console.warn("Skip request image (missing source):", src);
    continue;
  }
  fs.copyFileSync(from, path.join(DEST, dest));
}

const BLOG_MAP = {
  "blog-hero-1.webp": "svc-elec-g3.webp",
  "blog-hero-2.webp": "svc-hvac-g1.webp",
  "blog-hero-3.webp": "svc-plumb-g1.webp",
  "blog-footer-1.webp": "home-areas-skyline.webp",
  "blog-footer-2.webp": "home-emergency-van.webp",
  "blog-feat-electrical.webp": "svc-em-elec-g1.webp",
  "blog-feat-hvac.webp": "svc-em-hvac-g2.webp",
  "blog-feat-plumbing.webp": "svc-em-plumb-g2.webp",
  "blog-feat-maintenance.webp": "svc-hvac-g3.webp",
};

for (const [dest, src] of Object.entries(BLOG_MAP)) {
  const from = path.join(DEST, src);
  if (!fs.existsSync(from)) {
    console.warn("Skip blog image (missing source):", src);
    continue;
  }
  fs.copyFileSync(from, path.join(DEST, dest));
}

console.log(`Copied ${copied}/${EXPECTED.length} service gallery images to public/images/`);
console.log("Updated request-service and blog listing images from service photos.");
