"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={28} className="text-muted" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-muted">Settings coming soon...</p>
      </div>
    </div>
  );
}
