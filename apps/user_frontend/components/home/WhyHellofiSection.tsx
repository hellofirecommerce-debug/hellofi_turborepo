import { Check, LayoutGrid } from "lucide-react";

export function WhyHelloFiSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-10">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <div className="lg:col-span-1 rounded-3xl border border-gray-200 p-8 flex flex-col relative overflow-hidden bg-white">
          <div
            className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
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
        </div>

        <div className="lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-hf-dark">
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
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
        </div>

        {/* 40-Point card */}
        <div
          className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex shrink-0 w-full relative"
          style={{ boxShadow: "0px 2px 40px 0px rgba(0, 0, 0, 0.04)" }}
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
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
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black">
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
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
        </div>

        <div className="lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black">
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
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
        </div>

        {/* No Last Minute Drops card */}
        <div
          className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex items-center h-full relative overflow-hidden"
          style={{ boxShadow: "0px 2px 40px 0px rgba(0, 0, 0, 0.04)" }}
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
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
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-1 rounded-3xl border border-gray-200 p-8 flex flex-col relative overflow-hidden bg-white">
          <div
            className="absolute rounded-full pointer-events-none"
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
        </div>

        <div className="lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden bg-black">
          <div
            className="absolute rounded-full pointer-events-none"
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
        </div>

        {/* 500+ card */}
        <div
          className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex relative overflow-hidden"
          style={{ boxShadow: "0px 2px 40px 0px rgba(0, 0, 0, 0.04)" }}
        >
          <div
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
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
        </div>
      </div>
    </section>
  );
}
