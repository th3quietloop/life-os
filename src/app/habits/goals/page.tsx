"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, Plus, Flame } from "lucide-react";
import { useHabitStore } from "@/stores/useHabitStore";
import GoalCard from "@/components/habits/GoalCard";
import GoalForm from "@/components/habits/GoalForm";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function GoalsPage() {
  const {
    goals,
    milestones,
    loadGoals,
    createGoal,
    deleteGoal,
    loadMilestones,
    createMilestone,
    updateMilestone,
  } = useHabitStore();

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    goals.forEach((g) => loadMilestones(g.id));
  }, [goals, loadMilestones]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target size={28} className="text-accent" />
          <h1 className="text-2xl font-bold">Goals</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/habits">
            <Button variant="ghost" size="sm">
              <Flame size={16} /> Habits
            </Button>
          </Link>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> New Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={<Target size={48} />}
          title="No goals yet"
          description="Set your first goal and start tracking progress"
          action={
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus size={16} /> New Goal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals
            .filter((g) => g.status === "active")
            .map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                milestones={milestones[goal.id] || []}
                onToggleMilestone={(id, isCompleted) =>
                  updateMilestone(id, { isCompleted })
                }
                onDelete={deleteGoal}
                onAddMilestone={(goalId, title) =>
                  createMilestone({ goalId, title })
                }
              />
            ))}
        </div>
      )}

      <GoalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) =>
          createGoal({
            title: data.title,
            description: data.description,
            color: data.color,
            progress_type: data.progressType,
            target_date: data.targetDate,
            target_value: data.targetValue,
          } as never)
        }
      />
    </div>
  );
}
