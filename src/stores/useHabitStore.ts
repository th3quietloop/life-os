"use client";

import { create } from "zustand";
import { api } from "@/lib/ipc";
import type { Habit, HabitCompletion, Goal, Milestone } from "@/lib/types";

interface HabitState {
  habits: Habit[];
  completions: Record<string, HabitCompletion[]>; // habitId -> completions
  goals: Goal[];
  milestones: Record<string, Milestone[]>; // goalId -> milestones
  isLoading: boolean;

  loadHabits: () => Promise<void>;
  createHabit: (data: Partial<Habit>) => Promise<void>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  loadCompletions: (habitId: string, startDate?: string, endDate?: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<boolean>;

  loadGoals: () => Promise<void>;
  createGoal: (data: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  loadMilestones: (goalId: string) => Promise<void>;
  createMilestone: (data: { goalId: string; title: string }) => Promise<void>;
  updateMilestone: (id: string, data: Partial<Milestone & { isCompleted: boolean }>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: {},
  goals: [],
  milestones: {},
  isLoading: false,

  loadHabits: async () => {
    set({ isLoading: true });
    const habits = await api.getHabits();
    set({ habits, isLoading: false });
  },

  createHabit: async (data) => {
    const habit = await api.createHabit(data);
    set((s) => ({ habits: [...s.habits, habit] }));
  },

  updateHabit: async (id, data) => {
    const updated = await api.updateHabit(id, data);
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? updated : h)),
    }));
  },

  deleteHabit: async (id) => {
    await api.deleteHabit(id);
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
  },

  loadCompletions: async (habitId, startDate, endDate) => {
    const completions = await api.getCompletions(habitId, startDate, endDate);
    set((s) => ({
      completions: { ...s.completions, [habitId]: completions },
    }));
  },

  toggleCompletion: async (habitId, date) => {
    const result = await api.toggleCompletion(habitId, date);
    // Reload completions for this habit
    await get().loadCompletions(habitId);
    return result.completed;
  },

  loadGoals: async () => {
    const goals = await api.getGoals();
    set({ goals });
  },

  createGoal: async (data) => {
    const goal = await api.createGoal(data);
    set((s) => ({ goals: [...s.goals, goal] }));
  },

  updateGoal: async (id, data) => {
    const updated = await api.updateGoal(id, data);
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? updated : g)),
    }));
  },

  deleteGoal: async (id) => {
    await api.deleteGoal(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },

  loadMilestones: async (goalId) => {
    const milestones = await api.getMilestones(goalId);
    set((s) => ({
      milestones: { ...s.milestones, [goalId]: milestones },
    }));
  },

  createMilestone: async (data) => {
    const ms = await api.createMilestone(data);
    set((s) => ({
      milestones: {
        ...s.milestones,
        [data.goalId]: [...(s.milestones[data.goalId] || []), ms],
      },
    }));
  },

  updateMilestone: async (id, data) => {
    const updated = await api.updateMilestone(id, data);
    set((s) => {
      const newMilestones = { ...s.milestones };
      for (const goalId of Object.keys(newMilestones)) {
        newMilestones[goalId] = newMilestones[goalId].map((m) =>
          m.id === id ? updated : m
        );
      }
      return { milestones: newMilestones };
    });
  },

  deleteMilestone: async (id) => {
    await api.deleteMilestone(id);
    set((s) => {
      const newMilestones = { ...s.milestones };
      for (const goalId of Object.keys(newMilestones)) {
        newMilestones[goalId] = newMilestones[goalId].filter((m) => m.id !== id);
      }
      return { milestones: newMilestones };
    });
  },
}));
