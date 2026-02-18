// ─── Projects ────────────────────────────────

export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: ProjectStatus;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

// ─── Tasks ───────────────────────────────────

export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";
export type KanbanColumn = "backlog" | "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string | null;
  due_date: number | null;
  completed_at: number | null;
  sort_order: number;
  kanban_column: KanbanColumn;
  tags: string; // JSON string of string[]
  created_at: number;
  updated_at: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  kanbanColumn?: KanbanColumn;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string | null;
  dueDate?: number | null;
  sortOrder?: number;
  kanbanColumn?: KanbanColumn;
  tags?: string[];
}

// ─── Habits ──────────────────────────────────

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  custom_days: string; // JSON string of number[]
  target_count: number;
  is_archived: number;
  sort_order: number;
  created_at: number;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  count: number;
  created_at: number;
}

// ─── Goals ───────────────────────────────────

export type GoalStatus = "active" | "completed" | "abandoned";
export type ProgressType = "percentage" | "milestones" | "numeric";

export interface Goal {
  id: string;
  title: string;
  description: string;
  color: string;
  target_date: number | null;
  status: GoalStatus;
  progress_type: ProgressType;
  current_value: number;
  target_value: number;
  created_at: number;
  updated_at: number;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  is_completed: number;
  completed_at: number | null;
  sort_order: number;
}

// ─── Journal ─────────────────────────────────

export type Mood = "great" | "good" | "neutral" | "bad" | "terrible";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  plain_text: string;
  mood: Mood | null;
  tags: string; // JSON string of string[]
  date: string; // YYYY-MM-DD
  is_favorite: number;
  created_at: number;
  updated_at: number;
}

export interface JournalFilters {
  mood?: Mood;
  isFavorite?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ─── Calendar ────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  color: string;
  start_time: number;
  end_time: number;
  is_all_day: number;
  is_time_block: number;
  linked_task_id: string | null;
  created_at: number;
  updated_at: number;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  color: string;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  days_of_week: string; // JSON string of number[]
  is_active: number;
  created_at: number;
}

// ─── IPC API ─────────────────────────────────

export interface ElectronAPI {
  // Tasks
  getTasks: (filters?: TaskFilters) => Promise<Task[]>;
  createTask: (data: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, data: Partial<CreateTaskInput>) => Promise<Task>;
  deleteTask: (id: string) => Promise<{ success: boolean }>;

  // Projects
  getProjects: () => Promise<Project[]>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<{ success: boolean }>;

  // Habits
  getHabits: () => Promise<Habit[]>;
  createHabit: (data: Partial<Habit>) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<{ success: boolean }>;
  getCompletions: (habitId: string, startDate?: string, endDate?: string) => Promise<HabitCompletion[]>;
  toggleCompletion: (habitId: string, date: string) => Promise<{ completed: boolean }>;

  // Goals
  getGoals: () => Promise<Goal[]>;
  createGoal: (data: Partial<Goal>) => Promise<Goal>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<{ success: boolean }>;
  getMilestones: (goalId: string) => Promise<Milestone[]>;
  createMilestone: (data: { goalId: string; title: string; sortOrder?: number }) => Promise<Milestone>;
  updateMilestone: (id: string, data: Partial<Milestone & { isCompleted: boolean }>) => Promise<Milestone>;
  deleteMilestone: (id: string) => Promise<{ success: boolean }>;

  // Journal
  getEntries: (filters?: JournalFilters) => Promise<JournalEntry[]>;
  getEntry: (id: string) => Promise<JournalEntry | null>;
  createEntry: (data: Partial<JournalEntry> & { date: string }) => Promise<JournalEntry>;
  updateEntry: (id: string, data: Partial<JournalEntry>) => Promise<JournalEntry>;
  deleteEntry: (id: string) => Promise<{ success: boolean }>;

  // Calendar
  getEvents: (startDate: number, endDate: number) => Promise<CalendarEvent[]>;
  createEvent: (data: Partial<CalendarEvent> & { title: string; startTime: number; endTime: number }) => Promise<CalendarEvent>;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteEvent: (id: string) => Promise<{ success: boolean }>;
  getRoutines: () => Promise<Routine[]>;
  createRoutine: (data: Partial<Routine> & { title: string; startTime: string; endTime: string }) => Promise<Routine>;
  updateRoutine: (id: string, data: Partial<Routine>) => Promise<Routine>;
  deleteRoutine: (id: string) => Promise<{ success: boolean }>;

  // Settings
  getSetting: (key: string) => Promise<string | null>;
  setSetting: (key: string, value: string) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
