import { MessageCircle, Phone } from "lucide-react";

interface Props {
  orderNo: string;
  productName: string;
}

// digits with country code in .env, e.g. 91XXXXXXXXXX
const PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "";
const WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";

export function HelpCard({ orderNo, productName }: Props) {
  const callHref = PHONE ? `tel:+${PHONE.replace(/\D/g, "")}` : "#";

  const message = `Hi HelloFi, I need help with my order ${orderNo} (${productName}).`;
  const waHref = WHATSAPP
    ? `https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : "#";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#F9B58A] via-[#E5E7EB] to-[#93C5FD] p-px">
      <div className="rounded-[15px] bg-[#F7F8FC] p-5">
        <h2 className="text-base font-extrabold text-gray-900">
          Need Help ? Connect with{" "}
          <span className="text-[#0066FF]">HelloFi</span>
        </h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={callHref}
            className="flex flex-1 items-center gap-3 rounded-xl bg-[#101B4A] px-4 py-3 text-white transition hover:bg-[#0B1438]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Phone size={16} />
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold">Call Now</span>
              <span className="block text-[11px] text-white/70">
                Talk with our HelloFi Experts
              </span>
            </span>
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-3 rounded-xl border border-[#22C55E] bg-white px-4 py-3 transition hover:bg-[#F0FDF4]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
              <MessageCircle size={16} />
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold text-gray-900">
                WhatsApp Us
              </span>
              <span className="block text-[11px] text-gray-500">
                Chat with our Sales Executive
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
