"use client";

import { create } from "zustand";
import { api } from "@/lib/ipc";
import type { Task, Project, TaskFilters, CreateTaskInput } from "@/lib/types";

interface TaskState {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  filters: TaskFilters;

  loadTasks: (filters?: TaskFilters) => Promise<void>;
  loadProjects: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, updates: Partial<CreateTaskInput>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;

  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [],
  isLoading: false,
  filters: {},

  loadTasks: async (filters) => {
    set({ isLoading: true });
    const f = filters ?? get().filters;
    const tasks = await api.getTasks(f);
    set({ tasks, isLoading: false, filters: f });
  },

  loadProjects: async () => {
    const projects = await api.getProjects();
    set({ projects });
  },

  createTask: async (input) => {
    const task = await api.createTask(input);
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return task;
  },

  updateTask: async (id, updates) => {
    const updated = await api.updateTask(id, updates);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTask: async (id) => {
    await api.deleteTask(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  setFilters: (filters) => {
    set({ filters });
    get().loadTasks(filters);
  },

  createProject: async (data) => {
    const project = await api.createProject(data);
    set((s) => ({ projects: [...s.projects, project] }));
    return project;
  },

  updateProject: async (id, data) => {
    const updated = await api.updateProject(id, data);
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProject: async (id) => {
    await api.deleteProject(id);
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },
}));
