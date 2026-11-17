export const PICKUP_SLOTS = [
  "09:00 AM - 12:00 PM",
  "12:00 PM - 03:00 PM",
  "03:00 PM - 06:00 PM",
  "06:00 PM - 09:00 PM",
] as const;

// start hour of each slot, same order as PICKUP_SLOTS
export const SLOT_START_HOURS = [9, 12, 15, 18] as const;

export const PICKUP_WINDOW_DAYS = 7; // today + next 6 days
export const SAME_DAY_BUFFER_HOURS = 2; // today's slot must start >= now + 2h
