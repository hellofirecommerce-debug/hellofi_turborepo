export interface HSNCode {
  code: string;
  gstRate: number;
  description: string;
}

export const HSN_CODES: Record<string, HSNCode> = {
  "85299090": {
    code: "85299090",
    gstRate: 18,
    description: "Car Charger / Computer Spares",
  },
  "85076000": { code: "85076000", gstRate: 18, description: "Used Battery" },
  "85182900": { code: "85182900", gstRate: 18, description: "Used Speakers" },
  "85183000": {
    code: "85183000",
    gstRate: 18,
    description: "Bluetooth Headset",
  },
  "85258020": { code: "85258020", gstRate: 18, description: "Camera" },
  "84717020": { code: "84717020", gstRate: 18, description: "Hard Disk" },
  "85198940": {
    code: "85198940",
    gstRate: 18,
    description: "iPods (MP3 Players)",
  },
  "84716040": { code: "84716040", gstRate: 18, description: "Keyboard" },
  "85255020": { code: "85255020", gstRate: 18, description: "Media Streamer" },
  "85285100": {
    code: "85285100",
    gstRate: 18,
    description: 'Monitor (less than 17")',
  },
  "85285200": {
    code: "85285200",
    gstRate: 28,
    description: "Desktop monitors (more than 32 inches)",
  },
  "84716060": { code: "84716060", gstRate: 18, description: "Mouse" },
  "85423200": { code: "85423200", gstRate: 18, description: "RAM" },
  "85176930": { code: "85176930", gstRate: 18, description: "Router" },
  "85395000": { code: "85395000", gstRate: 12, description: "Smart Bulb" },
  "91029990": { code: "91029990", gstRate: 18, description: "Smart Watches" },
  "84715000": { code: "84715000", gstRate: 18, description: "Used Desktop" },
  "84433100": {
    code: "84433100",
    gstRate: 18,
    description: "Printer (All In One, Canon, HP, Xerox)",
  },
  "85171211": { code: "85171211", gstRate: 18, description: "Mobile" },
  "84713010": { code: "84713010", gstRate: 18, description: "Laptop" },
  "84713090": { code: "84713090", gstRate: 18, description: "Tablets" },
} as const;
