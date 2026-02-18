"use client";

import { motion } from "framer-motion";
import { Check, Trash2, GripVertical } from "lucide-react";
import type { Task, Project } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import DeadlineBadge from "./DeadlineBadge";

interface TaskCardProps {
  task: Task;
  project?: Project;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

export default function TaskCard({
  task,
  project,
  onToggle,
  onDelete,
  onClick,
}: TaskCardProps) {
  const isDone = task.status === "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
        isDone
          ? "bg-surface/50 border-border/50"
          : "bg-surface border-border hover:border-accent/30 hover:shadow-sm"
      }`}
      onClick={() => onClick(task)}
    >
      {/* Drag handle */}
      <div className="opacity-0 group-hover:opacity-40 mt-0.5 cursor-grab">
        <GripVertical size={14} />
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          isDone
            ? "bg-success border-success"
            : "border-border hover:border-accent"
        }`}
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Check size={12} className="text-white" />
          </motion.div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${
              isDone ? "line-through text-muted" : "text-foreground"
            }`}
          >
            {task.title}
          </span>
          <PriorityBadge priority={task.priority} />
          {task.due_date && <DeadlineBadge dueDate={task.due_date} />}
        </div>
        {task.description && (
          <p className="text-xs text-muted mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {project && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-muted"
              title={project.name}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
          )}
          {task.tags && task.tags !== "[]" && (
            <>
              {(JSON.parse(task.tags) as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger transition-all"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
