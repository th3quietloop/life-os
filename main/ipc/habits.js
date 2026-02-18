const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerHabitHandlers(ipcMain) {
  ipcMain.handle("habits:getAll", () => {
    const db = getDb();
    return db
      .prepare("SELECT * FROM habits WHERE is_archived = 0 ORDER BY sort_order ASC, created_at DESC")
      .all();
  });

  ipcMain.handle("habits:create", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO habits (id, name, description, icon, color, frequency, custom_days, target_count, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name,
      data.description || "",
      data.icon || "circle-check",
      data.color || "#22c55e",
      data.frequency || "daily",
      JSON.stringify(data.customDays || []),
      data.targetCount || 1,
      data.sortOrder || 0,
      now
    );
    return db.prepare("SELECT * FROM habits WHERE id = ?").get(id);
  });

  ipcMain.handle("habits:update", (_event, id, data) => {
    const db = getDb();
    db.prepare(`
      UPDATE habits SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        icon = COALESCE(?, icon),
        color = COALESCE(?, color),
        frequency = COALESCE(?, frequency),
        custom_days = COALESCE(?, custom_days),
        target_count = COALESCE(?, target_count),
        is_archived = COALESCE(?, is_archived),
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(
      data.name ?? null,
      data.description ?? null,
      data.icon ?? null,
      data.color ?? null,
      data.frequency ?? null,
      data.customDays ? JSON.stringify(data.customDays) : null,
      data.targetCount ?? null,
      data.isArchived !== undefined ? (data.isArchived ? 1 : 0) : null,
      data.sortOrder ?? null,
      id
    );
    return db.prepare("SELECT * FROM habits WHERE id = ?").get(id);
  });

  ipcMain.handle("habits:delete", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM habits WHERE id = ?").run(id);
    return { success: true };
  });

  ipcMain.handle("habits:getCompletions", (_event, habitId, startDate, endDate) => {
    const db = getDb();
    let query = "SELECT * FROM habit_completions WHERE habit_id = ?";
    const params = [habitId];
    if (startDate) {
      query += " AND date >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND date <= ?";
      params.push(endDate);
    }
    query += " ORDER BY date DESC";
    return db.prepare(query).all(...params);
  });

  ipcMain.handle("habits:toggleCompletion", (_event, habitId, date) => {
    const db = getDb();
    const existing = db
      .prepare("SELECT * FROM habit_completions WHERE habit_id = ? AND date = ?")
      .get(habitId, date);

    if (existing) {
      db.prepare("DELETE FROM habit_completions WHERE id = ?").run(existing.id);
      return { completed: false };
    } else {
      const id = uuid();
      const now = Date.now();
      db.prepare(`
        INSERT INTO habit_completions (id, habit_id, date, count, created_at)
        VALUES (?, ?, ?, 1, ?)
      `).run(id, habitId, date, now);
      return { completed: true };
    }
  });
}

module.exports = { registerHabitHandlers };
