"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckSquare, Plus, Columns3, FolderPlus } from "lucide-react";
import { useTaskStore } from "@/stores/useTaskStore";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import TaskFilters from "@/components/tasks/TaskFilters";
import ProjectForm from "@/components/tasks/ProjectForm";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import type { Task } from "@/lib/types";

export default function TasksPage() {
  const {
    tasks,
    projects,
    filters,
    isLoading,
    loadTasks,
    loadProjects,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    createProject,
  } = useTaskStore();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);

  useEffect(() => {
    loadTasks();
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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare size={28} className="text-accent" />
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tasks/kanban">
            <Button variant="ghost" size="sm">
              <Columns3 size={16} /> Kanban
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setProjectFormOpen(true)}>
            <FolderPlus size={16} /> Project
          </Button>
          <Button size="sm" onClick={() => { setEditingTask(null); setTaskFormOpen(true); }}>
            <Plus size={16} /> New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters filters={filters} projects={projects} onChange={setFilters} />
      </div>

      {/* Project chips */}
      {projects.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() =>
                setFilters(filters.projectId === p.id ? {} : { projectId: p.id })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.projectId === p.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-surface border border-border animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started"
          action={
            <Button size="sm" onClick={() => { setEditingTask(null); setTaskFormOpen(true); }}>
              <Plus size={16} /> New Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                project={projects.find((p) => p.id === task.project_id)}
                onToggle={handleToggle}
                onDelete={deleteTask}
                onClick={(t) => { setEditingTask(t); setTaskFormOpen(true); }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Forms */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => { setTaskFormOpen(false); setEditingTask(null); }}
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
      <ProjectForm
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSubmit={(data) => createProject(data)}
      />
    </div>
  );
}
