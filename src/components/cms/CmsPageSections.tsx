import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealStagger, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { PageSection } from "@/types";
import { cn } from "@/lib/utils";
import { resolveCmsImage, resolveCmsImages } from "@/lib/upload/resolve";

function SectionImages({
  images,
  className,
}: {
  images?: PageSection["images"];
  className?: string;
}) {
  const list = resolveCmsImages(images);
  if (!list.length) return null;

  if (list.length === 1) {
    return (
      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-3xl", className)}>
        <Image
          src={list[0].url}
          alt={list[0].alt || ""}
          fill
          unoptimized={list[0].url.startsWith("/api/uploads/")}
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {list.slice(0, 4).map((img, i) => (
        <div
          key={`${img.url}-${i}`}
          className={cn(
            "relative overflow-hidden rounded-2xl",
            list.length === 3 && i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={img.url}
            alt={img.alt || ""}
            fill
            unoptimized={img.url.startsWith("/api/uploads/")}
            className="object-cover"
            sizes="40vw"
          />
        </div>
      ))}
    </div>
  );
}

export function CmsHero({
  section,
  crumbs,
}: {
  section?: PageSection;
  crumbs: { label: string; href?: string }[];
}) {
  if (!section) return null;
  return (
    <section className="relative overflow-hidden pb-10 pt-6 md:pb-12 md:pt-8">
      <Container>
        <Breadcrumbs items={crumbs} className="!px-0 !py-0" />
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <Reveal direction="left">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.heading || crumbs[crumbs.length - 1]?.label || "Page"}
              description={section.subheading || section.body}
            />
            {(section.ctaLabel && section.ctaUrl) || (section.secondaryCtaLabel && section.secondaryCtaUrl) ? (
              <div className="btn-stack mt-6">
                {section.ctaLabel && section.ctaUrl ? (
                  <Link href={section.ctaUrl} className="btn-primary">
                    {section.ctaLabel}
                  </Link>
                ) : null}
                {section.secondaryCtaLabel && section.secondaryCtaUrl ? (
                  <Link href={section.secondaryCtaUrl} className="btn-secondary">
                    {section.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <SectionImages images={section.images} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function CmsBodySections({
  sections,
  skipKeys = ["hero"],
}: {
  sections: PageSection[];
  skipKeys?: string[];
}) {
  const list = sections.filter((s) => !skipKeys.includes(s.key));

  return (
    <>
      {list.map((section, index) => {
        const isSplit =
          section.type === "content-image" ||
          section.layoutVariant === "split" ||
          (section.images?.length && section.type !== "feature-list");

        if (section.type === "feature-list" || (section.bullets?.length && !section.body)) {
          return (
            <section key={section._id || section.key} className="section-pad pt-0">
              <Container>
                <Reveal direction="up">
                  <SectionHeading
                    eyebrow={section.eyebrow}
                    title={section.heading || section.key}
                    description={section.subheading || section.body}
                    className="mb-8"
                  />
                </Reveal>
                <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" alternate stagger={0.06}>
                  {(section.bullets || []).map((item) => (
                    <StaggerItem key={item}>
                      <div className="glass rounded-2xl px-5 py-4 text-sm text-slate-200">{item}</div>
                    </StaggerItem>
                  ))}
                </RevealStagger>
                {section.images?.length ? (
                  <div className="mt-8">
                    <SectionImages images={section.images} />
                  </div>
                ) : null}
              </Container>
            </section>
          );
        }

        if (isSplit) {
          const reverse = index % 2 === 1;
          return (
            <section key={section._id || section.key} className="section-pad pt-0">
              <Container className="grid items-center gap-8 lg:grid-cols-2">
                <Reveal direction={reverse ? "right" : "left"} className={reverse ? "lg:order-2" : undefined}>
                  <div className="glass h-full rounded-3xl p-6 sm:p-8">
                    {section.eyebrow ? (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                        {section.eyebrow}
                      </p>
                    ) : null}
                    <h2 className="font-display text-2xl text-white">{section.heading}</h2>
                    {section.subheading ? (
                      <p className="mt-2 text-slate-400">{section.subheading}</p>
                    ) : null}
                    {section.body ? (
                      <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-300">{section.body}</p>
                    ) : null}
                    {section.bullets?.length ? (
                      <ul className="mt-4 space-y-2 text-slate-300">
                        {section.bullets.map((b) => (
                          <li key={b}>• {b}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.ctaLabel && section.ctaUrl ? (
                      <Link href={section.ctaUrl} className="btn-secondary mt-6 inline-flex">
                        {section.ctaLabel}
                      </Link>
                    ) : null}
                  </div>
                </Reveal>
                <Reveal direction={reverse ? "left" : "right"} delay={0.1} className={reverse ? "lg:order-1" : undefined}>
                  <SectionImages images={section.images} />
                </Reveal>
              </Container>
            </section>
          );
        }

        return (
          <section key={section._id || section.key} className="section-pad pt-0">
            <Container className="mx-auto max-w-3xl">
              <Reveal direction="up">
                <div className="glass rounded-3xl p-6 sm:p-8">
                  {section.eyebrow ? (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                      {section.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="font-display text-2xl text-white">{section.heading}</h2>
                  {section.subheading ? (
                    <p className="mt-2 text-slate-400">{section.subheading}</p>
                  ) : null}
                  {section.body ? (
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-300">{section.body}</p>
                  ) : null}
                  {section.bullets?.length ? (
                    <ul className="mt-4 space-y-2 text-slate-300">
                      {section.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.ctaLabel && section.ctaUrl ? (
                    <Link href={section.ctaUrl} className="btn-secondary mt-6 inline-flex">
                      {section.ctaLabel}
                    </Link>
                  ) : null}
                </div>
              </Reveal>
              {section.images?.length ? (
                <div className="mt-8">
                  <SectionImages images={section.images} />
                </div>
              ) : null}
            </Container>
          </section>
        );
      })}
    </>
  );
}
