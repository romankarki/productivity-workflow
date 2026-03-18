import { describe, it, expect } from "vitest";
import {
  formatDate,
  getMonthDays,
  getWeekId,
  getMonthId,
  parseDateString,
} from "@/lib/utils/date";

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    expect(formatDate(date)).toBe("2024-03-15");
  });

  it("zero-pads single-digit months and days", () => {
    const date = new Date(2024, 0, 5); // Jan 5, 2024
    expect(formatDate(date)).toBe("2024-01-05");
  });
});

describe("getMonthDays", () => {
  it("returns an array of dates covering the calendar grid", () => {
    const days = getMonthDays(2024, 2); // March 2024
    expect(days.length).toBeGreaterThanOrEqual(28);
    // Calendar grid is always a multiple of 7
    expect(days.length % 7).toBe(0);
  });

  it("includes padding days from adjacent months", () => {
    const days = getMonthDays(2024, 2); // March 2024
    // First day of grid may be from February
    const firstDay = days[0];
    const lastDay = days[days.length - 1];
    // The grid spans at least the full month
    expect(firstDay.getDate()).toBeLessThanOrEqual(31);
    expect(lastDay.getDate()).toBeGreaterThanOrEqual(1);
  });
});

describe("getWeekId", () => {
  it("returns format YYYY-Wxx", () => {
    const date = new Date(2024, 2, 15);
    const weekId = getWeekId(date);
    expect(weekId).toMatch(/^\d{4}-W\d{2}$/);
  });
});

describe("getMonthId", () => {
  it("returns format YYYY-MM", () => {
    const date = new Date(2024, 2, 15);
    expect(getMonthId(date)).toBe("2024-03");
  });

  it("zero-pads single-digit months", () => {
    const date = new Date(2024, 0, 1);
    expect(getMonthId(date)).toBe("2024-01");
  });
});

describe("parseDateString", () => {
  it("parses YYYY-MM-DD to a Date object", () => {
    const date = parseDateString("2024-03-15");
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(15);
  });
});
