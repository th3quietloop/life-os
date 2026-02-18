"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { PROJECT_COLORS } from "@/lib/constants";
import type { HabitFrequency } from "@/lib/types";

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string; frequency: HabitFrequency; targetCount: number }) => void;
}

export default function HabitForm({ open, onClose, onSubmit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [targetCount, setTargetCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color, frequency, targetCount });
    setName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Habit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Habit Name"
          placeholder="e.g., Meditate, Exercise, Read"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Select
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
          options={[
            { value: "daily", label: "Every day" },
            { value: "weekdays", label: "Weekdays" },
            { value: "weekends", label: "Weekends" },
          ]}
        />
        <Input
          label="Daily target"
          type="number"
          min={1}
          max={10}
          value={targetCount}
          onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
        />
        <div>
          <label className="text-xs font-medium text-muted mb-2 block">Color</label>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  color === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
}
