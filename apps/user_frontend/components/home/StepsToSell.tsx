"use client";

import Link from "next/link";
import { Search, FileText, CheckCircle, DollarSign } from "lucide-react";

const STEPS = [
  { label: "SELECT YOUR DEVICE", icon: Search },
  { label: "GET QUOTE", icon: FileText },
  { label: "QUICK CHECK", icon: CheckCircle },
  { label: "GET PAID", icon: DollarSign },
];

export function StepsToSell() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-primary rounded-2xl px-6 py-5">
        {/* Top row — label + GET QUOTE */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-xs font-bold tracking-widest uppercase">
            STEPS TO SELL
          </p>
          <Link
            href="/sell"
            className="bg-white text-primary text-xs font-bold px-5 py-2 rounded-full hover:bg-primary-surface transition-colors"
          >
            GET QUOTE
          </Link>
        </div>

        {/* Steps row */}
        <div className="flex items-center justify-between">
          {STEPS.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-white text-[9px] sm:text-[10px] font-semibold tracking-wide text-center">
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-white/50 text-xl mb-5">›</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
