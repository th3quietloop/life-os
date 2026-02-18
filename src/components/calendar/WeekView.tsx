"use client";

import { getWeekDays, getHourSlots, format, isToday, isSameDay } from "@/lib/dateUtils";
import type { CalendarEvent } from "@/lib/types";

interface WeekViewProps {
  currentWeek: Date;
  events: CalendarEvent[];
  onSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({
  currentWeek,
  events,
  onSlotClick,
  onEventClick,
}: WeekViewProps) {
  const days = getWeekDays(currentWeek);
  const hours = getHourSlots();

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = ((startHour - 6) / 18) * 100;
    const height = ((endHour - startHour) / 18) * 100;
    return { top: `${top}%`, height: `${Math.max(height, 2)}%` };
  };

  const now = new Date();
  const currentHourFraction = now.getHours() + now.getMinutes() / 60;
  const nowIndicatorTop = ((currentHourFraction - 6) / 18) * 100;

  return (
    <div className="flex border border-border rounded-xl overflow-hidden bg-surface">
      {/* Time labels */}
      <div className="w-16 shrink-0 border-r border-border">
        <div className="h-12 border-b border-border" />
        <div className="relative" style={{ height: `${hours.length * 48}px` }}>
          {hours.map((hour, i) => (
            <div
              key={hour}
              className="absolute text-[10px] text-muted text-right pr-2 w-full"
              style={{ top: `${(i / hours.length) * 100}%`, transform: "translateY(-50%)" }}
            >
              {format(new Date(`2000-01-01T${hour}`), "h a")}
            </div>
          ))}
        </div>
      </div>

      {/* Day columns */}
      {days.map((day) => {
        const dayEvents = events.filter((e) =>
          isSameDay(new Date(e.start_time), day)
        );
        const today = isToday(day);

        return (
          <div key={day.toISOString()} className="flex-1 border-r border-border last:border-r-0">
            {/* Day header */}
            <div
              className={`h-12 flex flex-col items-center justify-center border-b border-border ${
                today ? "bg-accent/5" : ""
              }`}
            >
              <span className="text-[10px] text-muted uppercase">
                {format(day, "EEE")}
              </span>
              <span
                className={`text-sm font-semibold ${
                  today ? "text-accent" : ""
                }`}
              >
                {format(day, "d")}
              </span>
            </div>

            {/* Hour grid + events */}
            <div className="relative" style={{ height: `${hours.length * 48}px` }}>
              {/* Hour gridlines */}
              {hours.map((hour, i) => (
                <div
                  key={hour}
                  className="absolute w-full border-b border-border/50 cursor-pointer hover:bg-accent/5 transition-colors"
                  style={{
                    top: `${(i / hours.length) * 100}%`,
                    height: `${(1 / hours.length) * 100}%`,
                  }}
                  onClick={() => onSlotClick(day, parseInt(hour))}
                />
              ))}

              {/* Events */}
              {dayEvents.map((event) => {
                const pos = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-white text-[10px] font-medium overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      top: pos.top,
                      height: pos.height,
                      backgroundColor: event.color,
                      minHeight: "20px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                );
              })}

              {/* Current time indicator */}
              {today && nowIndicatorTop >= 0 && nowIndicatorTop <= 100 && (
                <div
                  className="absolute left-0 right-0 z-10 pointer-events-none"
                  style={{ top: `${nowIndicatorTop}%` }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-danger -ml-1" />
                    <div className="flex-1 h-[2px] bg-danger" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
