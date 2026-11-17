import {
  Box,
  FileText,
  Cable,
  ShieldCheck,
  Smartphone,
  Landmark,
  Battery,
  Camera,
  Headphones,
  Package,
  Receipt,
  Wifi,
} from "lucide-react";

// SIM card icon (same look as your screenshot)
export const SimCard = ({
  size = 24,
  strokeWidth = 1.5,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <rect x="9" y="13" width="6" height="5" rx="1" fill="currentColor" />
  </svg>
);

// name saved in SellingCondition.icon -> icon component
export const ICON_MAP: Record<string, any> = {
  Box,
  FileText,
  Cable,
  ShieldCheck,
  Smartphone,
  Landmark,
  SimCard,
  Battery,
  Camera,
  Headphones,
  Package,
  Receipt,
  Wifi,
};

// automatic icon by title (used when no icon is chosen in admin)
const TITLE_ICONS: Record<string, any> = {
  "original box": Box,
  "valid gst bill": FileText,
  "adapter data cable": Cable,
  "purchased place": ShieldCheck,
  "additional insurance": Smartphone,
  "device under finance": Landmark,
  "sim type": SimCard,
};

const norm = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// admin icon first, then title match, then the default
export const iconFor = (condition: any, fallback: any) =>
  (condition.icon && ICON_MAP[condition.icon]) ||
  TITLE_ICONS[norm(condition.title ?? "")] ||
  fallback;

// true when the condition has an admin icon or a known title (renders as a tile)
export const hasIcon = (condition: any) =>
  !!(condition.icon && ICON_MAP[condition.icon]) ||
  !!TITLE_ICONS[norm(condition.title ?? "")];
