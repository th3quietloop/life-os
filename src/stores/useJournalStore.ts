"use client";

import { create } from "zustand";
import { api } from "@/lib/ipc";
import type { JournalEntry, JournalFilters } from "@/lib/types";

interface JournalState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isLoading: boolean;
  filters: JournalFilters;

  loadEntries: (filters?: JournalFilters) => Promise<void>;
  loadEntry: (id: string) => Promise<void>;
  createEntry: (data: Partial<JournalEntry> & { date: string }) => Promise<JournalEntry>;
  updateEntry: (id: string, data: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setFilters: (filters: JournalFilters) => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  currentEntry: null,
  isLoading: false,
  filters: {},

  loadEntries: async (filters) => {
    set({ isLoading: true });
    const f = filters ?? get().filters;
    const entries = await api.getEntries(f);
    set({ entries, isLoading: false, filters: f });
  },

  loadEntry: async (id) => {
    const entry = await api.getEntry(id);
    set({ currentEntry: entry });
  },

  createEntry: async (data) => {
    const entry = await api.createEntry(data);
    set((s) => ({ entries: [entry, ...s.entries] }));
    return entry;
  },

  updateEntry: async (id, data) => {
    const updated = await api.updateEntry(id, data);
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? updated : e)),
      currentEntry: s.currentEntry?.id === id ? updated : s.currentEntry,
    }));
  },

  deleteEntry: async (id) => {
    await api.deleteEntry(id);
    set((s) => ({
      entries: s.entries.filter((e) => e.id !== id),
      currentEntry: s.currentEntry?.id === id ? null : s.currentEntry,
    }));
  },

  setFilters: (filters) => {
    set({ filters });
    get().loadEntries(filters);
  },
}));
