"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  BookOpen,
  Calendar,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Command,
} from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/tasks", label: "Tasks", Icon: CheckSquare },
  { path: "/habits", label: "Habits", Icon: Flame },
  { path: "/journal", label: "Journal", Icon: BookOpen },
  { path: "/calendar", label: "Calendar", Icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme, setCommandPaletteOpen } =
    useUIStore();

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full bg-sidebar-bg border-r border-sidebar-border flex flex-col z-50"
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Draggable titlebar area */}
      <div className="h-12 flex items-center px-4 drag-region shrink-0">
        {!sidebarCollapsed && (
          <motion.span
            className="text-sm font-semibold text-foreground tracking-tight ml-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Life OS
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-hidden">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive =
            path === "/" ? pathname === "/" : pathname.startsWith(path);
          return (
            <Link key={path} href={path}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors relative ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10 shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    className="text-sm font-medium relative z-10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    {label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 space-y-1 border-t border-sidebar-border">
        {/* Command palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors w-full"
        >
          <Command size={18} className="shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-xs flex-1 text-left">
              Search...{" "}
              <kbd className="ml-1 text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </kbd>
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors w-full"
        >
          {theme === "dark" ? (
            <Sun size={18} className="shrink-0" />
          ) : (
            <Moon size={18} className="shrink-0" />
          )}
          {!sidebarCollapsed && (
            <span className="text-sm">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          )}
        </button>

        {/* Settings */}
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
            <Settings size={18} className="shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Settings</span>}
          </div>
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors w-full"
        >
          {sidebarCollapsed ? (
            <ChevronsRight size={18} className="shrink-0" />
          ) : (
            <>
              <ChevronsLeft size={18} className="shrink-0" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
