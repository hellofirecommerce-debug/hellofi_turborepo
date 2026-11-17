import type { ConfirmedOrder } from "./types";

const suffix = (d: number) => {
  if (d >= 11 && d <= 13) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const utcDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

// "8th Aug, Saturday"
export function longDate(iso: string) {
  const d = utcDate(iso);
  const month = d.toLocaleDateString("en-IN", {
    month: "short",
    timeZone: "UTC",
  });
  const weekday = d.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "UTC",
  });
  const day = d.getUTCDate();
  return `${day}${suffix(day)} ${month}, ${weekday}`;
}

// "08 Aug 2024"
export const shortDate = (iso: string) =>
  utcDate(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// "Sat"
export const weekdayShort = (iso: string) =>
  utcDate(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "UTC",
  });

// "06 Aug 2024, 10:24 AM" (IST)
export const createdAtLabel = (isoDateTime: string) =>
  new Date(isoDateTime)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());

// date + slot, whichever mode the user chose
export function scheduleOf(order: ConfirmedOrder) {
  return order.isDropToOffice
    ? {
        date: order.dropToOfficeISODate ?? null,
        slot: order.dropToOfficeSlotTimings ?? null,
      }
    : {
        date: order.pickupISODate ?? null,
        slot: order.pickupSlot ?? null,
      };
}
