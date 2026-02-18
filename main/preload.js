const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Tasks
  getTasks: (filters) => ipcRenderer.invoke("tasks:getAll", filters),
  createTask: (data) => ipcRenderer.invoke("tasks:create", data),
  updateTask: (id, data) => ipcRenderer.invoke("tasks:update", id, data),
  deleteTask: (id) => ipcRenderer.invoke("tasks:delete", id),

  // Projects
  getProjects: () => ipcRenderer.invoke("projects:getAll"),
  createProject: (data) => ipcRenderer.invoke("projects:create", data),
  updateProject: (id, data) => ipcRenderer.invoke("projects:update", id, data),
  deleteProject: (id) => ipcRenderer.invoke("projects:delete", id),

  // Habits
  getHabits: () => ipcRenderer.invoke("habits:getAll"),
  createHabit: (data) => ipcRenderer.invoke("habits:create", data),
  updateHabit: (id, data) => ipcRenderer.invoke("habits:update", id, data),
  deleteHabit: (id) => ipcRenderer.invoke("habits:delete", id),
  getCompletions: (habitId, startDate, endDate) =>
    ipcRenderer.invoke("habits:getCompletions", habitId, startDate, endDate),
  toggleCompletion: (habitId, date) =>
    ipcRenderer.invoke("habits:toggleCompletion", habitId, date),

  // Goals
  getGoals: () => ipcRenderer.invoke("goals:getAll"),
  createGoal: (data) => ipcRenderer.invoke("goals:create", data),
  updateGoal: (id, data) => ipcRenderer.invoke("goals:update", id, data),
  deleteGoal: (id) => ipcRenderer.invoke("goals:delete", id),
  getMilestones: (goalId) => ipcRenderer.invoke("goals:getMilestones", goalId),
  createMilestone: (data) => ipcRenderer.invoke("goals:createMilestone", data),
  updateMilestone: (id, data) =>
    ipcRenderer.invoke("goals:updateMilestone", id, data),
  deleteMilestone: (id) => ipcRenderer.invoke("goals:deleteMilestone", id),

  // Journal
  getEntries: (filters) => ipcRenderer.invoke("journal:getAll", filters),
  getEntry: (id) => ipcRenderer.invoke("journal:get", id),
  createEntry: (data) => ipcRenderer.invoke("journal:create", data),
  updateEntry: (id, data) => ipcRenderer.invoke("journal:update", id, data),
  deleteEntry: (id) => ipcRenderer.invoke("journal:delete", id),

  // Calendar
  getEvents: (startDate, endDate) =>
    ipcRenderer.invoke("calendar:getEvents", startDate, endDate),
  createEvent: (data) => ipcRenderer.invoke("calendar:createEvent", data),
  updateEvent: (id, data) =>
    ipcRenderer.invoke("calendar:updateEvent", id, data),
  deleteEvent: (id) => ipcRenderer.invoke("calendar:deleteEvent", id),
  getRoutines: () => ipcRenderer.invoke("calendar:getRoutines"),
  createRoutine: (data) => ipcRenderer.invoke("calendar:createRoutine", data),
  updateRoutine: (id, data) =>
    ipcRenderer.invoke("calendar:updateRoutine", id, data),
  deleteRoutine: (id) => ipcRenderer.invoke("calendar:deleteRoutine", id),

  // Settings
  getSetting: (key) => ipcRenderer.invoke("settings:get", key),
  setSetting: (key, value) => ipcRenderer.invoke("settings:set", key, value),
});
