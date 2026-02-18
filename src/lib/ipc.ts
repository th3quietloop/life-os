import type { ElectronAPI } from "./types";

// In-memory fallback store for browser dev mode (when not running in Electron)
const memoryStore: Record<string, unknown[]> = {
  tasks: [],
  projects: [],
  habits: [],
  habitCompletions: [],
  goals: [],
  milestones: [],
  journalEntries: [],
  events: [],
  routines: [],
};

const settings: Record<string, string> = {
  theme: "dark",
  sidebarCollapsed: "false",
};

let idCounter = 0;
function fakeId() {
  return `fake-${++idCounter}-${Date.now()}`;
}

function createBrowserFallback(): ElectronAPI {
  return {
    // Tasks
    getTasks: async () => memoryStore.tasks as never[],
    createTask: async (data) => {
      const task = { id: fakeId(), ...data, created_at: Date.now(), updated_at: Date.now(), tags: "[]", sort_order: 0, kanban_column: data.kanbanColumn || "todo", status: data.status || "todo", priority: data.priority || "none", project_id: data.projectId || null, due_date: data.dueDate || null, completed_at: null, description: data.description || "", title: data.title };
      memoryStore.tasks.push(task);
      return task as never;
    },
    updateTask: async (id, data) => {
      const idx = memoryStore.tasks.findIndex((t: unknown) => (t as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.tasks[idx] as object, data, { updated_at: Date.now() });
      return memoryStore.tasks[idx] as never;
    },
    deleteTask: async (id) => {
      memoryStore.tasks = memoryStore.tasks.filter((t: unknown) => (t as { id: string }).id !== id);
      return { success: true };
    },

    // Projects
    getProjects: async () => memoryStore.projects as never[],
    createProject: async (data) => {
      const project = { id: fakeId(), name: "", description: "", color: "#6366f1", icon: "folder", status: "active", sort_order: 0, created_at: Date.now(), updated_at: Date.now(), ...data };
      memoryStore.projects.push(project);
      return project as never;
    },
    updateProject: async (id, data) => {
      const idx = memoryStore.projects.findIndex((p: unknown) => (p as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.projects[idx] as object, data);
      return memoryStore.projects[idx] as never;
    },
    deleteProject: async (id) => {
      memoryStore.projects = memoryStore.projects.filter((p: unknown) => (p as { id: string }).id !== id);
      return { success: true };
    },

    // Habits
    getHabits: async () => memoryStore.habits as never[],
    createHabit: async (data) => {
      const habit = { id: fakeId(), name: "", description: "", icon: "circle-check", color: "#22c55e", frequency: "daily", custom_days: "[]", target_count: 1, is_archived: 0, sort_order: 0, created_at: Date.now(), ...data };
      memoryStore.habits.push(habit);
      return habit as never;
    },
    updateHabit: async (id, data) => {
      const idx = memoryStore.habits.findIndex((h: unknown) => (h as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.habits[idx] as object, data);
      return memoryStore.habits[idx] as never;
    },
    deleteHabit: async (id) => {
      memoryStore.habits = memoryStore.habits.filter((h: unknown) => (h as { id: string }).id !== id);
      return { success: true };
    },
    getCompletions: async () => memoryStore.habitCompletions as never[],
    toggleCompletion: async (habitId, date) => {
      const idx = memoryStore.habitCompletions.findIndex((c: unknown) => (c as { habit_id: string; date: string }).habit_id === habitId && (c as { date: string }).date === date);
      if (idx >= 0) {
        memoryStore.habitCompletions.splice(idx, 1);
        return { completed: false };
      }
      memoryStore.habitCompletions.push({ id: fakeId(), habit_id: habitId, date, count: 1, created_at: Date.now() });
      return { completed: true };
    },

    // Goals
    getGoals: async () => memoryStore.goals as never[],
    createGoal: async (data) => {
      const goal = { id: fakeId(), title: "", description: "", color: "#818cf8", target_date: null, status: "active", progress_type: "milestones", current_value: 0, target_value: 100, created_at: Date.now(), updated_at: Date.now(), ...data };
      memoryStore.goals.push(goal);
      return goal as never;
    },
    updateGoal: async (id, data) => {
      const idx = memoryStore.goals.findIndex((g: unknown) => (g as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.goals[idx] as object, data);
      return memoryStore.goals[idx] as never;
    },
    deleteGoal: async (id) => {
      memoryStore.goals = memoryStore.goals.filter((g: unknown) => (g as { id: string }).id !== id);
      return { success: true };
    },
    getMilestones: async (goalId) => memoryStore.milestones.filter((m: unknown) => (m as { goal_id: string }).goal_id === goalId) as never[],
    createMilestone: async (data) => {
      const ms = { id: fakeId(), goal_id: data.goalId, title: data.title, is_completed: 0, completed_at: null, sort_order: data.sortOrder || 0 };
      memoryStore.milestones.push(ms);
      return ms as never;
    },
    updateMilestone: async (id, data) => {
      const idx = memoryStore.milestones.findIndex((m: unknown) => (m as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.milestones[idx] as object, data);
      return memoryStore.milestones[idx] as never;
    },
    deleteMilestone: async (id) => {
      memoryStore.milestones = memoryStore.milestones.filter((m: unknown) => (m as { id: string }).id !== id);
      return { success: true };
    },

    // Journal
    getEntries: async () => memoryStore.journalEntries as never[],
    getEntry: async (id) => memoryStore.journalEntries.find((e: unknown) => (e as { id: string }).id === id) as never ?? null,
    createEntry: async (data) => {
      const entry = { id: fakeId(), title: "", content: "", plain_text: "", mood: null, tags: "[]", is_favorite: 0, created_at: Date.now(), updated_at: Date.now(), ...data };
      memoryStore.journalEntries.push(entry);
      return entry as never;
    },
    updateEntry: async (id, data) => {
      const idx = memoryStore.journalEntries.findIndex((e: unknown) => (e as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.journalEntries[idx] as object, data, { updated_at: Date.now() });
      return memoryStore.journalEntries[idx] as never;
    },
    deleteEntry: async (id) => {
      memoryStore.journalEntries = memoryStore.journalEntries.filter((e: unknown) => (e as { id: string }).id !== id);
      return { success: true };
    },

    // Calendar
    getEvents: async () => memoryStore.events as never[],
    createEvent: async (data) => {
      const event = { id: fakeId(), description: "", color: "#6366f1", is_all_day: 0, is_time_block: 0, linked_task_id: null, created_at: Date.now(), updated_at: Date.now(), ...data };
      memoryStore.events.push(event);
      return event as never;
    },
    updateEvent: async (id, data) => {
      const idx = memoryStore.events.findIndex((e: unknown) => (e as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.events[idx] as object, data);
      return memoryStore.events[idx] as never;
    },
    deleteEvent: async (id) => {
      memoryStore.events = memoryStore.events.filter((e: unknown) => (e as { id: string }).id !== id);
      return { success: true };
    },
    getRoutines: async () => memoryStore.routines as never[],
    createRoutine: async (data) => {
      const routine = { id: fakeId(), description: "", color: "#f97316", days_of_week: "[1,2,3,4,5]", is_active: 1, created_at: Date.now(), ...data };
      memoryStore.routines.push(routine);
      return routine as never;
    },
    updateRoutine: async (id, data) => {
      const idx = memoryStore.routines.findIndex((r: unknown) => (r as { id: string }).id === id);
      if (idx >= 0) Object.assign(memoryStore.routines[idx] as object, data);
      return memoryStore.routines[idx] as never;
    },
    deleteRoutine: async (id) => {
      memoryStore.routines = memoryStore.routines.filter((r: unknown) => (r as { id: string }).id !== id);
      return { success: true };
    },

    // Settings
    getSetting: async (key) => settings[key] ?? null,
    setSetting: async (key, value) => {
      settings[key] = value;
      return { success: true };
    },
  };
}

export const api: ElectronAPI =
  typeof window !== "undefined" && window.electronAPI
    ? window.electronAPI
    : createBrowserFallback();
