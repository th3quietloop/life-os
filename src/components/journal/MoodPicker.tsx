"use client";

import { motion } from "framer-motion";
import { MOOD_EMOJIS } from "@/lib/constants";
import type { Mood } from "@/lib/types";

interface MoodPickerProps {
  value: Mood | null;
  onChange: (mood: Mood | null) => void;
}

const moods: Mood[] = ["great", "good", "neutral", "bad", "terrible"];

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {moods.map((mood) => (
        <motion.button
          key={mood}
          type="button"
          onClick={() => onChange(value === mood ? null : mood)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
            value === mood
              ? "bg-accent/10 ring-2 ring-accent scale-110"
              : "hover:bg-surface-hover opacity-60 hover:opacity-100"
          }`}
          title={mood}
        >
          {MOOD_EMOJIS[mood]}
        </motion.button>
      ))}
    </div>
  );
}
