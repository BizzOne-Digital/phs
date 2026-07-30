"use client";

import { useEffect, useState } from "react";
import { Children, createContext, useContext, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale";

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}

function getOffset(direction: Direction, mobile: boolean) {
  const d = mobile ? 0.55 : 1;
  const map: Record<Direction, { x: number; y: number; scale: number }> = {
    up: { x: 0, y: 40 * d, scale: 1 },
    down: { x: 0, y: -28 * d, scale: 1 },
    left: { x: -36 * d, y: 12 * d, scale: 1 },
    right: { x: 36 * d, y: 12 * d, scale: 1 },
    scale: { x: 0, y: 20 * d, scale: mobile ? 0.97 : 0.94 },
  };
  return map[direction];
}

const StaggerDirectionContext = createContext<Direction>("up");

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  once?: boolean;
  duration?: number;
}

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  once = true,
  duration = 0.7,
}: RevealProps) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const offset = getOffset(direction, mobile);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: offset.scale,
        filter: mobile ? "blur(0px)" : "blur(5px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once, amount: mobile ? 0.08 : 0.14, margin: "0px 0px -8% 0px" }}
      transition={{ duration: mobile ? Math.min(duration, 0.55) : duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RevealAlternate({
  children,
  index = 0,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  delay?: number;
}) {
  const pattern: Direction[] = ["left", "right", "up", "scale"];
  return (
    <Reveal className={className} direction={pattern[index % pattern.length]} delay={delay}>
      {children}
    </Reveal>
  );
}

export interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  stagger?: number;
  once?: boolean;
}

export function Stagger({ children, className, direction = "up" }: StaggerProps) {
  return (
    <StaggerDirectionContext.Provider value={direction}>
      <div className={cn(className)}>{children}</div>
    </StaggerDirectionContext.Provider>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}

export function StaggerItem({
  children,
  className,
  delay = 0,
  direction: directionProp,
}: StaggerItemProps) {
  const ctxDirection = useContext(StaggerDirectionContext);
  const direction = directionProp || ctxDirection;
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const offset = getOffset(direction, mobile);

  if (reduce) {
    return <div className={cn("h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("h-full", className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: offset.scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: mobile ? 0.06 : 0.12, margin: "0px 0px -6% 0px" }}
      transition={{ duration: mobile ? 0.45 : 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  stagger?: number;
  once?: boolean;
  alternate?: boolean;
}

export function RevealStagger({
  children,
  className,
  direction = "up",
  stagger = 0.1,
  alternate = false,
}: RevealStaggerProps) {
  const items = Children.toArray(children).filter(Boolean);
  const cycle: Direction[] = ["up", "left", "right", "scale"];
  const mobile = useIsMobile();
  const step = mobile ? Math.min(stagger, 0.06) : stagger;

  return (
    <div className={className}>
      {items.map((child, i) => {
        const key = isValidElement(child) && child.key != null ? child.key : i;
        const dir = alternate ? cycle[i % cycle.length] : direction;
        return (
          <StaggerItem key={key} className="h-full" delay={i * step} direction={dir}>
            {child}
          </StaggerItem>
        );
      })}
    </div>
  );
}

export default Reveal;
