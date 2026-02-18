"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Task, TaskPriority, KanbanColumn, Project } from "@/lib/types";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  projects: Project[];
}

interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  projectId: string | null;
  dueDate: number | null;
  kanbanColumn: KanbanColumn;
  tags: string[];
}

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  task,
  projects,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("none");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [kanbanColumn, setKanbanColumn] = useState<KanbanColumn>("todo");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setProjectId(task.project_id || "");
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "");
      setKanbanColumn(task.kanban_column);
      setTagsInput(task.tags !== "[]" ? (JSON.parse(task.tags) as string[]).join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("none");
      setProjectId("");
      setDueDate("");
      setKanbanColumn("todo");
      setTagsInput("");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      projectId: projectId || null,
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      kanbanColumn,
      tags,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? "Edit Task" : "New Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <Textarea
          label="Description"
          placeholder="Add details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: "none", label: "None" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
          <Select
            label="Column"
            value={kanbanColumn}
            onChange={(e) => setKanbanColumn(e.target.value as KanbanColumn)}
            options={[
              { value: "backlog", label: "Backlog" },
              { value: "todo", label: "To Do" },
              { value: "in_progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={[
              { value: "", label: "No project" },
              ...projects.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <Input
          label="Tags (comma-separated)"
          placeholder="work, personal, urgent"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
