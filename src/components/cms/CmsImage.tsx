import Image, { type ImageProps } from "next/image";
import { resolveCmsImage } from "@/lib/upload/resolve";

type CmsImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: string;
};

/** Storefront image with Mongo upload + legacy path support. */
export function CmsImage({ src, fallback, alt = "", ...props }: CmsImageProps) {
  const resolved = resolveCmsImage(src, fallback);
  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={resolved.startsWith("/api/uploads/") || props.unoptimized}
    />
  );
}
