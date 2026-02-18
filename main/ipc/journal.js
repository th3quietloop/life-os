const { v4: uuid } = require("uuid");
const { getDb } = require("../database");

function registerJournalHandlers(ipcMain) {
  ipcMain.handle("journal:getAll", (_event, filters = {}) => {
    const db = getDb();
    let query = "SELECT * FROM journal_entries";
    const conditions = [];
    const params = [];

    if (filters.mood) {
      conditions.push("mood = ?");
      params.push(filters.mood);
    }
    if (filters.isFavorite) {
      conditions.push("is_favorite = 1");
    }
    if (filters.startDate) {
      conditions.push("date >= ?");
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      conditions.push("date <= ?");
      params.push(filters.endDate);
    }
    if (filters.search) {
      conditions.push("plain_text LIKE ?");
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY date DESC, created_at DESC";

    return db.prepare(query).all(...params);
  });

  ipcMain.handle("journal:get", (_event, id) => {
    const db = getDb();
    return db.prepare("SELECT * FROM journal_entries WHERE id = ?").get(id);
  });

  ipcMain.handle("journal:create", (_event, data) => {
    const db = getDb();
    const id = uuid();
    const now = Date.now();
    db.prepare(`
      INSERT INTO journal_entries (id, title, content, plain_text, mood, tags, date, is_favorite, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title || "",
      data.content || "",
      data.plainText || "",
      data.mood || null,
      JSON.stringify(data.tags || []),
      data.date,
      data.isFavorite ? 1 : 0,
      now,
      now
    );
    return db.prepare("SELECT * FROM journal_entries WHERE id = ?").get(id);
  });

  ipcMain.handle("journal:update", (_event, id, data) => {
    const db = getDb();
    const now = Date.now();
    db.prepare(`
      UPDATE journal_entries SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        plain_text = COALESCE(?, plain_text),
        mood = ?,
        tags = COALESCE(?, tags),
        is_favorite = COALESCE(?, is_favorite),
        updated_at = ?
      WHERE id = ?
    `).run(
      data.title ?? null,
      data.content ?? null,
      data.plainText ?? null,
      data.mood !== undefined ? data.mood : null,
      data.tags ? JSON.stringify(data.tags) : null,
      data.isFavorite !== undefined ? (data.isFavorite ? 1 : 0) : null,
      now,
      id
    );
    return db.prepare("SELECT * FROM journal_entries WHERE id = ?").get(id);
  });

  ipcMain.handle("journal:delete", (_event, id) => {
    const db = getDb();
    db.prepare("DELETE FROM journal_entries WHERE id = ?").run(id);
    return { success: true };
  });
}

module.exports = { registerJournalHandlers };
