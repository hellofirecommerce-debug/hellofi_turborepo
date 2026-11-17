"use client";
import { useEffect } from "react";
import { X, Smartphone } from "lucide-react";

interface Props {
  parentTitle: string;
  popupConditions: any[];
  answers: Record<string, string[]>;
  onSelect: (popupConditionId: string, optionId: string) => void;
  onClose: () => void;
}

export function DynamicConditionModal({
  parentTitle,
  popupConditions,
  answers,
  onSelect,
  onClose,
}: Props) {
  const isComplete = popupConditions.every(
    (popup) => (answers[popup.id] || []).length > 0,
  );

  // lock the page behind the modal while it is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFF]">
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          {parentTitle}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <X size={22} />
        </button>
      </div>

      {/* BODY (scrolls) */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-4 sm:p-6">
          {popupConditions.map((popup) => (
            <div key={popup.id} className="flex flex-col gap-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-base font-bold text-gray-900">
                  {popup.title}
                </h3>
                {popup.subtitle && (
                  <p className="mt-1 text-xs text-gray-500">{popup.subtitle}</p>
                )}
              </div>

              {/* TWO IN A ROW */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {popup.options.map((opt: any) => {
                  const active = (answers[popup.id] || []).includes(opt.id);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelect(popup.id, opt.id)}
                      className={`flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all ${
                        active
                          ? "border-[#0066FF] shadow-md shadow-blue-500/10"
                          : "border-transparent shadow-sm hover:border-[#0066FF]/30"
                      }`}
                    >
                      <div className="flex h-28 w-full items-center justify-center bg-[#F8FAFF] p-3 sm:h-40 sm:p-4">
                        {opt.image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${opt.image}`}
                            alt={opt.label}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Smartphone
                            size={40}
                            className="text-gray-300"
                            strokeWidth={1}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 p-3 sm:p-4">
                        <span className="text-sm font-bold leading-tight text-gray-900">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-xs leading-snug text-gray-500">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t border-gray-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={!isComplete}
            className="h-11 w-full rounded-xl bg-[#0066FF] text-sm font-bold text-white transition-colors hover:bg-[#0057D9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
