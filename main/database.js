const Database = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");

let db;

function getDbPath() {
  const isDev = !app.isPackaged;
  if (isDev) {
    return path.join(__dirname, "..", "life-os-dev.db");
  }
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "life-os.db");
}

function initDatabase() {
  const dbPath = getDbPath();
  db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      color TEXT NOT NULL DEFAULT '#6366f1',
      icon TEXT DEFAULT 'folder',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done', 'cancelled')),
      priority TEXT NOT NULL DEFAULT 'none' CHECK(priority IN ('none', 'low', 'medium', 'high', 'urgent')),
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      due_date INTEGER,
      completed_at INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0,
      kanban_column TEXT NOT NULL DEFAULT 'todo' CHECK(kanban_column IN ('backlog', 'todo', 'in_progress', 'done')),
      tags TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'circle-check',
      color TEXT NOT NULL DEFAULT '#22c55e',
      frequency TEXT NOT NULL DEFAULT 'daily' CHECK(frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
      custom_days TEXT DEFAULT '[]',
      target_count INTEGER NOT NULL DEFAULT 1,
      is_archived INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_completions (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      color TEXT NOT NULL DEFAULT '#818cf8',
      target_date INTEGER,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'abandoned')),
      progress_type TEXT NOT NULL DEFAULT 'milestones' CHECK(progress_type IN ('percentage', 'milestones', 'numeric')),
      current_value REAL DEFAULT 0,
      target_value REAL DEFAULT 100,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      completed_at INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      title TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      plain_text TEXT DEFAULT '',
      mood TEXT CHECK(mood IN ('great', 'good', 'neutral', 'bad', 'terrible')),
      tags TEXT DEFAULT '[]',
      date TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      color TEXT NOT NULL DEFAULT '#6366f1',
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      is_all_day INTEGER NOT NULL DEFAULT 0,
      is_time_block INTEGER NOT NULL DEFAULT 0,
      linked_task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      color TEXT NOT NULL DEFAULT '#f97316',
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      days_of_week TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON habit_completions(habit_id, date);
    CREATE INDEX IF NOT EXISTS idx_milestones_goal ON milestones(goal_id);
    CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(date);
    CREATE INDEX IF NOT EXISTS idx_events_time ON events(start_time, end_time);
  `);

  // Insert default settings if not exist
  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  insertSetting.run("theme", "dark");
  insertSetting.run("sidebarCollapsed", "false");
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb };
