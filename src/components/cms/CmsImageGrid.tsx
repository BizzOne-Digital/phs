import Image from "next/image";
import { Reveal, StaggerItem } from "@/components/animations/Reveal";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { cn } from "@/lib/utils";

export function CmsImageGrid({
  images,
  fallbacks = [],
  alts = [],
  className,
  layout = "hero",
}: {
  images?: Array<{ url?: string; alt?: string }>;
  fallbacks?: string[];
  alts?: string[];
  className?: string;
  layout?: "hero" | "gallery" | "contact" | "single";
}) {
  const resolved = (images || [])
    .map((img, i) => ({
      url: resolveCmsImage(img?.url, fallbacks[i]),
      alt: img?.alt || alts[i] || "",
    }))
    .filter((img) => img.url);

  const list =
    resolved.length > 0
      ? resolved
      : fallbacks.map((url, i) => ({ url: resolveCmsImage(url), alt: alts[i] || "" }));

  if (!list.length) return null;

  if (layout === "single" || list.length === 1) {
    const img = list[0];
    return (
      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-3xl", className)}>
        <Image
          src={img.url}
          alt={img.alt}
          fill
          unoptimized={img.url.startsWith("/api/uploads/")}
          className="object-cover"
          sizes="50vw"
        />
      </div>
    );
  }

  if (layout === "contact") {
    return (
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {list[0] ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={list[0].url} alt={list[0].alt} fill unoptimized={list[0].url.startsWith("/api/uploads/")} className="object-cover" sizes="20vw" />
          </div>
        ) : null}
        {list[1] ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={list[1].url} alt={list[1].alt} fill unoptimized={list[1].url.startsWith("/api/uploads/")} className="object-cover" sizes="20vw" />
          </div>
        ) : null}
        {list[2] ? (
          <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl">
            <Image src={list[2].url} alt={list[2].alt} fill unoptimized={list[2].url.startsWith("/api/uploads/")} className="object-cover" sizes="40vw" />
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "gallery") {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2", className)}>
        {list.slice(0, 2).map((img, i) => (
          <Reveal key={img.url + i} direction={i === 0 ? "left" : "right"} delay={i * 0.1}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={img.url} alt={img.alt} fill unoptimized={img.url.startsWith("/api/uploads/")} className="object-cover" sizes="50vw" />
            </div>
          </Reveal>
        ))}
        {list[2] ? (
          <Reveal direction="up" delay={0.15} className="md:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl md:aspect-[21/9]">
              <Image src={list[2].url} alt={list[2].alt} fill unoptimized={list[2].url.startsWith("/api/uploads/")} className="object-cover" sizes="100vw" />
            </div>
          </Reveal>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {list[0] ? (
        <StaggerItem delay={0} direction="up">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={list[0].url} alt={list[0].alt} fill unoptimized={list[0].url.startsWith("/api/uploads/")} className="object-cover" sizes="25vw" />
          </div>
        </StaggerItem>
      ) : null}
      {list[1] ? (
        <StaggerItem delay={0.08} direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={list[1].url} alt={list[1].alt} fill unoptimized={list[1].url.startsWith("/api/uploads/")} className="object-cover" sizes="25vw" />
          </div>
        </StaggerItem>
      ) : null}
      {list[2] ? (
        <StaggerItem delay={0.14} direction="up" className="col-span-2">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
            <Image src={list[2].url} alt={list[2].alt} fill unoptimized={list[2].url.startsWith("/api/uploads/")} className="object-cover" sizes="50vw" />
          </div>
        </StaggerItem>
      ) : null}
      {list.slice(3).map((img, i) => (
        <StaggerItem key={img.url + i} delay={0.1 * (i + 3)} direction="up" className="col-span-2">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
            <Image src={img.url} alt={img.alt} fill unoptimized={img.url.startsWith("/api/uploads/")} className="object-cover" sizes="50vw" />
          </div>
        </StaggerItem>
      ))}
    </div>
  );
}
