"use client";

import { Check, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

const cardEntrance = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-40px" },
};

const smoothHover = {
  scale: 1.03,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const smoothHoverLg = {
  scale: 1.02,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function WhyHelloFiSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-hf-promise text-sm font-bold tracking-widest uppercase mb-2">
          Why HelloFi Stands Out
        </p>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-hf-title mb-3">
          Premium Quality. Honest Pricing. Always.
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          We believe great tech shouldn't cost the earth. We deliver premium
          quality services while championing sustainability.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 — Why HelloFi (white card) */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl border border-gray-200 p-8 flex flex-col relative overflow-hidden bg-white"
        >
          <div
            className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none transition-all duration-700"
            style={{ background: "#FFFBEB", filter: "blur(25px)" }}
          />
          <p className="text-[10px] font-bold tracking-widest text-hf-promise uppercase mb-3 relative z-10">
            Our Promise
          </p>
          <div className="relative z-10 mt-2">
            <h3 className="text-4xl font-extrabold text-black mb-3">
              Why HelloFi?
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Every deal at HelloFi is built on transparency, fair pricing, and
              genuine customer relationships.
            </p>
          </div>
          <p className="inline-block text-[10px] font-bold tracking-widest text-hf-badge uppercase mt-8 relative z-10 py-1 rounded-sm">
            <span className="p-2 rounded-2xl border border-hf-badge-border">
              Trust Comes First
            </span>
          </p>
        </motion.div>

        {/* 50%+ */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-hf-dark"
        >
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background: "#D97706",
              filter: "blur(60px)",
              opacity: 0.4,
            }}
          />
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 relative z-10">
            Trusted By
          </p>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-white mb-2 mt-2">
              50%+
            </h3>
            <p className="text-gray-300 text-sm font-semibold mb-3">
              Repeat Customer Rate
            </p>
            <p className="text-gray-400 text-xs leading-relaxed mt-8">
              More than half our customers come back — a reflection of the trust
              and satisfaction we consistently deliver.
            </p>
          </div>
        </motion.div>

        {/* 40-Point card */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHoverLg}
          className="group md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex shrink-0 w-full relative overflow-hidden shadow-[0px_2px_40px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_45px_rgba(0,0,0,0.12)] transition-shadow duration-700"
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, #D0FAE5 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div className="flex flex-col items-start text-left sm:flex-row sm:items-center gap-8 relative z-10 w-full">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={28} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase mb-2">
                Quality Certified
              </p>
              <h3 className="text-4xl font-extrabold text-black mb-1">
                40-Point
              </h3>
              <p className="text-gray-700 text-sm font-semibold mb-2">
                Inspection on every device
              </p>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                Performance, condition, authenticity rigorously checked before
                it reaches you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Row 2 — Strictly Preowned */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black"
        >
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-3 relative z-10">
            <span className="p-2 rounded-2xl border border-hf-preowned-border">
              Never Refurbished
            </span>
          </p>
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold text-white mb-1 mt-5">
              Strictly Preowned
            </h3>
            <p className="text-amber-400 text-xs font-semibold mb-3 mt-2">
              Only Original. Only Genuine
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              We only deal in carefully maintained preowned devices. No
              repaired, rebuilt, or altered gadgets.
            </p>
          </div>
        </motion.div>

        {/* Greener Purpose */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black"
        >
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, #10B981 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <p className="text-[10px] font-bold tracking-widest text-white uppercase mb-3 relative z-10">
            Eco Impact
          </p>
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold text-white mb-1 mt-5">
              Greener Purpose
            </h3>
            <p className="text-white text-xs font-semibold mb-3 mt-2">
              For every device sold
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Every refurbished device keeps e-waste out of landfills and gives
              great tech a second chance.
            </p>
          </div>
        </motion.div>

        {/* No Last Minute Drops card */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHoverLg}
          className="group md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex items-center h-full relative overflow-hidden shadow-[0px_2px_40px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_45px_rgba(0,0,0,0.12)] transition-shadow duration-700"
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, #DBEAFE80 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div className="flex flex-col items-start text-left sm:flex-row sm:items-center gap-8 relative z-10 w-full">
            <div>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-hf-price-border">
                <Check size={28} className="text-hf-price-blue" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-hf-price-blue uppercase mb-2">
                Price Guarantee
              </p>
              <h3 className="text-4xl font-extrabold text-black mb-1">
                No Last Minute Drops
              </h3>
              <p className="text-gray-600 text-sm font-semibold mb-2">
                No Doorstep Negotiations
              </p>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                The price you're quoted is the price you get. No hidden
                deductions, no doorstep negotiations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Row 3 — 20K+ */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl border border-gray-200 p-8 flex flex-col relative overflow-hidden bg-white"
        >
          <div
            className="absolute rounded-full pointer-events-none transition-all duration-700"
            style={{
              width: "256px",
              height: "256px",
              top: "-80px",
              left: "-80px",
              background:
                "radial-gradient(circle at center, rgba(255,251,235,1) 0%, transparent 70%)",
              filter: "blur(64px)",
            }}
          />
          <p className="text-[10px] font-bold tracking-widest text-hf-badge uppercase mb-3 relative z-10">
            Growing Community
          </p>
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold text-hf-title mb-1 mt-4">
              20K+
            </h3>
            <p className="text-gray-600 text-sm font-semibold mb-3 mt-2">
              Real customers
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Powered by referrals and word-of-mouth not aggressive marketing.
            </p>
          </div>
        </motion.div>

        {/* Trained Professionals */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHover}
          className="group lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black"
        >
          <div
            className="absolute rounded-full pointer-events-none transition-all duration-700"
            style={{
              width: "256px",
              height: "256px",
              top: "-80px",
              right: "-80px",
              background:
                "radial-gradient(circle at center, #B45309 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 relative z-10">
            In-House Experts
          </p>
          <div className="relative z-10">
            <h3 className="text-xl font-extrabold text-white mb-3 mt-4">
              Trained Professionals
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mt-2">
              Your device is handled by HelloFi's own trained team — never a
              random third party agent.
            </p>
          </div>
        </motion.div>

        {/* 500+ card */}
        <motion.div
          {...cardEntrance}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={smoothHoverLg}
          className="group md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex relative overflow-hidden shadow-[0px_2px_40px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_45px_rgba(0,0,0,0.12)] transition-shadow duration-700"
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none transition-all duration-700"
            style={{
              background:
                "radial-gradient(circle, #FFFBEB 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div className="flex flex-col items-start text-left sm:flex-row sm:items-center gap-8 relative z-10 w-full">
            <div className="flex-shrink-0">
              <LayoutGrid size={48} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-hf-badge uppercase mb-2">
                Huge Selection
              </p>
              <h3 className="text-5xl font-extrabold text-hf-title mb-1">
                500+
              </h3>
              <p className="text-gray-600 text-sm font-semibold mb-2">
                Devices available
              </p>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                Mobiles, laptops, MacBooks, tablets, smartwatches — all in one
                place.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
