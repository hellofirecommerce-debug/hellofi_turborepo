import { ExternalLink, TrendingUp } from "lucide-react";

export default function SidebarWidget() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center">
      <div className="mb-2 flex justify-center">
        <TrendingUp size={24} className="text-brand-500" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-900 text-sm">
        HelloFi Admin
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm ">
        Bangalore · Odisha · Agartala
      </p>
      <a
        href="https://hellofi.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        <ExternalLink size={14} />
        View Live Site
      </a>
    </div>
  );
}
