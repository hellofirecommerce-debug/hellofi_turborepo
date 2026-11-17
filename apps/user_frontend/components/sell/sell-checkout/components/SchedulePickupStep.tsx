"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Store, Truck } from "lucide-react";
import type { AreaInfo, PickupMethod, ScheduleDraft } from "../types";

// keep in sync with backend lib/constants/pickup.ts
const SLOTS = [
  { label: "09:00 AM - 12:00 PM", start: 9 },
  { label: "12:00 PM - 03:00 PM", start: 12 },
  { label: "03:00 PM - 06:00 PM", start: 15 },
  { label: "06:00 PM - 09:00 PM", start: 18 },
];
const DAYS = 7;
const BUFFER_HOURS = 2;

const istNow = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000);

const slotOpen = (isToday: boolean, start: number) =>
  !isToday || start >= istNow().getUTCHours() + BUFFER_HOURS;

function buildDates() {
  const base = istNow();
  return Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(
      Date.UTC(
        base.getUTCFullYear(),
        base.getUTCMonth(),
        base.getUTCDate() + i,
      ),
    );
    return {
      iso: d.toISOString().slice(0, 10),
      day:
        i === 0
          ? "Today"
          : d.toLocaleDateString("en-IN", {
              weekday: "short",
              timeZone: "UTC",
            }),
      label: d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    };
  });
}

interface Props {
  area: AreaInfo; // from the pincode check made when the address was confirmed
  initial: ScheduleDraft | null; // what the user chose earlier (page state)
  onConfirm: (schedule: ScheduleDraft) => void;
}

export default function SchedulePickupStep({
  area,
  initial,
  onConfirm,
}: Props) {
  const dates = useMemo(buildDates, []);

  const available = (m: PickupMethod) =>
    m === "DOORSTEP" ? area.serviceable : area.isDropToOfficeAvailable;

  // saved date is only usable if it is still inside the 7-day window
  const savedDateValid =
    !!initial?.date && dates.some((d) => d.iso === initial.date);

  const [method, setMethod] = useState<PickupMethod | null>(() => {
    if (initial?.method && available(initial.method)) return initial.method;
    if (area.serviceable) return "DOORSTEP";
    if (area.isDropToOfficeAvailable) return "DROP_TO_OFFICE";
    return null;
  });

  const [date, setDate] = useState<string>(() => {
    if (savedDateValid && initial?.date) return initial.date;
    const todayHasSlot = SLOTS.some((s) => slotOpen(true, s.start));
    return (todayHasSlot ? dates[0] : dates[1])?.iso ?? "";
  });

  const [slot, setSlot] = useState<string | null>(() => {
    if (!savedDateValid || !initial?.date) return null;
    const saved = SLOTS.find((s) => s.label === initial.slot);
    if (!saved) return null;
    const isToday = initial.date === dates[0]?.iso;
    return slotOpen(isToday, saved.start) ? saved.label : null;
  });

  const isToday = date === dates[0]?.iso;
  const todayHasSlot = SLOTS.some((s) => slotOpen(true, s.start));

  const methods = [
    {
      id: "DOORSTEP" as PickupMethod,
      title: "Doorstep Pickup",
      tag: "FREE",
      icon: Truck,
      enabled: area.serviceable,
    },
    {
      id: "DROP_TO_OFFICE" as PickupMethod,
      title: "Store Drop-off",
      tag: null,
      icon: Store,
      enabled: area.isDropToOfficeAvailable,
    },
  ];

  const pickDate = (iso: string) => {
    setDate(iso);
    setSlot(null);
  };

  const handleConfirm = () => {
    if (!method || !date || !slot) return;
    onConfirm({ method, date, slot });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Method */}
      <div className="grid gap-3 sm:grid-cols-1">
        {methods.map(({ id, title, tag, icon: Icon, enabled }) => {
          const selected = method === id;
          return (
            <button
              key={id}
              type="button"
              disabled={!enabled}
              onClick={() => {
                setMethod(id);
                setSlot(null);
              }}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-4 py-4 text-center transition ${
                selected
                  ? "border-[#0066FF] bg-[#EEF3FF]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <Icon
                size={20}
                className={selected ? "text-[#0066FF]" : "text-gray-500"}
              />
              <span className="text-lg font-bold text-gray-900">{title}</span>
              {enabled && tag && (
                <span className="text-[10px] font-bold text-emerald-600">
                  {tag}
                </span>
              )}
              {!enabled && (
                <span className="text-[10px] text-gray-500">
                  Not available for your pincode
                </span>
              )}
            </button>
          );
        })}
      </div>

      {method && (
        <>
          {/* Date */}
          <div>
            {todayHasSlot && (
              <span className="mb-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Fast Pickup Today
              </span>
            )}
            <p className="mb-2 text-xs font-semibold text-gray-700">
              Select Date
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible">
              {dates.map((d, i) => {
                const hasSlot = i !== 0 || todayHasSlot;
                const selected = date === d.iso;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    disabled={!hasSlot}
                    onClick={() => pickDate(d.iso)}
                    className={`flex min-w-[64px] shrink-0 flex-col items-center rounded-lg border px-2 py-2 transition sm:min-w-0 ${
                      selected
                        ? "border-[#0066FF] bg-[#FFF9E6]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } ${!hasSlot ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <span className="text-[10px] text-gray-500">{d.day}</span>
                    <span className="text-[11px] font-bold text-gray-900">
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-700">
              Select Time Slot
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SLOTS.map((s) => {
                const open = slotOpen(isToday, s.start);
                const selected = slot === s.label;
                return (
                  <button
                    key={s.label}
                    type="button"
                    disabled={!open}
                    onClick={() => setSlot(s.label)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      selected
                        ? "border-[#0066FF] bg-[#EEF3FF] text-[#0066FF]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    } ${!open ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        disabled={!method || !date || !slot}
        onClick={handleConfirm}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0066FF] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Confirm Pickup
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
