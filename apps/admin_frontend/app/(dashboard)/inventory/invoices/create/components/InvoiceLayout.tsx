"use client";
import { InvoiceView } from "../page";

interface InvoiceLayoutProps {
  view: InvoiceView;
  children: [React.ReactNode, React.ReactNode]; // [form, preview]
}

export function InvoiceLayout({ view, children }: InvoiceLayoutProps) {
  const [form, preview] = children;

  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* Form — left side */}
      {(view === "form" || view === "both") && (
        <div
          className={`${view === "both" ? "w-1/2" : "w-full"} overflow-y-auto`}
        >
          {form}
        </div>
      )}

      {/* Preview — right side */}
      {(view === "preview" || view === "both") && (
        <div
          className={`${view === "both" ? "w-1/2" : "w-full"} overflow-y-auto`}
        >
          {preview}
        </div>
      )}
    </div>
  );
}
