const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerCalendarHandlers(ipcMain) {
  ipcMain.handle("calendar:getEvents", (_event, startDate, endDate) => {
    const db = getDb();
    return db
      .prepare(
        "SELECT * FROM events WHERE start_time >= ? AND end_time <= ? ORDER BY start_time ASC"
      )
      .all(startDate, endDate);
  });

  ipcMain.handle("calendar:createEvent", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO events (id, title, description, color, start_time, end_time, is_all_day, is_time_block, linked_task_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.description || "",
      data.color || "#6366f1",
      data.startTime,
      data.endTime,
      data.isAllDay ? 1 : 0,
      data.isTimeBlock ? 1 : 0,
      data.linkedTaskId || null,
      now,
      now
    );
    return db.prepare("SELECT * FROM events WHERE id = ?").get(id);
  });

  ipcMain.handle("calendar:updateEvent", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      UPDATE events SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        color = COALESCE(?, color),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        is_all_day = COALESCE(?, is_all_day),
        is_time_block = COALESCE(?, is_time_block),
        linked_task_id = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? null,
      data.description ?? null,
      data.color ?? null,
      data.startTime ?? null,
      data.endTime ?? null,
      data.isAllDay !== undefined ? (data.isAllDay ? 1 : 0) : null,
      data.isTimeBlock !== undefined ? (data.isTimeBlock ? 1 : 0) : null,
      data.linkedTaskId !== undefined ? data.linkedTaskId : null,
      now,
      id
    );
    return db.prepare("SELECT * FROM events WHERE id = ?").get(id);
  });

  ipcMain.handle("calendar:deleteEvent", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM events WHERE id = ?").run(id);
    return { success: true };
  });

  ipcMain.handle("calendar:getRoutines", () => {
    const db = getDb();
    return db
      .prepare("SELECT * FROM routines WHERE is_active = 1 ORDER BY start_time ASC")
      .all();
  });

  ipcMain.handle("calendar:createRoutine", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO routines (id, title, description, color, start_time, end_time, days_of_week, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      id,
      data.title,
      data.description || "",
      data.color || "#f97316",
      data.startTime,
      data.endTime,
      JSON.stringify(data.daysOfWeek || [1, 2, 3, 4, 5]),
      now
    );
    return db.prepare("SELECT * FROM routines WHERE id = ?").get(id);
  });

  ipcMain.handle("calendar:updateRoutine", (_event, id, data) => {
    const db = getDb();
    db.prepare(`
      UPDATE routines SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        color = COALESCE(?, color),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        days_of_week = COALESCE(?, days_of_week),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      data.title ?? null,
      data.description ?? null,
      data.color ?? null,
      data.startTime ?? null,
      data.endTime ?? null,
      data.daysOfWeek ? JSON.stringify(data.daysOfWeek) : null,
      data.isActive !== undefined ? (data.isActive ? 1 : 0) : null,
      id
    );
    return db.prepare("SELECT * FROM routines WHERE id = ?").get(id);
  });

  ipcMain.handle("calendar:deleteRoutine", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM routines WHERE id = ?").run(id);
    return { success: true };
  });
}

module.exports = { registerCalendarHandlers };
