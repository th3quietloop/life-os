"use client";

import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { useUIStore } from "@/stores/useUIStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <motion.main
        className="flex-1 overflow-y-auto"
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-8 pt-16 max-w-6xl mx-auto">{children}</div>
      </motion.main>
    </div>
  );
}
