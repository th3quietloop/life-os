"use client";

import { create } from "zustand";
import { api } from "@/lib/ipc";
import type { CalendarEvent, Routine } from "@/lib/types";

interface CalendarState {
  events: CalendarEvent[];
  routines: Routine[];
  selectedDate: Date;
  isLoading: boolean;

  loadEvents: (start: number, end: number) => Promise<void>;
  createEvent: (data: { title: string; startTime: number; endTime: number; description?: string; color?: string; isAllDay?: boolean; isTimeBlock?: boolean; linkedTaskId?: string }) => Promise<void>;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  loadRoutines: () => Promise<void>;
  createRoutine: (data: Partial<Routine> & { title: string; startTime: string; endTime: string }) => Promise<void>;
  updateRoutine: (id: string, data: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;

  setSelectedDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  routines: [],
  selectedDate: new Date(),
  isLoading: false,

  loadEvents: async (start, end) => {
    set({ isLoading: true });
    const events = await api.getEvents(start, end);
    set({ events, isLoading: false });
  },

  createEvent: async (data) => {
    const event = await api.createEvent(data as Parameters<typeof api.createEvent>[0]);
    set((s) => ({ events: [...s.events, event] }));
  },

  updateEvent: async (id, data) => {
    const updated = await api.updateEvent(id, data);
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? updated : e)),
    }));
  },

  deleteEvent: async (id) => {
    await api.deleteEvent(id);
    set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
  },

  loadRoutines: async () => {
    const routines = await api.getRoutines();
    set({ routines });
  },

  createRoutine: async (data) => {
    const routine = await api.createRoutine(data);
    set((s) => ({ routines: [...s.routines, routine] }));
  },

  updateRoutine: async (id, data) => {
    const updated = await api.updateRoutine(id, data);
    set((s) => ({
      routines: s.routines.map((r) => (r.id === id ? updated : r)),
    }));
  },

  deleteRoutine: async (id) => {
    await api.deleteRoutine(id);
    set((s) => ({ routines: s.routines.filter((r) => r.id !== id) }));
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
}));
