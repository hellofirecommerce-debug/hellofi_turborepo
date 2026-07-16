// components/category-page/KeyFeaturesSection.tsx
const KEY_FEATURES = [
  "Every device comes with either the remaining Brand Warranty or a 3-Month HelloFi Service Warranty.",
  "Free doorstep delivery is available on all products across India.",
  "All devices come with genuine Windows or macOS software — never cracked and never trial versions.",
  "Cash on Delivery (COD) is available on eligible orders.",
  "A GST invoice is provided with every purchase.",
  "Every device is guaranteed to be unopened and free from any repair history.",
  "Each device undergoes a comprehensive 40-point quality inspection before being listed.",
  "Most devices include the original box, charging cable, and first-owner purchase invoice.",
  "No-Cost EMI options are available on selected devices.",
];

const QUICK_LINKS = [
  { label: "second hand iphone", href: "/buy-used-mobile-phones" },
  { label: "used laptop", href: "/buy-used-laptops" },
  { label: "second hand laptop", href: "/buy-used-laptops" },
  { label: "used macbook", href: "/buy-used-laptops" },
  { label: "second hand apple laptop", href: "/buy-used-laptops" },
  { label: "2nd hand tablets", href: "/buy-used-tablets" },
  { label: "second hand gaming laptop", href: "/buy-used-laptops" },
  { label: "secondhand apple watch", href: "/buy-used-smartwatches" },
];

export function KeyFeaturesSection() {
  return (
    <section className="w-full bg-[#ecf1f7] pb-8 sm:pb-10 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl border-2 border-dashed border-primary p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 sm:gap-8">
            {/* Key Features */}
            <div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black mb-3 sm:mb-4">
                Key Features:
              </h3>
              <ul className="flex flex-col gap-1.5 sm:gap-2">
                {KEY_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 items-start text-[11px] sm:text-xs lg:text-sm text-gray-700 leading-relaxed"
                  >
                    <span className="shrink-0 text-primary mt-0.5">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="border-t lg:border-t-0 lg:border-l border-dashed border-primary/40 pt-4 lg:pt-0 lg:pl-6">
              <h3 className="text-[10px] sm:text-xs font-bold text-primary tracking-widest mb-3 sm:mb-4">
                QUICK LINKS
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {QUICK_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="inline-block text-[10px] sm:text-[11px] text-gray-600 bg-white border border-primary/20 rounded-md px-2.5 py-1.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
