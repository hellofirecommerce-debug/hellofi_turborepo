/**
 * Rounds a price to the nearest 10 rupees.
 * Negative, zero or invalid values become 0.
 *
 *   10456 → 10460
 *   10454 → 10450
 *   10455 → 10460
 *   -250  → 0
 */
export function roundToNearestTen(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value / 10) * 10;
}
