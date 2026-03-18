import { describe, it, expect, vi, afterEach } from "vitest";
import { format, subDays } from "date-fns";
import { calculateStreak } from "@/lib/utils/streak";

function makeDay(date: Date, hasCompletedTask: boolean) {
  return { date: format(date, "yyyy-MM-dd"), hasCompletedTask };
}

describe("calculateStreak", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns zeros for empty input", () => {
    const result = calculateStreak([]);
    expect(result).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      streakDates: [],
      lastCompletedDate: null,
    });
  });

  it("returns streak of 1 for a single completed day (today)", () => {
    vi.useFakeTimers();
    const today = new Date(2024, 2, 15);
    vi.setSystemTime(today);

    const result = calculateStreak([makeDay(today, true)]);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.lastCompletedDate).toBe("2024-03-15");
  });

  it("calculates consecutive day streaks correctly", () => {
    vi.useFakeTimers();
    const today = new Date(2024, 2, 15);
    vi.setSystemTime(today);

    const days = [
      makeDay(subDays(today, 2), true),
      makeDay(subDays(today, 1), true),
      makeDay(today, true),
    ];

    const result = calculateStreak(days);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("breaks streak on gap days", () => {
    vi.useFakeTimers();
    const today = new Date(2024, 2, 15);
    vi.setSystemTime(today);

    const days = [
      makeDay(subDays(today, 4), true),
      makeDay(subDays(today, 3), true),
      // gap on day -2
      makeDay(subDays(today, 1), true),
      makeDay(today, true),
    ];

    const result = calculateStreak(days);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });

  it("tracks longest streak separately from current", () => {
    vi.useFakeTimers();
    const today = new Date(2024, 2, 15);
    vi.setSystemTime(today);

    const days = [
      makeDay(subDays(today, 9), true),
      makeDay(subDays(today, 8), true),
      makeDay(subDays(today, 7), true),
      makeDay(subDays(today, 6), true),
      // gap
      makeDay(subDays(today, 1), true),
      makeDay(today, true),
    ];

    const result = calculateStreak(days);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(4);
  });
});
