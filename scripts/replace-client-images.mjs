/**
 * Replace /public/images/*.webp with new client JPGs from Cursor assets.
 * Run: node scripts/replace-client-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images");
const ASSETS_DIR =
  process.env.CLIENT_ASSETS_DIR ||
  path.join(
    process.env.USERPROFILE || "",
    ".cursor",
    "projects",
    "e-2sri-nokri-phs-main-phs-main",
    "assets"
  );

/** @type {Record<number, string>} */
const NUM_TO_KEY = {
  1: "plumbing",
  2: "electrical_panel",
  3: "electrical_panel2",
  4: "recessed_light",
  5: "hvac_filter",
  6: "plumbing_ptrap",
  7: "emergency_breaker",
  8: "van_phs",
  9: "hvac_filter2",
  10: "tools_bench",
  11: "tool_roll",
  12: "safety",
  13: "blueprint",
  14: "house",
  15: "mechanical_room",
  16: "tablet_plan",
  17: "skyline",
  18: "outlet_tester",
  19: "thermostat",
  20: "handshake",
  21: "hvac_tag",
  22: "junction_box",
  23: "dimmer",
  24: "hvac_manifold",
};

function findAssetByNum(num) {
  const token = `image__${num}_`;
  const altToken =
    num === 24
      ? "image-932a8bf3"
      : num === 20
        ? "image-296cf024"
        : null;
  const files = fs.readdirSync(ASSETS_DIR);
  const hit = files.find(
    (f) =>
      (altToken && f.includes(altToken)) || f.includes(token)
  );
  if (!hit) throw new Error(`Missing asset for image #${num} in ${ASSETS_DIR}`);
  return path.join(ASSETS_DIR, hit);
}

/** @type {Record<string, number>} */
const EXPLICIT = {
  "home-hero-bg.webp": 14,
  "home-hero-electrical.webp": 2,
  "home-hero-hvac.webp": 24,
  "home-hero-plumbing.webp": 1,
  "home-core-electrical.webp": 4,
  "home-core-hvac.webp": 5,
  "home-core-plumbing.webp": 6,
  "home-emergency-main.webp": 7,
  "home-emergency-van.webp": 8,
  "home-about-main.webp": 20,
  "home-about-tools.webp": 11,
  "home-about-safety.webp": 12,
  "home-process.webp": 13,
  "home-areas-skyline.webp": 17,
  "home-areas-office.webp": 15,
  "home-cta-home.webp": 14,
  "about-hero-1.webp": 16,
  "about-hero-2.webp": 18,
  "about-hero-3.webp": 19,
  "about-mission-1.webp": 20,
  "about-mission-2.webp": 21,
  "about-what-electrical.webp": 22,
  "about-what-hvac.webp": 24,
  "about-what-plumbing.webp": 1,
  "about-story-home.webp": 14,
  "about-story-commercial.webp": 15,
  "about-safety.webp": 12,
  "about-cap-residential.webp": 14,
  "about-cap-commercial.webp": 15,
  "about-work-1.webp": 22,
  "about-work-2.webp": 4,
  "about-values.webp": 23,
  "about-process.webp": 13,
  "about-cta.webp": 8,
  "contact-van.webp": 8,
  "contact-hero.webp": 20,
  "contact-emergency.webp": 7,
  "contact-office.webp": 17,
  "contact-map-fallback.webp": 17,
};

function pickSourceNum(filename) {
  if (EXPLICIT[filename]) return EXPLICIT[filename];
  const f = filename.toLowerCase();
  if (f.includes("van") || f.endsWith("-cta.webp")) return 8;
  if (f.includes("skyline") || f.includes("areas-skyline") || f.includes("map-fallback"))
    return 17;
  if (f.includes("office") || f.includes("commercial") || f.includes("-com.webp"))
    return 15;
  if (
    f.includes("home-cta") ||
    f.includes("story-home") ||
    f.includes("-res.webp") ||
    f.includes("residential")
  )
    return 14;
  if (f.includes("emergency") || f.includes("em-")) {
    if (f.includes("plumb")) return 6;
    if (f.includes("hvac")) return 24;
    if (f.includes("elec")) return 7;
    return 7;
  }
  if (f.includes("plumb")) return f.includes("hero") || f.includes("card") ? 1 : 6;
  if (f.includes("hvac") || f.includes("furnace") || f.includes("thermostat")) return 24;
  if (f.includes("elec") || f.includes("electrical") || f.includes("wiring")) return 2;
  if (f.includes("blog-hero-3") || f.includes("pipes")) return 6;
  if (f.includes("privacy") || f.includes("terms")) return 20;
  if (f.includes("request")) return 10;
  if (f.includes("pricing")) return 10;
  if (f.includes("blog")) return 13;
  if (f.includes("services-hero")) return 11;
  if (f.includes("safety")) return 12;
  if (f.includes("process") || f.includes("blueprint")) return 13;
  if (f.includes("tools") || f.includes("about-main")) return 10;
  return 11;
}

function collectTargetFilenames() {
  const siteImagesPath = path.join(ROOT, "src", "lib", "site-images.ts");
  const text = fs.readFileSync(siteImagesPath, "utf8");
  const re = /I\("([^"]+\.webp)"\)/g;
  const names = new Set();
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return [...names].sort();
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error("Assets folder not found:", ASSETS_DIR);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sources = {};
  for (const num of Object.keys(NUM_TO_KEY).map(Number)) {
    sources[num] = findAssetByNum(num);
    console.log(`#${num} →`, path.basename(sources[num]));
  }

  const targets = collectTargetFilenames();
  console.log(`\nWriting ${targets.length} webp files to public/images/\n`);

  for (const name of targets) {
    const num = pickSourceNum(name);
    const src = sources[num];
    const dest = path.join(OUT_DIR, name);
    await sharp(src)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toFile(dest);
  }

  console.log("Done. All site image slots updated from new client photos.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
