const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerProjectHandlers(ipcMain) {
  ipcMain.handle("projects:getAll", () => {
    const db = getDb();
    return db
      .prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC")
      .all();
  });

  ipcMain.handle("projects:create", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO projects (id, name, description, color, icon, status, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.description || "",
      data.color || "#6366f1",
      data.icon || "folder",
      data.status || "active",
      data.sortOrder || 0,
      now,
      now
    );
    return db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  });

  ipcMain.handle("projects:update", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      UPDATE projects SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        color = COALESCE(?, color),
        icon = COALESCE(?, icon),
        status = COALESCE(?, status),
        sort_order = COALESCE(?, sort_order),
        updated_at = ?
      WHERE id = ?
    `).run(
      data.name ?? null,
      data.description ?? null,
      data.color ?? null,
      data.icon ?? null,
      data.status ?? null,
      data.sortOrder ?? null,
      now,
      id
    );
    return db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  });

  ipcMain.handle("projects:delete", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    return { success: true };
  });
}

module.exports = { registerProjectHandlers };
