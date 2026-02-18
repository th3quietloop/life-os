const { registerTaskHandlers } = require("./tasks");
const { registerProjectHandlers } = require("./projects");
const { registerHabitHandlers } = require("./habits");
const { registerGoalHandlers } = require("./goals");
const { registerJournalHandlers } = require("./journal");
const { registerCalendarHandlers } = require("./calendar");
const { registerSettingsHandlers } = require("./settings");

function registerAllHandlers(ipcMain) {
  registerTaskHandlers(ipcMain);
  registerProjectHandlers(ipcMain);
  registerHabitHandlers(ipcMain);
  registerGoalHandlers(ipcMain);
  registerJournalHandlers(ipcMain);
  registerCalendarHandlers(ipcMain);
  registerSettingsHandlers(ipcMain);
}

module.exports = { registerAllHandlers };
