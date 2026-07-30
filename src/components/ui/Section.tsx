import { cn } from "@/lib/utils";

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "deep" | "energy";
}

export function Section({ children, className, id, tone = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-pad relative",
        tone === "deep" && "bg-deep/60",
        tone === "energy" && "bg-energy circuit-pattern",
        className
      )}
    >
      {children}
    </section>
  );
}

export default Section;
