export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  phone,
  email,
  areaServed,
  url,
  description,
}: {
  name: string;
  phone: string;
  email?: string;
  areaServed?: string;
  url: string;
  description?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name,
        telephone: phone,
        email,
        url,
        description,
        areaServed,
        priceRange: "$$",
      }}
    />
  );
}

export default JsonLd;
