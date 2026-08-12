import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { CmsHero, CmsBodySections } from "@/components/cms/CmsPageSections";
import { CmsImageGrid } from "@/components/cms/CmsImageGrid";
import { CmsImage } from "@/components/cms/CmsImage";
import { getSettings, getPageBySlug } from "@/lib/data";
import { findSection, sectionText, visibleSections } from "@/lib/cms";
import { SITE_IMAGES } from "@/lib/site-images";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { phoneHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact").catch(() => null);
  return {
    title: page?.seoTitle || "Contact",
    description:
      page?.seoDescription ||
      "Contact Premier Home Services for electrical, HVAC, and plumbing service across the Greater Toronto Area.",
  };
}

const FAQS = [
  {
    q: "Do you offer emergency service?",
    a: "Yes. Emergency electrical, HVAC, and plumbing support is available 24/7. Call the emergency line for urgent issues.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the Greater Toronto Area. Contact us to confirm coverage for your property.",
  },
  {
    q: "What are regular business hours?",
    a: "Monday–Saturday, 9:00 AM–5:00 PM for scheduled appointments. Emergencies are handled around the clock.",
  },
];

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getSettings().catch(() => ({
      phone: "437-256-1028",
      emergencyPhone: "437-256-1028",
      email: "contact@premierhomeservice.com",
      serviceArea: "Greater Toronto Area, Ontario",
      businessHours: "Monday–Saturday: 9:00 AM–5:00 PM",
      emergencyAvailability: "Available 24/7",
      mapEmbed: "",
    })),
    getPageBySlug("contact").catch(() => null),
  ]);

  const phone = settings.emergencyPhone || settings.phone;
  const details = findSection(page, "details");
  const mapSection = findSection(page, "map");

  return (
    <div>
      <CmsHero section={findSection(page, "hero")} crumbs={[{ label: "Contact" }]} />

      <section className="section-pad pt-0">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <a href={phoneHref(phone)} className="glass flex items-center gap-3 rounded-2xl p-5 hover:border-cyan-400/30">
              <Phone className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Phone / Emergency</p>
                <p className="font-semibold text-white">{phone}</p>
              </div>
            </a>
            <a href={`mailto:${settings.email}`} className="glass flex items-center gap-3 rounded-2xl p-5 hover:border-cyan-400/30">
              <Mail className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
                <p className="font-semibold text-white">{settings.email}</p>
              </div>
            </a>
            <div className="glass flex items-center gap-3 rounded-2xl p-5">
              <MapPin className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Service area</p>
                <p className="font-semibold text-white">{settings.serviceArea}</p>
              </div>
            </div>
            <div className="glass flex items-center gap-3 rounded-2xl p-5">
              <Clock className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Hours</p>
                <p className="font-semibold text-white">{settings.businessHours}</p>
                <p className="text-sm text-slate-400">Emergency: {settings.emergencyAvailability}</p>
              </div>
            </div>
            <a href={phoneHref(phone)} className="btn-emergency w-full justify-center">
              <Phone className="h-4 w-4" /> Call 24/7 Emergency Line
            </a>
            <CmsImageGrid
              images={details?.images}
              fallbacks={[SITE_IMAGES.contact.van, SITE_IMAGES.contact.emergency, SITE_IMAGES.contact.office]}
              alts={[IMAGE_ALTS.van, IMAGE_ALTS.emergencyResponse, IMAGE_ALTS.officeBuilding]}
              layout="contact"
            />
          </div>
          <ContactForm />
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <SectionHeading
            eyebrow={sectionText(mapSection, "eyebrow", "Service Area")}
            title={sectionText(mapSection, "heading", "Greater Toronto Area coverage")}
            className="mb-6"
          />
          {settings.mapEmbed ? (
            <div className="overflow-hidden rounded-3xl border border-white/10" dangerouslySetInnerHTML={{ __html: settings.mapEmbed }} />
          ) : (
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
              <CmsImage
                src={mapSection?.images?.[0]?.url}
                fallback={SITE_IMAGES.contact.mapFallback}
                alt={mapSection?.images?.[0]?.alt || IMAGE_ALTS.nightCity}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#060b16] to-transparent p-8">
                <p className="max-w-xl text-slate-200">
                  {sectionText(
                    mapSection,
                    "body",
                    "We serve residential and commercial properties across the GTA. Contact us to confirm your location."
                  )}
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      <CmsBodySections sections={visibleSections(page)} skipKeys={["hero", "details", "form", "map"]} />

      <section className="section-pad pt-0">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions" className="mb-6" />
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
