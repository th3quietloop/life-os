const { getDb } = require("../database");

function registerSettingsHandlers(ipcMain) {
  ipcMain.handle("settings:get", (_event, key) => {
    const db = getDb();
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
    return row ? row.value : null;
  });

  ipcMain.handle("settings:set", (_event, key, value) => {
    const db = getDb();
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(
      key,
      value
    );
    return { success: true };
  });
}

module.exports = { registerSettingsHandlers };
