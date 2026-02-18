"use client";

import Select from "@/components/ui/Select";
import type { TaskFilters as TFilters, Project } from "@/lib/types";

interface TaskFiltersProps {
  filters: TFilters;
  projects: Project[];
  onChange: (filters: TFilters) => void;
}

export default function TaskFilters({
  filters,
  projects,
  onChange,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select
        value={filters.status || ""}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value ? (e.target.value as TFilters["status"]) : undefined,
          })
        }
        options={[
          { value: "", label: "All statuses" },
          { value: "todo", label: "To Do" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <Select
        value={filters.priority || ""}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: e.target.value ? (e.target.value as TFilters["priority"]) : undefined,
          })
        }
        options={[
          { value: "", label: "All priorities" },
          { value: "urgent", label: "Urgent" },
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
          { value: "none", label: "None" },
        ]}
      />
      <Select
        value={filters.projectId || ""}
        onChange={(e) =>
          onChange({
            ...filters,
            projectId: e.target.value || undefined,
          })
        }
        options={[
          { value: "", label: "All projects" },
          ...projects.map((p) => ({ value: p.id, label: p.name })),
        ]}
      />
    </div>
  );
}
