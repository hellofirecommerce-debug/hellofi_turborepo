// components/category-page/shared/VisitStoreSection.tsx
import { MapPin, Clock, Navigation, Phone } from "lucide-react";

export function VisitStoreSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="bg-white border border-card-border rounded-2xl p-4 sm:p-6">
        <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold text-success mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Official Store
        </span>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-4 sm:mb-5">
          Visit <span className="text-primary">HelloFi</span> Store to Buy
          Directly
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:mb-5">
          <div className="flex gap-2.5 flex-1">
            <MapPin size={16} className="shrink-0 text-gray-400 mt-0.5" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                1st Floor, No 28, 1st Main Rd, near to Wipro park, 1st Block
                Koramangala, Koramangala, Bengaluru, Karnataka 560034
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 flex-1">
            <Clock size={16} className="shrink-0 text-gray-400 mt-0.5" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Business Hours
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Open 11AM - 9PM
                <br />
                Monday - Sunday
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Navigation size={14} />
            Get Direction
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 border border-primary text-primary text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-surface transition-colors"
          >
            <Phone size={14} />
            Call Us
          </button>
        </div>
      </div>
    </div>
  );
}
