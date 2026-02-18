"use client";

import { motion } from "framer-motion";
import type { Task, Project, KanbanColumn as KCol } from "@/lib/types";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  column: KCol;
  label: string;
  tasks: Task[];
  projects: Project[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  onDrop: (taskId: string, column: KCol) => void;
}

const columnColors: Record<KCol, string> = {
  backlog: "border-t-muted",
  todo: "border-t-accent",
  in_progress: "border-t-warning",
  done: "border-t-success",
};

export default function KanbanColumn({
  column,
  label,
  tasks,
  projects,
  onToggle,
  onDelete,
  onClick,
  onDrop,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) onDrop(taskId, column);
  };

  return (
    <div
      className={`flex flex-col rounded-xl bg-surface/50 border border-border border-t-2 ${columnColors[column]} min-h-[400px]`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-muted bg-surface-hover px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            draggable
            onDragStart={(e) => {
              (e as unknown as React.DragEvent).dataTransfer?.setData("text/plain", task.id);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <TaskCard
              task={task}
              project={projects.find((p) => p.id === task.project_id)}
              onToggle={onToggle}
              onDelete={onDelete}
              onClick={onClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
