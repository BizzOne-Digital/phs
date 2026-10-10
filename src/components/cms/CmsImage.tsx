import Image, { type ImageProps } from "next/image";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { isMongoUploadUrl, MongoUploadImage } from "@/components/ui/MongoUploadImage";

type CmsImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: string;
};

/** Storefront image with Mongo upload + legacy path support. */
export function CmsImage({ src, fallback, alt = "", className, fill, sizes, loading, ...props }: CmsImageProps) {
  const resolved = resolveCmsImage(src, fallback);
  if (isMongoUploadUrl(resolved)) {
    return (
      <MongoUploadImage
        src={resolved}
        alt={alt}
        className={className}
        fill={fill}
        sizes={sizes}
        loading={loading}
      />
    );
  }
  return (
    <Image
      {...props}
      className={className}
      fill={fill}
      sizes={sizes}
      loading={loading}
      src={resolved}
      alt={alt}
      unoptimized={props.unoptimized}
    />
  );
}
