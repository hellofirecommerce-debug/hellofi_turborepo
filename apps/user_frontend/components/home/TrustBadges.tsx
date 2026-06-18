import { CheckCircle, Zap, RefreshCw } from "lucide-react";

const BADGES = [
  { icon: CheckCircle, label: "Verified Devices", color: "text-green-500" },
  { icon: Zap, label: "Instant Pricing", color: "text-yellow-500" },
  { icon: RefreshCw, label: "Free Exchange", color: "text-blue-500" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-6">
      {BADGES.map(({ icon: Icon, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-gray-500 text-sm font-medium"
        >
          <Icon size={16} className={color} />
          {label}
        </div>
      ))}
    </div>
  );
}
