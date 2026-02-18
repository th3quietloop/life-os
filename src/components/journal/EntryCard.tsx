"use client";

import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { MOOD_EMOJIS } from "@/lib/constants";
import type { JournalEntry } from "@/lib/types";

interface EntryCardProps {
  entry: JournalEntry;
  onClick: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export default function EntryCard({
  entry,
  onClick,
  onDelete,
  onToggleFavorite,
}: EntryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-start gap-4 p-4 rounded-lg border border-border bg-surface hover:border-accent/20 transition-all cursor-pointer"
      onClick={() => onClick(entry)}
    >
      {/* Date */}
      <div className="text-center shrink-0 w-12">
        <div className="text-2xl font-bold text-foreground">
          {format(new Date(entry.date + "T12:00:00"), "dd")}
        </div>
        <div className="text-[10px] text-muted uppercase">
          {format(new Date(entry.date + "T12:00:00"), "MMM")}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {entry.mood && (
            <span className="text-sm">{MOOD_EMOJIS[entry.mood]}</span>
          )}
          <h3 className="text-sm font-semibold truncate">
            {entry.title || format(new Date(entry.date + "T12:00:00"), "EEEE, MMMM d")}
          </h3>
        </div>
        {entry.plain_text && (
          <p className="text-xs text-muted line-clamp-2">{entry.plain_text}</p>
        )}
        {entry.tags && entry.tags !== "[]" && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {(JSON.parse(entry.tags) as string[]).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(entry.id, !entry.is_favorite);
          }}
          className={`p-1 rounded transition-all ${
            entry.is_favorite
              ? "text-warning"
              : "opacity-0 group-hover:opacity-100 text-muted hover:text-warning"
          }`}
        >
          <Star size={14} fill={entry.is_favorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
