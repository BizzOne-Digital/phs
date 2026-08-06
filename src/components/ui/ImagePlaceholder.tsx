import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ImagePlaceholderProps extends Omit<ImageProps, "alt"> {
  alt: string;
  frameClassName?: string;
  aspect?: string;
}

export function ImagePlaceholder({
  alt,
  className,
  frameClassName,
  aspect = "aspect-[4/3]",
  fill,
  ...props
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "glass electric-border relative overflow-hidden rounded-2xl",
        aspect,
        frameClassName
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-deep/50 via-transparent to-electric/10" />
      <Image
        alt={alt}
        fill={fill ?? true}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, 50vw"
        {...props}
      />
    </div>
  );
}

export default ImagePlaceholder;
