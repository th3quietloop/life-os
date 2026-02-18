"use client";

import type { Task, Project, KanbanColumn as KCol } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  onMove: (taskId: string, column: KCol) => void;
}

const columns: { key: KCol; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function KanbanBoard({
  tasks,
  projects,
  onToggle,
  onDelete,
  onClick,
  onMove,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4 min-h-[500px]">
      {columns.map(({ key, label }) => (
        <KanbanColumn
          key={key}
          column={key}
          label={label}
          tasks={tasks.filter((t) => t.kanban_column === key)}
          projects={projects}
          onToggle={onToggle}
          onDelete={onDelete}
          onClick={onClick}
          onDrop={onMove}
        />
      ))}
    </div>
  );
}
