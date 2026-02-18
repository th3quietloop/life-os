"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  BookOpen,
  Calendar,
  Target,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useTaskStore } from "@/stores/useTaskStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { useJournalStore } from "@/stores/useJournalStore";
import { useCalendarStore } from "@/stores/useCalendarStore";
import Button from "@/components/ui/Button";
import { MOOD_EMOJIS } from "@/lib/constants";
import { getLast7Days, calculateStreak } from "@/lib/streaks";
import { getDayRange } from "@/lib/dateUtils";

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loadTasks } = useTaskStore();
  const { habits, completions, goals, loadHabits, loadCompletions, toggleCompletion, loadGoals } =
    useHabitStore();
  const { entries, loadEntries, createEntry } = useJournalStore();
  const { events, loadEvents } = useCalendarStore();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    loadTasks({});
    loadHabits();
    loadGoals();
    loadEntries();
    const dayRange = getDayRange(new Date());
    loadEvents(dayRange.start, dayRange.end);
  }, [loadTasks, loadHabits, loadGoals, loadEntries, loadEvents]);

  useEffect(() => {
    habits.forEach((h) => loadCompletions(h.id));
  }, [habits, loadCompletions]);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todoTasks = tasks.filter((t) => t.status === "todo" || t.status === "in_progress");
  const doneTodayCount = tasks.filter((t) => t.status === "done" && t.completed_at && format(new Date(t.completed_at), "yyyy-MM-dd") === todayStr).length;
  const activeGoals = goals.filter((g) => g.status === "active");

  const handleNewJournal = async () => {
    const entry = await createEntry({ date: todayStr });
    router.push("/journal");
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-accent" />
          <h1 className="text-2xl font-bold">{greeting}</h1>
        </div>
        <p className="text-muted">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Tasks due",
            value: todoTasks.length,
            sub: `${doneTodayCount} done today`,
            icon: CheckSquare,
            color: "text-accent",
            bg: "bg-accent/10",
          },
          {
            label: "Habits today",
            value: habits.filter((h) => {
              const c = completions[h.id] || [];
              return c.some((cc) => cc.date === todayStr);
            }).length,
            sub: `of ${habits.length}`,
            icon: Flame,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "Active goals",
            value: activeGoals.length,
            sub: "in progress",
            icon: Target,
            color: "text-accent-glow",
            bg: "bg-accent/10",
          },
          {
            label: "Events today",
            value: events.length,
            sub: "scheduled",
            icon: Calendar,
            color: "text-danger",
            bg: "bg-danger/10",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={`rounded-xl border border-border p-4 ${stat.bg}`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-[10px] text-muted">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <CheckSquare size={16} className="text-accent" />
              Tasks
            </h2>
            <Link href="/tasks">
              <span className="text-xs text-muted hover:text-accent flex items-center gap-1">
                View all <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {todoTasks.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">All caught up!</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {todoTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === "urgent" ? "bg-danger" :
                    task.priority === "high" ? "bg-warning" :
                    "bg-accent"
                  }`} />
                  <span className="text-sm truncate flex-1">{task.title}</span>
                </div>
              ))}
              {todoTasks.length > 5 && (
                <p className="text-xs text-muted">+{todoTasks.length - 5} more</p>
              )}
            </div>
          )}
        </div>

        {/* Habits Quick Check */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Flame size={16} className="text-success" />
              Today&apos;s Habits
            </h2>
            <Link href="/habits">
              <span className="text-xs text-muted hover:text-accent flex items-center gap-1">
                View all <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">No habits yet</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {habits.map((habit) => {
                const isComplete = (completions[habit.id] || []).some(
                  (c) => c.date === todayStr
                );
                const streak = calculateStreak(
                  (completions[habit.id] || []).map((c) => c.date)
                );
                return (
                  <motion.button
                    key={habit.id}
                    onClick={() => toggleCompletion(habit.id, todayStr)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isComplete
                        ? "border-success/30 bg-success/10"
                        : "border-border hover:border-accent/30"
                    }`}
                  >
                    <span className={`text-sm ${isComplete ? "line-through text-muted" : ""}`}>
                      {habit.name}
                    </span>
                    {streak.current > 0 && (
                      <span className="text-[10px] text-warning font-semibold">
                        {streak.current} 🔥
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Journal */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen size={16} className="text-warning" />
              Journal
            </h2>
            <Link href="/journal">
              <span className="text-xs text-muted hover:text-accent flex items-center gap-1">
                View all <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {entries.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted mb-3">No entries yet</p>
              <Button size="sm" onClick={handleNewJournal}>
                <Plus size={14} /> Write Today
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 3).map((entry) => (
                <Link key={entry.id} href="/journal">
                  <div className="flex items-start gap-3 py-1.5 hover:bg-surface-hover rounded px-2 -mx-2 transition-colors">
                    {entry.mood && (
                      <span className="text-sm mt-0.5">{MOOD_EMOJIS[entry.mood]}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {entry.title || format(new Date(entry.date + "T12:00:00"), "MMMM d")}
                      </p>
                      <p className="text-xs text-muted truncate">{entry.plain_text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Today's Events */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar size={16} className="text-danger" />
              Today&apos;s Events
            </h2>
            <Link href="/calendar">
              <span className="text-xs text-muted hover:text-accent flex items-center gap-1">
                View all <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">No events today</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-1.5">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-[10px] text-muted">
                      {format(new Date(event.start_time), "h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
