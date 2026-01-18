import { format, subDays, isSameDay } from "date-fns";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakDates: string[];
  lastCompletedDate: string | null;
}

interface DayData {
  date: string;
  hasCompletedTask: boolean;
}

/**
 * Calculate streak data from an array of day data
 * @param days - Array of { date: string, hasCompletedTask: boolean }
 * @returns StreakData object
 */
export function calculateStreak(days: DayData[]): StreakData {
  if (days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakDates: [],
      lastCompletedDate: null,
    };
  }

  // Sort days by date descending (most recent first)
  const sortedDays = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Find last completed date
  const lastCompleted = sortedDays.find((d) => d.hasCompletedTask);
  const lastCompletedDate = lastCompleted?.date || null;

  // Calculate current streak
  let currentStreak = 0;
  const streakDates: string[] = [];
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // Check if today counts (has completed task or it's still today)
  const todayData = sortedDays.find((d) => d.date === todayStr);
  const todayHasCompleted = todayData?.hasCompletedTask || false;

  // Start checking from today or yesterday
  let checkDate = today;
  if (!todayHasCompleted) {
    // If today has no completed tasks, start from yesterday
    checkDate = subDays(today, 1);
  }

  // Count consecutive days with completed tasks
  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, "yyyy-MM-dd");
    const dayData = sortedDays.find((d) => d.date === dateStr);

    if (dayData?.hasCompletedTask) {
      currentStreak++;
      streakDates.push(dateStr);
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  // Sort by date ascending for longest streak calculation
  const ascendingDays = [...sortedDays].reverse();

  for (const day of ascendingDays) {
    if (!day.hasCompletedTask) {
      tempStreak = 0;
      prevDate = null;
      continue;
    }

    const currentDate = new Date(day.date);

    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const expectedDate = subDays(currentDate, 1);
      if (isSameDay(prevDate, expectedDate)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }

    prevDate = currentDate;
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Include current streak in longest
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    streakDates: streakDates.reverse(), // Oldest first
    lastCompletedDate,
  };
}
