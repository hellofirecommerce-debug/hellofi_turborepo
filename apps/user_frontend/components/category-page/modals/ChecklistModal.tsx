// components/category-page/ChecklistModal.tsx
"use client";

import {
  CheckCircle2,
  X,
  ShieldCheck,
  Cpu,
  BatteryCharging,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";

interface ChecklistCategory {
  title: string;
  icon: React.ElementType;
  items: string[];
}

const FULL_CHECKLIST: ChecklistCategory[] = [
  {
    title: "VERIFICATION & AUTHENTICATION",
    icon: ShieldCheck,
    items: [
      "IMEI / Serial Number Verification",
      "Ownership Verification",
      "Ownership Transfer Eligibility Check",
      "Device Not Blacklisted",
      "Device Not Reported Lost or Stolen",
      "Original Purchase Documentation Verification",
      "Warranty Status Verification",
      "Repair History Check",
      "No Unauthorized Repairs",
      "Factory Reset / Format Verification",
    ],
  },
  {
    title: "HARDWARE INSPECTION",
    icon: Cpu,
    items: [
      "Overall Physical Condition",
      "Frame & Body Inspection",
      "Display Condition Check",
      "Touchscreen Functionality",
      "Dead Pixel Test",
      "Screen Brightness Test",
      "Face ID / Face Unlock Test",
      "Fingerprint Sensor Test",
      "Power Button Test",
      "Volume Button Test",
      "Charging Port Inspection",
      "Speaker Performance Test",
      "Microphone Functionality Test",
      "Vibration Motor Test",
      "Headphone Port Test (where applicable)",
      "SIM Tray Inspection",
      "Memory Card Slot Test (where applicable)",
      "Camera Lens Inspection",
      "Rear Camera Functionality",
      "Front Camera Functionality",
    ],
  },
  {
    title: "BATTERY & CONNECTIVITY",
    icon: BatteryCharging,
    items: [
      "Battery Health Assessment",
      "Battery Charging Test",
      "Wi-Fi Connectivity Test",
      "Bluetooth Connectivity Test",
      "Mobile Network Signal Test",
      "GPS Functionality Test",
      "NFC Functionality Test (where applicable)",
    ],
  },
  {
    title: "SOFTWARE & SECURITY",
    icon: Lock,
    items: [
      "Operating System Health Check",
      "iCloud Lock / Activation Lock Verification",
      "Malware & Security Status Check",
    ],
  },
];

interface ChecklistModalProps {
  onClose: () => void;
}

export function ChecklistModal({ onClose }: ChecklistModalProps) {
  return (
    <>
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      {/* mobile — full screen, slides bottom to top */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        className="fixed inset-0 z-50 bg-white flex flex-col sm:hidden"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-primary" />
            <h3 className="text-sm font-bold text-black">
              40-Point Quality Checklist
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-col gap-6">
            {FULL_CHECKLIST.map(({ title, icon: Icon, items }) => (
              <div key={title}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Icon size={13} className="text-primary" />
                  <p className="text-[11px] font-bold text-primary tracking-wide">
                    {title}
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item} className="text-xs text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* desktop — centered card, scale + fade in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
        className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-6"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-primary" />
              <h3 className="text-base font-bold text-black">
                40-Point Quality Checklist
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {FULL_CHECKLIST.map(({ title, icon: Icon, items }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <Icon size={13} className="text-primary" />
                    <p className="text-[11px] font-bold text-primary tracking-wide">
                      {title}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {items.map((item) => (
                      <li key={item} className="text-xs text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
