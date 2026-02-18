"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { PROJECT_COLORS } from "@/lib/constants";
import type { ProgressType } from "@/lib/types";

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    color: string;
    progressType: ProgressType;
    targetDate: number | null;
    targetValue: number;
  }) => void;
}

export default function GoalForm({ open, onClose, onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#818cf8");
  const [progressType, setProgressType] = useState<ProgressType>("milestones");
  const [targetDate, setTargetDate] = useState("");
  const [targetValue, setTargetValue] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      color,
      progressType,
      targetDate: targetDate ? new Date(targetDate).getTime() : null,
      targetValue,
    });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Title"
          placeholder="What do you want to achieve?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="Why is this important?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Track with"
            value={progressType}
            onChange={(e) => setProgressType(e.target.value as ProgressType)}
            options={[
              { value: "milestones", label: "Milestones" },
              { value: "percentage", label: "Percentage" },
              { value: "numeric", label: "Numeric" },
            ]}
          />
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        {progressType === "numeric" && (
          <Input
            label="Target Value"
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(parseInt(e.target.value) || 100)}
          />
        )}
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
