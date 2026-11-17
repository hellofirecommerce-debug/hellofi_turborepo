"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "../types";

interface Props {
  address: Address;
  selected: boolean;
  confirmingDelete: boolean;
  deleting: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function AddressCard({
  address: a,
  selected,
  confirmingDelete,
  deleting,
  onSelect,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: Props) {
  const line = [a.address, a.landMark, a.cityDistrict, a.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      className={`cursor-pointer rounded-lg border p-3.5 transition ${
        selected
          ? "border-[#0066FF] bg-[#F7FAFF]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#0066FF]" : "border-gray-300"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-[#0066FF]" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-bold text-gray-900">{a.name}</p>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-600">
              {a.addressType}
            </span>
            {a.isDefault && (
              <span className="rounded bg-[#EEF3FF] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#0066FF]">
                Default
              </span>
            )}
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
            {line} - {a.pinCode}
          </p>
          <p className="mt-1 text-xs text-gray-600">Contact +91 {a.contact}</p>

          {confirmingDelete && (
            <div
              className="mt-3 flex items-center gap-3 rounded-md bg-red-50 px-3 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex-1 text-xs font-semibold text-red-600">
                Delete this address?
              </span>
              <button
                type="button"
                onClick={onCancelDelete}
                className="text-xs font-semibold text-gray-600"
              >
                No
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={onConfirmDelete}
                className="text-xs font-bold text-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          )}
        </div>

        <div
          className="flex shrink-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit address"
            className="text-[#0066FF] hover:opacity-70"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={onAskDelete}
            aria-label="Delete address"
            className="text-red-500 hover:opacity-70"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
