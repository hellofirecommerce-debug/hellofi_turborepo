"use client";
import { useEffect } from "react";
import { Check, Smartphone, X } from "lucide-react";

interface Props {
  parentTitle: string;
  parentSubtitle?: string;
  popupConditions: any[];
  answers: Record<string, string[]>;
  onSelect: (popupConditionId: string, optionId: string) => void;
  onClose: () => void;
}

const descLines = (d?: string) =>
  (d || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

const isAnswered = (answers: Record<string, string[]>, id: string) =>
  (answers[id] || []).length > 0;

// a popup question blocks "Done" only if it is required and unanswered
export const isPopupComplete = (
  popupConditions: any[],
  answers: Record<string, string[]>,
) => popupConditions.every((p) => !p.isRequired || isAnswered(answers, p.id));

export function DynamicConditionModal({
  parentTitle,
  parentSubtitle,
  popupConditions,
  answers,
  onSelect,
  onClose,
}: Props) {
  const isComplete = isPopupComplete(popupConditions, answers);
  const missing = popupConditions.filter(
    (p) => p.isRequired && !isAnswered(answers, p.id),
  ).length;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const renderCards = (popup: any, multi: boolean) => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {popup.options.map((opt: any) => {
        const active = (answers[popup.id] || []).includes(opt.id);
        const lines = descLines(opt.description);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(popup.id, opt.id)}
            className={`relative flex flex-col self-start overflow-hidden rounded-xl border-2 bg-white text-left transition-all lg:items-stretch lg:self-stretch lg:p-3 ${
              active
                ? "border-[#0066FF] shadow-md shadow-blue-500/10 lg:bg-[#F5F9FF]"
                : "border-transparent shadow-sm hover:border-[#0066FF]/30 lg:border-gray-100 lg:shadow-none"
            }`}
          >
            {multi && (
              <span
                className={`absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border-2 ${
                  active
                    ? "border-[#0066FF] bg-[#0066FF] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {active && <Check size={12} strokeWidth={3} />}
              </span>
            )}
            <div className="flex h-28 w-full items-center justify-center bg-[#F8FAFF] p-3 sm:h-40 sm:p-4 lg:h-24 lg:rounded-lg lg:bg-gray-50 lg:p-2">
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
            <div className="flex flex-col gap-1.5 p-3 sm:p-4 lg:px-1 lg:pb-1 lg:pt-3">
              <span className="text-sm font-bold leading-tight text-gray-900 lg:text-center lg:text-base">
                {opt.label}
              </span>
              {lines.length > 1 ? (
                <ul className="flex flex-col gap-1 text-xs leading-snug text-gray-500 lg:text-sm">
                  {lines.map((l) => (
                    <li key={l} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                lines[0] && (
                  <span className="text-xs leading-snug text-gray-500 lg:text-center lg:text-sm">
                    {lines[0]}
                  </span>
                )
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderBoolean = (popup: any) => (
    <div className="grid grid-cols-2 gap-3">
      {popup.options.map((opt: any) => {
        const active = (answers[popup.id] || []).includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(popup.id, opt.id)}
            className={`flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-sm font-bold transition ${
              active
                ? "border-[#0066FF] bg-[#0066FF] text-white"
                : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]/40"
            }`}
          >
            {active && <Check size={16} strokeWidth={3} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  const renderList = (popup: any) => (
    <div className="flex flex-col gap-2.5">
      {popup.options.map((opt: any) => {
        const active = (answers[popup.id] || []).includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(popup.id, opt.id)}
            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition ${
              active
                ? "border-[#0066FF] bg-[#0066FF] text-white"
                : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]/40"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                active ? "border-white" : "border-gray-300"
              }`}
            >
              {active && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{opt.label}</span>
              {opt.description && (
                <span
                  className={`mt-0.5 block text-xs ${
                    active ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderPopup = (popup: any) => {
    const type: string = popup.conditionType || "";
    if (type.startsWith("MULTI_SELECT")) return renderCards(popup, true);
    if (type === "BOOLEAN") return renderBoolean(popup);
    const hasImages = popup.options.some((o: any) => o.image);
    return hasImages ? renderCards(popup, false) : renderList(popup);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFF] lg:items-center lg:justify-center lg:bg-black/50 lg:p-6">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:max-h-[90vh] lg:max-w-3xl lg:flex-none lg:rounded-2xl lg:bg-white lg:shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6 lg:py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
              {parentTitle}
            </h2>
            {parentSubtitle && (
              <p className="mt-1 hidden text-sm text-gray-500 lg:block">
                {parentSubtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-4 sm:p-6">
            {popupConditions.map((popup) => {
              const answered = isAnswered(answers, popup.id);
              const needs = popup.isRequired && !answered;
              return (
                <div key={popup.id} className="flex flex-col gap-4">
                  <div
                    className={`border-b pb-2 ${
                      needs ? "border-red-200" : "border-gray-200"
                    } ${popupConditions.length === 1 && !popup.isRequired ? "lg:hidden" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-gray-900">
                        {popup.title}
                      </h3>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                          popup.isRequired
                            ? answered
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {popup.isRequired
                          ? answered
                            ? "Done"
                            : "Required"
                          : "Optional"}
                      </span>
                    </div>
                    {popup.subtitle && (
                      <p className="mt-1 text-xs text-gray-500">
                        {popup.subtitle}
                      </p>
                    )}
                  </div>
                  {renderPopup(popup)}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 lg:pb-4">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
            <p className="hidden text-xs font-semibold text-red-500 sm:block">
              {missing > 0
                ? `${missing} required question${missing > 1 ? "s" : ""} left`
                : ""}
            </p>
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
    </div>
  );
}
