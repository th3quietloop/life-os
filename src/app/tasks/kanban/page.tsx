"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Plus, List } from "lucide-react";
import { useTaskStore } from "@/stores/useTaskStore";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskForm from "@/components/tasks/TaskForm";
import Button from "@/components/ui/Button";
import type { Task, KanbanColumn } from "@/lib/types";

export default function KanbanPage() {
  const { tasks, projects, loadTasks, loadProjects, createTask, updateTask, deleteTask } =
    useTaskStore();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks({});
    loadProjects();
  }, [loadTasks, loadProjects]);

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, {
      status: task.status === "done" ? "todo" : "done",
      kanbanColumn: task.status === "done" ? "todo" : "done",
    });
  };

  const handleMove = (taskId: string, column: KanbanColumn) => {
    const statusMap: Record<KanbanColumn, string> = {
      backlog: "todo",
      todo: "todo",
      in_progress: "in_progress",
      done: "done",
    };
    updateTask(taskId, {
      kanbanColumn: column,
      status: statusMap[column] as "todo" | "in_progress" | "done",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare size={28} className="text-accent" />
          <h1 className="text-2xl font-bold">Kanban Board</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <List size={16} /> List View
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => {
              setEditingTask(null);
              setTaskFormOpen(true);
            }}
          >
            <Plus size={16} /> New Task
          </Button>
        </div>
      </div>

      <KanbanBoard
        tasks={tasks}
        projects={projects}
        onToggle={handleToggle}
        onDelete={deleteTask}
        onClick={(t) => {
          setEditingTask(t);
          setTaskFormOpen(true);
        }}
        onMove={handleMove}
      />

      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        projects={projects}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
          } else {
            createTask(data);
          }
        }}
      />
    </div>
  );
}
