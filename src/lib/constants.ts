export const PRIORITY_COLORS: Record<string, string> = {
  none: "#71717a",
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#f97316",
  urgent: "#ef4444",
};

export const MOOD_EMOJIS: Record<string, string> = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😔",
  terrible: "😢",
};

export const PROJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
];

export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "layout-dashboard" },
  { path: "/tasks", label: "Tasks", icon: "check-square" },
  { path: "/habits", label: "Habits", icon: "flame" },
  { path: "/journal", label: "Journal", icon: "book-open" },
  { path: "/calendar", label: "Calendar", icon: "calendar" },
] as const;
