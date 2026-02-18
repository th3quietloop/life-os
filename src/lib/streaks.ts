import { format, subDays, differenceInDays } from "date-fns";

export function calculateStreak(
  completionDates: string[],
  today: Date = new Date()
): { current: number; longest: number; total: number } {
  if (completionDates.length === 0) return { current: 0, longest: 0, total: 0 };

  const sorted = [...new Set(completionDates)].sort().reverse();
  const todayStr = format(today, "yyyy-MM-dd");
  const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");

  // Current streak
  let current = 0;
  if (sorted[0] === todayStr || sorted[0] === yesterdayStr) {
    const startDate = sorted[0] === todayStr ? today : subDays(today, 1);
    current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const expected = format(subDays(startDate, i), "yyyy-MM-dd");
      if (sorted[i] === expected) {
        current++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longest = 0;
  let tempStreak = 1;
  const ascending = [...sorted].reverse();
  for (let i = 1; i < ascending.length; i++) {
    const diff = differenceInDays(
      new Date(ascending[i]),
      new Date(ascending[i - 1])
    );
    if (diff === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  return { current, longest, total: sorted.length };
}

export function getLast7Days(today: Date = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(today, 6 - i), "yyyy-MM-dd")
  );
}

export function getCompletionRate(
  completionDates: string[],
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  const uniqueDates = new Set(completionDates);
  return Math.round((uniqueDates.size / totalDays) * 100);
}
