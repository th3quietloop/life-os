"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { PROJECT_COLORS } from "@/lib/constants";
import type { CalendarEvent } from "@/lib/types";
import { format } from "date-fns";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    color: string;
    startTime: number;
    endTime: number;
    isAllDay: boolean;
  }) => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
}

export default function EventForm({
  open,
  onClose,
  onSubmit,
  event,
  defaultDate,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setColor(event.color);
      setDate(format(new Date(event.start_time), "yyyy-MM-dd"));
      setStartTime(format(new Date(event.start_time), "HH:mm"));
      setEndTime(format(new Date(event.end_time), "HH:mm"));
      setIsAllDay(!!event.is_all_day);
    } else {
      setTitle("");
      setDescription("");
      setColor("#6366f1");
      setDate(defaultDate ? format(defaultDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
      setStartTime("09:00");
      setEndTime("10:00");
      setIsAllDay(false);
    }
  }, [event, defaultDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startDateTime = new Date(`${date}T${startTime}`).getTime();
    const endDateTime = new Date(`${date}T${endTime}`).getTime();

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      color,
      startTime: startDateTime,
      endTime: endDateTime,
      isAllDay,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={event ? "Edit Event" : "New Event"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Event name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="Details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            className="rounded"
          />
          All day
        </label>
        {!isAllDay && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-muted mb-2 block">Color</label>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  color === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">{event ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
