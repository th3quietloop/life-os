"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Plus, Target } from "lucide-react";
import { format } from "date-fns";
import { useHabitStore } from "@/stores/useHabitStore";
import { getLast7Days } from "@/lib/streaks";
import HabitRow from "@/components/habits/HabitRow";
import HabitForm from "@/components/habits/HabitForm";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function HabitsPage() {
  const {
    habits,
    completions,
    isLoading,
    loadHabits,
    createHabit,
    deleteHabit,
    loadCompletions,
    toggleCompletion,
  } = useHabitStore();

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Load completions for all habits when habits change
  useEffect(() => {
    habits.forEach((h) => loadCompletions(h.id));
  }, [habits, loadCompletions]);

  const days = getLast7Days();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Flame size={28} className="text-success" />
          <h1 className="text-2xl font-bold">Habits</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/habits/goals">
            <Button variant="ghost" size="sm">
              <Target size={16} /> Goals
            </Button>
          </Link>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> New Habit
          </Button>
        </div>
      </div>

      {/* Day headers */}
      {habits.length > 0 && (
        <div className="flex items-center gap-4 px-4 mb-2">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {days.map((day) => (
              <div
                key={day}
                className={`w-7 text-center text-[10px] font-medium ${
                  day === format(new Date(), "yyyy-MM-dd")
                    ? "text-accent"
                    : "text-muted"
                }`}
              >
                {format(new Date(day + "T12:00:00"), "EEE").charAt(0)}
              </div>
            ))}
          </div>
          <div className="min-w-[60px]" />
          <div className="w-6" />
        </div>
      )}

      {/* Habit list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={<Flame size={48} />}
          title="No habits yet"
          description="Start building positive habits by creating your first one"
          action={
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus size={16} /> New Habit
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              completions={completions[habit.id] || []}
              onToggle={toggleCompletion}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      <HabitForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => createHabit(data)}
      />
    </div>
  );
}
