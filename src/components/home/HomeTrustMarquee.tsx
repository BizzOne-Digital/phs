import { Marquee } from "@/components/animations/Marquee";
import { TRUST_ITEMS } from "@/lib/constants";

export function HomeTrustMarquee() {
  return <Marquee items={[...TRUST_ITEMS]} />;
}
