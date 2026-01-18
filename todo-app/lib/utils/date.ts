import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday as dateFnsIsToday,
  addMonths,
  subMonths,
  getWeek,
  parseISO,
} from "date-fns";

/**
 * Get all days to display in a month calendar view
 * Includes padding days from previous/next months
 */
export function getMonthDays(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 }); // Sunday start
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end });
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Format date to display string (e.g., "January 2024")
 */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

/**
 * Check if two dates are the same day
 */
export function isSameDayUtil(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Check if a date is in the given month
 */
export function isInMonth(date: Date, month: Date): boolean {
  return isSameMonth(date, month);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return dateFnsIsToday(date);
}

/**
 * Get the week number of a date
 */
export function getWeekNumber(date: Date): number {
  return getWeek(date);
}

/**
 * Get the next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

/**
 * Get the previous month
 */
export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

/**
 * Parse a date string (YYYY-MM-DD) to Date object
 */
export function parseDateString(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Get week identifier string (e.g., "2024-W12")
 */
export function getWeekId(date: Date): string {
  const year = date.getFullYear();
  const week = getWeek(date);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

/**
 * Get month identifier string (e.g., "2024-03")
 */
export function getMonthId(date: Date): string {
  return format(date, "yyyy-MM");
}
