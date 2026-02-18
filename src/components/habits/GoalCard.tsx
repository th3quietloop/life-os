"use client";

import { motion } from "framer-motion";
import { Target, Check, Trash2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { Goal, Milestone } from "@/lib/types";

interface GoalCardProps {
  goal: Goal;
  milestones: Milestone[];
  onToggleMilestone: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
}

export default function GoalCard({
  goal,
  milestones,
  onToggleMilestone,
  onDelete,
  onAddMilestone,
}: GoalCardProps) {
  const completedCount = milestones.filter((m) => m.is_completed).length;
  const totalCount = milestones.length;
  const progress =
    goal.progress_type === "milestones"
      ? totalCount > 0
        ? (completedCount / totalCount) * 100
        : 0
      : goal.progress_type === "numeric"
        ? goal.target_value > 0
          ? (goal.current_value / goal.target_value) * 100
          : 0
        : goal.current_value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border border-border bg-surface p-5 hover:border-accent/20 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <Target size={16} style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            {goal.target_date && (
              <p className="text-[10px] text-muted">
                {formatDistanceToNow(new Date(goal.target_date), { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {goal.description && (
        <p className="text-xs text-muted mb-3 line-clamp-2">{goal.description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </div>
      </div>

      {/* Milestones */}
      {goal.progress_type === "milestones" && (
        <div className="space-y-1.5">
          {milestones.map((ms) => (
            <button
              key={ms.id}
              onClick={() => onToggleMilestone(ms.id, !ms.is_completed)}
              className="flex items-center gap-2 w-full text-left group/ms"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                  ms.is_completed
                    ? "border-success bg-success"
                    : "border-border group-hover/ms:border-accent"
                }`}
              >
                {ms.is_completed && <Check size={10} className="text-white" />}
              </div>
              <span
                className={`text-xs ${
                  ms.is_completed ? "line-through text-muted" : "text-foreground"
                }`}
              >
                {ms.title}
              </span>
            </button>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem(
                "milestone"
              ) as HTMLInputElement;
              if (input.value.trim()) {
                onAddMilestone(goal.id, input.value.trim());
                input.value = "";
              }
            }}
          >
            <input
              name="milestone"
              placeholder="+ Add milestone..."
              className="w-full text-xs px-6 py-1 bg-transparent text-muted placeholder:text-muted/40 focus:outline-none focus:text-foreground"
            />
          </form>
        </div>
      )}
    </motion.div>
  );
}
