"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Search, Star, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useJournalStore } from "@/stores/useJournalStore";
import EntryCard from "@/components/journal/EntryCard";
import EntryEditor from "@/components/journal/EntryEditor";
import MoodPicker from "@/components/journal/MoodPicker";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import type { Mood, JournalEntry } from "@/lib/types";

export default function JournalPage() {
  const {
    entries,
    currentEntry,
    isLoading,
    filters,
    loadEntries,
    loadEntry,
    createEntry,
    deleteEntry,
    updateEntry,
    setFilters,
  } = useJournalStore();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title || "");
      setTagsInput(
        currentEntry.tags && currentEntry.tags !== "[]"
          ? (JSON.parse(currentEntry.tags) as string[]).join(", ")
          : ""
      );
    }
  }, [currentEntry]);

  const openEntry = async (entry: JournalEntry) => {
    setEditingId(entry.id);
    await loadEntry(entry.id);
  };

  const handleNewEntry = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const entry = await createEntry({ date: today });
    setEditingId(entry.id);
    await loadEntry(entry.id);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const saveContent = useCallback(
    async (data: { content: string; plainText: string }) => {
      if (!editingId) return;
      await updateEntry(editingId, {
        content: data.content,
        plain_text: data.plainText,
      });
    },
    [editingId, updateEntry]
  );

  const { debouncedSave } = useDebouncedSave(saveContent, 800);

  // ─── Editor View ─────────────────────────────
  if (editingId && currentEntry) {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <button
          onClick={() => { setEditingId(null); loadEntries(); }}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Journal
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-muted">
            {format(new Date(currentEntry.date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
          </h2>
          <button
            onClick={() =>
              updateEntry(editingId, { is_favorite: currentEntry.is_favorite ? 0 : 1 })
            }
            className={`p-2 rounded-lg transition-all ${
              currentEntry.is_favorite ? "text-warning" : "text-muted hover:text-warning"
            }`}
          >
            <Star size={18} fill={currentEntry.is_favorite ? "currentColor" : "none"} />
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            updateEntry(editingId, { title: e.target.value });
          }}
          placeholder="Entry title (optional)"
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted/30 mb-4"
        />

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-muted">Mood:</span>
          <MoodPicker
            value={currentEntry.mood}
            onChange={(mood) => updateEntry(editingId, { mood: mood as Mood | undefined })}
          />
        </div>

        <div className="mb-6">
          <input
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
              updateEntry(editingId, { tags: JSON.stringify(tags) });
            }}
            placeholder="Tags (comma-separated)"
            className="w-full text-sm bg-transparent border-none outline-none text-muted placeholder:text-muted/30"
          />
        </div>

        <EntryEditor
          content={currentEntry.content}
          onChange={(html, plainText) => debouncedSave({ content: html, plainText })}
        />
      </div>
    );
  }

  // ─── List View ───────────────────────────────
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen size={28} className="text-warning" />
          <h1 className="text-2xl font-bold">Journal</h1>
        </div>
        <Button size="sm" onClick={handleNewEntry}>
          <Plus size={16} /> New Entry
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              placeholder="Search entries..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
        <MoodPicker
          value={(filters.mood as Mood) || null}
          onChange={(mood) => setFilters({ ...filters, mood: mood || undefined })}
        />
        <button
          onClick={() =>
            setFilters({ ...filters, isFavorite: filters.isFavorite ? undefined : true })
          }
          className={`p-2 rounded-lg transition-all ${
            filters.isFavorite
              ? "bg-warning/10 text-warning"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          <Star size={16} fill={filters.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={48} />}
          title={search ? "No matching entries" : "No journal entries yet"}
          description={
            search
              ? "Try a different search term"
              : "Start your journaling practice by writing your first entry"
          }
          action={
            !search ? (
              <Button size="sm" onClick={handleNewEntry}>
                <Plus size={16} /> Write Today
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onClick={openEntry}
                onDelete={deleteEntry}
                onToggleFavorite={(id, isFavorite) =>
                  updateEntry(id, { is_favorite: isFavorite ? 1 : 0 })
                }
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
