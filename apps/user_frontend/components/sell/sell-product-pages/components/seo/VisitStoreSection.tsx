import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  Store,
  MessageSquareText,
} from "lucide-react";

interface Props {
  storeImage?: string;
  cityLabel?: string;
  address?: string;
  phoneHref?: string;
  whatsappHref?: string;
}

export function VisitStoreSection({
  storeImage = "/images/store/hellofi-store.png", // Replace with your actual image path
  cityLabel = "Only for Bangalore Sellers",
  address = "1st Floor, No 28, 1st Main Rd, near to Wipro park, 1st Block Koramangala, Koramangala, Bengaluru, Karnataka 560034",
  phoneHref = "tel:+919999999999",
  whatsappHref = "https://wa.me/919999999999",
}: Props) {
  return (
    <div className="w-full flex justify-center gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-8 lg:py-10">
      {/* Main Card Container - Uses new --color-hf-card-bg */}
      <div className="w-full max-w-7xl rounded-0 sm:rounded-[24px] bg-white sm:bg-hf-card-bg p-0 sm:p-6 lg:p-8">
        {/* Adjusted grid columns to accommodate the wider container */}
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] lg:grid-cols-[450px_1fr] gap-8 lg:gap-12 items-stretch">
          {/* Left Side: Image */}
          <div className="relative w-full h-[320px] md:h-auto rounded-[16px] overflow-hidden shadow-sm">
            <Image
              src={storeImage}
              alt="HelloFi store"
              fill
              className="object-cover"
            />
            {/* Top floating badge (Store Icon) */}
            <div className="absolute top-5 left-5 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-md">
              <Store size={18} className="text-sell-blue" />
            </div>
            {/* Bottom floating badge (HelloFi) */}
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-md">
              <MessageSquareText size={16} className="text-sell-blue" />
              HelloFi
            </span>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col justify-center min-w-0 py-4">
            {/* Top Label */}
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-sell-blue uppercase">
              <MapPin size={16} />
              {cityLabel}
            </span>

            {/* Heading - Uses new --color-hf-navy */}
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-hf-navy leading-tight">
              Prefer visiting us{" "}
              <span className="text-sell-blue">instead?</span>
            </h2>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600 max-w-3xl">
              Drop in your device at our office as per your convenience. Our
              experts will inspect it in front of you and get{" "}
              <span className="text-sell-blue font-semibold">
                paid instantly on the spot
              </span>
              .
            </p>

            {/* Address Box */}
            <div className="mt-8 flex items-start gap-4 rounded-xl border border-card-border bg-white p-4 sm:p-5 shadow-sm max-w-3xl">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-surface flex-shrink-0 mt-0.5">
                <MapPin size={20} className="text-sell-blue" />
              </div>
              <div>
                <p className="text-base font-bold text-hf-navy">Address</p>
                <p className="mt-1 text-sm sm:text-[15px] leading-snug text-gray-500">
                  {address}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-2xl mx-auto">
              {/* Call Button - Uses new --color-hf-navy */}
              <a
                href={phoneHref}
                className="flex items-center justify-center sm:justify-start gap-4 rounded-xl bg-hf-navy px-6 py-4 sm:py-4 text-white transition hover:bg-hf-navy/90"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 flex-shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <span className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight">
                    Call Now
                  </span>
                  <span className="text-[13px] text-gray-300 leading-tight mt-1">
                    Talk with our HelloFi Experts
                  </span>
                </span>
              </a>

              {/* WhatsApp Button - Uses existing --color-success */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-4 rounded-xl border border-success bg-white px-6 py-4 transition hover:bg-success/5"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/10 flex-shrink-0">
                  <MessageCircle size={20} className="text-success" />
                </div>
                <span className="flex flex-col text-left">
                  <span className="text-[15px] font-bold text-success leading-tight">
                    WhatsApp Us
                  </span>
                  <span className="text-[13px] text-gray-500 leading-tight mt-1">
                    Chat with our Sales Executive
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
