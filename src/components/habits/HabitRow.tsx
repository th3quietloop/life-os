"use client";

import { motion } from "framer-motion";
import { Flame, Trash2 } from "lucide-react";
import { getLast7Days, calculateStreak } from "@/lib/streaks";
import type { Habit, HabitCompletion } from "@/lib/types";
import { format } from "date-fns";

interface HabitRowProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitRow({
  habit,
  completions,
  onToggle,
  onDelete,
}: HabitRowProps) {
  const days = getLast7Days();
  const completionDates = completions.map((c) => c.date);
  const streak = calculateStreak(completionDates);

  return (
    <div className="group flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-surface-hover transition-colors">
      {/* Habit info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          <span style={{ color: habit.color }} className="text-sm">
            {habit.icon === "circle-check" ? "✓" : habit.icon.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium truncate">{habit.name}</span>
      </div>

      {/* 7-day dots */}
      <div className="flex items-center gap-2">
        {days.map((day) => {
          const isCompleted = completionDates.includes(day);
          const isToday = day === format(new Date(), "yyyy-MM-dd");
          return (
            <button
              key={day}
              onClick={() => onToggle(habit.id, day)}
              className="relative"
              title={day}
            >
              <motion.div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? "border-transparent"
                    : isToday
                      ? "border-accent/40"
                      : "border-border"
                }`}
                style={
                  isCompleted
                    ? { backgroundColor: habit.color }
                    : undefined
                }
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white text-xs"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 min-w-[60px] justify-end">
        {streak.current > 0 && (
          <>
            <Flame size={14} className="text-warning" />
            <span className="text-sm font-semibold text-warning">
              {streak.current}
            </span>
          </>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
