const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerGoalHandlers(ipcMain) {
  ipcMain.handle("goals:getAll", () => {
    const db = getDb();
    return db
      .prepare("SELECT * FROM goals ORDER BY created_at DESC")
      .all();
  });

  ipcMain.handle("goals:create", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO goals (id, title, description, color, target_date, status, progress_type, current_value, target_value, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.description || "",
      data.color || "#818cf8",
      data.targetDate || null,
      data.status || "active",
      data.progressType || "milestones",
      data.currentValue || 0,
      data.targetValue || 100,
      now,
      now
    );
    return db.prepare("SELECT * FROM goals WHERE id = ?").get(id);
  });

  ipcMain.handle("goals:update", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      UPDATE goals SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        color = COALESCE(?, color),
        target_date = ?,
        status = COALESCE(?, status),
        progress_type = COALESCE(?, progress_type),
        current_value = COALESCE(?, current_value),
        target_value = COALESCE(?, target_value),
        updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? null,
      data.description ?? null,
      data.color ?? null,
      data.targetDate !== undefined ? data.targetDate : null,
      data.status ?? null,
      data.progressType ?? null,
      data.currentValue ?? null,
      data.targetValue ?? null,
      now,
      id
    );
    return db.prepare("SELECT * FROM goals WHERE id = ?").get(id);
  });

  ipcMain.handle("goals:delete", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM goals WHERE id = ?").run(id);
    return { success: true };
  });

  ipcMain.handle("goals:getMilestones", (_event, goalId) => {
    const db = getDb();
    return db
      .prepare("SELECT * FROM milestones WHERE goal_id = ? ORDER BY sort_order ASC")
      .all(goalId);
  });

  ipcMain.handle("goals:createMilestone", (_event, data) => {
    const db = getDb();
    const id = uuid();
    db.prepare(`
      INSERT INTO milestones (id, goal_id, title, is_completed, sort_order)
      VALUES (?, ?, ?, 0, ?)
    `).run(id, data.goalId, data.title, data.sortOrder || 0);
    return db.prepare("SELECT * FROM milestones WHERE id = ?").get(id);
  });

  ipcMain.handle("goals:updateMilestone", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      UPDATE milestones SET
        title = COALESCE(?, title),
        is_completed = COALESCE(?, is_completed),
        completed_at = ?,
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `).run(
      data.title ?? null,
      data.isCompleted !== undefined ? (data.isCompleted ? 1 : 0) : null,
      data.isCompleted ? now : null,
      data.sortOrder ?? null,
      id
    );
    return db.prepare("SELECT * FROM milestones WHERE id = ?").get(id);
  });

  ipcMain.handle("goals:deleteMilestone", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM milestones WHERE id = ?").run(id);
    return { success: true };
  });
}

module.exports = { registerGoalHandlers };
