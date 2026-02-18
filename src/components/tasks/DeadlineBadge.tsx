"use client";

import { Clock } from "lucide-react";
import { formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

interface DeadlineBadgeProps {
  dueDate: number;
}

export default function DeadlineBadge({ dueDate }: DeadlineBadgeProps) {
  const date = new Date(dueDate);
  const overdue = isPast(date) && !isToday(date);

  let text: string;
  if (isToday(date)) {
    text = "Today";
  } else if (isTomorrow(date)) {
    text = "Tomorrow";
  } else if (overdue) {
    text = formatDistanceToNow(date, { addSuffix: false }) + " ago";
  } else {
    text = formatDistanceToNow(date, { addSuffix: false });
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
        overdue
          ? "bg-danger/10 text-danger border border-danger/20"
          : isToday(date)
            ? "bg-warning/10 text-warning border border-warning/20"
            : "bg-surface-hover text-muted border border-border"
      }`}
    >
      <Clock size={10} />
      {text}
    </span>
  );
}
