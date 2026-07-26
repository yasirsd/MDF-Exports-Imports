import {
  Award,
  Repeat,
  Globe2,
  ScanSearch,
  Snowflake,
  Package,
  Truck,
  Handshake,
  Sprout,
  ListFilter,
  Container,
  Ship,
  Anchor,
  ShieldCheck,
  BadgeCheck,
  Leaf,
  HelpCircle,
  Ruler,
  Palette,
  Droplets,
  Clock,
} from "lucide-react";

const registry = {
  Award,
  Repeat,
  Globe2,
  ScanSearch,
  Snowflake,
  Package,
  Truck,
  Handshake,
  Sprout,
  ListFilter,
  Container,
  Ship,
  Anchor,
  ShieldCheck,
  BadgeCheck,
  Leaf,
  Ruler,
  Palette,
  Droplets,
  Clock,
};

/** Resolve a lucide icon by name, with a safe fallback. */
export function Icon({ name, ...props }) {
  const Cmp = registry[name] || HelpCircle;
  return <Cmp {...props} />;
}
