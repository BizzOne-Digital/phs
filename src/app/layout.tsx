import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/animations/Providers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { getSettings, getServices } from "@/lib/data";
import {
  FALLBACK_SETTINGS,
  FALLBACK_SERVICES,
  withFallback,
} from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await withFallback(getSettings, FALLBACK_SETTINGS);
  return {
    title: {
      default: settings.defaultSeoTitle || FALLBACK_SETTINGS.defaultSeoTitle!,
      template: `%s | ${settings.businessName || "Premier Home Services"}`,
    },
    description:
      settings.defaultSeoDescription || FALLBACK_SETTINGS.defaultSeoDescription,
    metadataBase: new URL(absoluteUrl("/")),
    openGraph: {
      title: settings.defaultSeoTitle || FALLBACK_SETTINGS.defaultSeoTitle!,
      description:
        settings.defaultSeoDescription || FALLBACK_SETTINGS.defaultSeoDescription!,
      type: "website",
      locale: "en_CA",
    },
    icons: {
      icon: settings.faviconUrl || "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, services] = await Promise.all([
    withFallback(getSettings, FALLBACK_SETTINGS),
    withFallback(async () => getServices({ activeOnly: true }), FALLBACK_SERVICES),
  ]);

  const navServices = (services.length ? services : FALLBACK_SERVICES).map(
    (s: { name: string; slug: string; isEmergency?: boolean; category: string }) => ({
      name: s.name,
      slug: s.slug,
      isEmergency: Boolean(s.isEmergency),
      category: s.category,
    })
  );

  return (
    <html lang="en-CA" className={`${syne.variable} ${outfit.variable} h-full`}>
      <body className="bg-energy flex min-h-full flex-col font-sans antialiased">
        <LocalBusinessJsonLd
          name={settings.businessName}
          phone={settings.phone}
          email={settings.email}
          areaServed={settings.serviceArea}
          url={absoluteUrl("/")}
          description={settings.defaultSeoDescription}
        />
        <Providers>
          <SiteChrome settings={settings} services={navServices}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
