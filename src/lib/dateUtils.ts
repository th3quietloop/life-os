import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  addWeeks,
  subWeeks,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";

export function getMonthDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function getMonthRange(date: Date): { start: number; end: number } {
  return {
    start: startOfMonth(date).getTime(),
    end: endOfMonth(date).getTime(),
  };
}

export function getWeekRange(date: Date): { start: number; end: number } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }).getTime(),
    end: endOfWeek(date, { weekStartsOn: 0 }).getTime(),
  };
}

export function getDayRange(date: Date): { start: number; end: number } {
  return {
    start: startOfDay(date).getTime(),
    end: endOfDay(date).getTime(),
  };
}

export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), "h:mm a");
}

export function formatDateRange(start: number, end: number): string {
  const s = new Date(start);
  const e = new Date(end);
  if (isSameDay(s, e)) {
    return `${format(s, "h:mm a")} - ${format(e, "h:mm a")}`;
  }
  return `${format(s, "MMM d, h:mm a")} - ${format(e, "MMM d, h:mm a")}`;
}

export function getHourSlots(): string[] {
  return Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6; // 6am to 11pm
    return `${hour.toString().padStart(2, "0")}:00`;
  });
}

export { addMonths, subMonths, addWeeks, subWeeks, isSameDay, isSameMonth, isToday, format, startOfWeek };
