import { cn } from "@/lib/utils";

type MongoUploadImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
};

/** Bypass next/image for Mongo-backed uploads (reliable in admin + storefront). */
export function MongoUploadImage({
  src,
  alt,
  className,
  fill,
  sizes,
  loading = "lazy",
}: MongoUploadImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional for /api/uploads binary responses
    <img
      src={src}
      alt={alt}
      loading={loading}
      sizes={sizes}
      className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}

export function isMongoUploadUrl(url?: string | null): boolean {
  return Boolean(url?.startsWith("/api/uploads/"));
}
