"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Plus, Grid3X3 } from "lucide-react";
import { useCalendarStore } from "@/stores/useCalendarStore";
import WeekView from "@/components/calendar/WeekView";
import EventForm from "@/components/calendar/EventForm";
import Button from "@/components/ui/Button";
import { getWeekRange, addWeeks, subWeeks, format, startOfWeek } from "@/lib/dateUtils";
import type { CalendarEvent } from "@/lib/types";

export default function WeekViewPage() {
  const { events, selectedDate, setSelectedDate, loadEvents, createEvent, updateEvent } =
    useCalendarStore();

  const [formOpen, setFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const range = getWeekRange(selectedDate);
    loadEvents(range.start, range.end);
  }, [selectedDate, loadEvents]);

  const handlePrev = () => setSelectedDate(subWeeks(selectedDate, 1));
  const handleNext = () => setSelectedDate(addWeeks(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-danger" />
          <h1 className="text-2xl font-bold">Week View</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calendar">
            <Button variant="ghost" size="sm">
              <Grid3X3 size={16} /> Month
            </Button>
          </Link>
          <Button size="sm" onClick={() => { setEditingEvent(null); setFormDate(undefined); setFormOpen(true); }}>
            <Plus size={16} /> New Event
          </Button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(weekStart, "MMM d")} - {format(new Date(weekStart.getTime() + 6 * 86400000), "MMM d, yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleToday}>Today</Button>
          <Button variant="ghost" size="sm" onClick={handlePrev}><ChevronLeft size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={handleNext}><ChevronRight size={16} /></Button>
        </div>
      </div>

      <WeekView
        currentWeek={selectedDate}
        events={events}
        onSlotClick={(date, hour) => {
          const d = new Date(date);
          d.setHours(hour, 0, 0, 0);
          setFormDate(d);
          setEditingEvent(null);
          setFormOpen(true);
        }}
        onEventClick={(event) => {
          setEditingEvent(event);
          setFormOpen(true);
        }}
      />

      <EventForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingEvent(null); }}
        event={editingEvent}
        defaultDate={formDate}
        onSubmit={(data) => {
          if (editingEvent) {
            updateEvent(editingEvent.id, {
              title: data.title,
              description: data.description,
              color: data.color,
              start_time: data.startTime,
              end_time: data.endTime,
              is_all_day: data.isAllDay ? 1 : 0,
            });
          } else {
            createEvent({
              title: data.title,
              description: data.description,
              color: data.color,
              startTime: data.startTime,
              endTime: data.endTime,
              isAllDay: data.isAllDay,
            });
          }
        }}
      />
    </div>
  );
}
