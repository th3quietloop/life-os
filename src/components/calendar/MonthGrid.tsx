"use client";

import { motion } from "framer-motion";
import { getMonthDays, isSameDay, isSameMonth, isToday, format } from "@/lib/dateUtils";
import type { CalendarEvent } from "@/lib/types";

interface MonthGridProps {
  currentMonth: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthGrid({
  currentMonth,
  events,
  onDayClick,
}: MonthGridProps) {
  const days = getMonthDays(currentMonth);

  const getEventsForDay = (day: Date) =>
    events.filter(
      (e) =>
        isSameDay(new Date(e.start_time), day) ||
        (new Date(e.start_time) <= day && new Date(e.end_time) >= day)
    );

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-muted py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 border-t border-l border-border">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              whileHover={{ backgroundColor: "var(--surface-hover)" }}
              className={`relative min-h-[100px] p-2 border-r border-b border-border text-left transition-colors ${
                !inMonth ? "opacity-30" : ""
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  today
                    ? "bg-accent text-white"
                    : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* Event chips */}
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-[10px] px-1.5 py-0.5 rounded truncate text-white font-medium"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-muted px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
