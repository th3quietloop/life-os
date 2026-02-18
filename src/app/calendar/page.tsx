"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Plus, Rows3 } from "lucide-react";
import { useCalendarStore } from "@/stores/useCalendarStore";
import MonthGrid from "@/components/calendar/MonthGrid";
import EventForm from "@/components/calendar/EventForm";
import Button from "@/components/ui/Button";
import { getMonthRange, addMonths, subMonths, format } from "@/lib/dateUtils";

export default function CalendarPage() {
  const { events, selectedDate, setSelectedDate, loadEvents, createEvent } =
    useCalendarStore();

  const [formOpen, setFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date | undefined>();

  useEffect(() => {
    const range = getMonthRange(selectedDate);
    // Extend range to include days from adjacent months shown in grid
    const extendedStart = range.start - 7 * 24 * 60 * 60 * 1000;
    const extendedEnd = range.end + 7 * 24 * 60 * 60 * 1000;
    loadEvents(extendedStart, extendedEnd);
  }, [selectedDate, loadEvents]);

  const handlePrev = () => setSelectedDate(subMonths(selectedDate, 1));
  const handleNext = () => setSelectedDate(addMonths(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-danger" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calendar/week">
            <Button variant="ghost" size="sm">
              <Rows3 size={16} /> Week
            </Button>
          </Link>
          <Button size="sm" onClick={() => { setFormDate(undefined); setFormOpen(true); }}>
            <Plus size={16} /> New Event
          </Button>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePrev}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNext}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <MonthGrid
        currentMonth={selectedDate}
        events={events}
        onDayClick={(date) => {
          setFormDate(date);
          setFormOpen(true);
        }}
      />

      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDate={formDate}
        onSubmit={(data) =>
          createEvent({
            title: data.title,
            description: data.description,
            color: data.color,
            startTime: data.startTime,
            endTime: data.endTime,
            isAllDay: data.isAllDay,
          })
        }
      />
    </div>
  );
}
