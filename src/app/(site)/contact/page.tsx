import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSettings } from "@/lib/data";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Premier Home Services for electrical, HVAC, and plumbing service across the Greater Toronto Area. Call 437-256-1028.",
};

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
  let settings;
  try {
    settings = await getSettings();
  } catch {
    settings = {
      phone: "437-256-1028",
      emergencyPhone: "437-256-1028",
      email: "contact@premierhomeservice.com",
      serviceArea: "Greater Toronto Area, Ontario",
      businessHours: "Monday–Saturday: 9:00 AM–5:00 PM",
      emergencyAvailability: "Available 24/7",
      mapEmbed: "",
    };
  }

  const phone = settings.emergencyPhone || settings.phone;

  return (
    <div>
      <section className="section-pad pb-10 pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Contact"
              title="Talk with the Premier Home Services team"
              description="Reach us for scheduled work or 24/7 emergencies across the Greater Toronto Area."
            />
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={SITE_IMAGES.contact.hero} alt={IMAGE_ALTS.torontoSkyline} fill className="object-cover" sizes="50vw" priority />
            </div>
          </div>
        </Container>
      </section>

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
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.contact.van} alt={IMAGE_ALTS.van} fill className="object-cover" sizes="20vw" />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.contact.emergency} alt={IMAGE_ALTS.emergencyResponse} fill className="object-cover" sizes="20vw" />
              </div>
              <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.contact.office} alt={IMAGE_ALTS.officeBuilding} fill className="object-cover" sizes="40vw" />
              </div>
            </div>
          </div>
          <ContactForm />
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <SectionHeading eyebrow="Service Area" title="Greater Toronto Area coverage" className="mb-6" />
          {settings.mapEmbed ? (
            <div className="overflow-hidden rounded-3xl border border-white/10" dangerouslySetInnerHTML={{ __html: settings.mapEmbed }} />
          ) : (
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
              <Image src={SITE_IMAGES.contact.mapFallback} alt={IMAGE_ALTS.nightCity} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#060b16] to-transparent p-8">
                <p className="max-w-xl text-slate-200">
                  We serve residential and commercial properties across the GTA. Contact us to confirm your location.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Contact questions" className="mb-6" />
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="glass rounded-2xl px-5 py-4">
                <summary className="cursor-pointer font-medium text-white">{f.q}</summary>
                <p className="mt-3 text-sm text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/request-service" className="btn-primary">Start a service request</Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
