import {
  Camera,
  Mic,
  Volume2,
  Headphones,
  Bell,
  Vibrate,
  Radar,
  ScanFace,
  Fingerprint,
  BellOff,
  Wifi,
  Bluetooth,
  MapPin,
  Flashlight,
  RotateCw,
  CreditCard,
  PlugZap,
  SlidersVertical,
  BatteryWarning,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

export const FUNCTIONAL_ISSUES: {
  id: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "front-camera", label: "Front Camera", icon: Camera },
  { id: "rear-camera", label: "Rear Camera", icon: Camera },
  { id: "mic", label: "Mic", icon: Mic },
  { id: "speaker", label: "Speaker", icon: Volume2 },
  { id: "earphone", label: "Earphone Port", icon: Headphones },
  { id: "ringer", label: "Ringer", icon: Bell },
  { id: "vibrator", label: "Vibrator", icon: Vibrate },
  { id: "proximity", label: "Proximity", icon: Radar },
  { id: "face-sensor", label: "Face Sensor", icon: ScanFace },
  { id: "fingerprint", label: "Fingerprint", icon: Fingerprint },
  { id: "silent", label: "Silent Button", icon: BellOff },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "bluetooth", label: "Bluetooth", icon: Bluetooth },
  { id: "gps", label: "GPS", icon: MapPin },
  { id: "flashlight", label: "Flashlight", icon: Flashlight },
  { id: "auto-rotate", label: "Auto Rotate", icon: RotateCw },
  { id: "sim", label: "SIM Card", icon: CreditCard },
  { id: "charging", label: "Charging Port", icon: PlugZap },
  { id: "buttons", label: "Power/Volume", icon: SlidersVertical },
  { id: "battery-bulge", label: "Battery Bulge", icon: BatteryWarning },
  { id: "heat", label: "Device Heat", icon: Thermometer },
  { id: "service", label: "Service (<90%)", icon: BatteryWarning },
];

export const DISPLAY_PROBLEMS = [
  "Minor crack/chipping outside screen area",
  "Minor white dot/patch on screen",
  "Major visible spots/discolouration on screen",
  "Line/Black Dot/Flickering/Broken display/touch screen not working",
];

export const BODY_PROBLEMS = [
  "1-2 minor scratches",
  "Minor discolouration",
  "Major discolouration",
  "Broken/Cracks or visible breakage",
];

export const ACCESSORY_ITEMS = [
  {
    id: "box",
    label: "Original Box",
    hint: "Box with same IMEI/serial number",
  },
  {
    id: "bill",
    label: "Valid GST Bill",
    hint: "Valid GST bill with the same IMEI/ Serial Number",
  },
  {
    id: "adapter",
    label: "Adapter + Data Cable",
    hint: "Adapter/Cable or both that comes with the Box",
  },
];

export const MOBILE_AGES = [
  "Below 3 months",
  "3 to 6 Months",
  "6 to 9 Months",
  "9 to 11 Months",
  "Above 11 Months",
];
