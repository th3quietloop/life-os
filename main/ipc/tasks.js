const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerTaskHandlers(ipcMain) {
  ipcMain.handle("tasks:getAll", (_event, filters = {}) => {
    const db = getDb();
    let query = "SELECT * FROM tasks";
    const conditions = [];
    const params = [];

    if (filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }
    if (filters.priority) {
      conditions.push("priority = ?");
      params.push(filters.priority);
    }
    if (filters.projectId) {
      conditions.push("project_id = ?");
      params.push(filters.projectId);
    }
    if (filters.kanbanColumn) {
      conditions.push("kanban_column = ?");
      params.push(filters.kanbanColumn);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY sort_order ASC, created_at DESC";

    return db.prepare(query).all(...params);
  });

  ipcMain.handle("tasks:create", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, project_id, due_date, sort_order, kanban_column, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.title,
      data.description || "",
      data.status || "todo",
      data.priority || "none",
      data.projectId || null,
      data.dueDate || null,
      data.sortOrder || 0,
      data.kanbanColumn || "todo",
      JSON.stringify(data.tags || []),
      now,
      now
    );
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  });

  ipcMain.handle("tasks:update", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    const current = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    if (!current) return null;

    const completedAt =
      data.status === "done" && current.status !== "done" ? now : data.status !== "done" ? null : current.completed_at;

    const stmt = db.prepare(`
      UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        project_id = ?,
        due_date = ?,
        completed_at = ?,
        sort_order = COALESCE(?, sort_order),
        kanban_column = COALESCE(?, kanban_column),
        tags = COALESCE(?, tags),
        updated_at = ?
      WHERE id = ?
    `);
    stmt.run(
      data.title ?? null,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      data.projectId !== undefined ? data.projectId : current.project_id,
      data.dueDate !== undefined ? data.dueDate : current.due_date,
      completedAt,
      data.sortOrder ?? null,
      data.kanbanColumn ?? null,
      data.tags ? JSON.stringify(data.tags) : null,
      now,
      id
    );
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  });

  ipcMain.handle("tasks:delete", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return { success: true };
  });
}

module.exports = { registerTaskHandlers };
