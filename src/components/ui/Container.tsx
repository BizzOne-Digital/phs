import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("container-site w-full min-w-0", className)}>{children}</Tag>;
}

export default Container;
