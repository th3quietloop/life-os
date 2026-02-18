"use client";

import { PRIORITY_COLORS } from "@/lib/constants";
import type { TaskPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (priority === "none") return null;

  const color = PRIORITY_COLORS[priority];
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {priority}
    </span>
  );
}
