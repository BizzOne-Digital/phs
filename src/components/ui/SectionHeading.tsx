import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <Badge variant="electric" className="mb-4">
          {eyebrow}
        </Badge>
      ) : null}
      <h2
        className={cn(
          "font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
