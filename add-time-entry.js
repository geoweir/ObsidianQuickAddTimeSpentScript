module.exports = async (params) => {
  const { app, quickAddApi } = params;

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active file");
    return;
  }

  const minsStr = await quickAddApi.inputPrompt("Minutes to add:");
  if (!minsStr) return;

  const mins = Number(minsStr);
  if (!Number.isFinite(mins) || mins <= 0) {
    new Notice("Enter a positive number");
    return;
  }

  const end = new Date();
  const start = new Date(end.getTime() - mins * 60 * 1000);

  console.log("[add-time-entry]", {
    file: file.path,
    mins,
    start,
    end,
  });

  await app.fileManager.processFrontMatter(file, (fm) => {
    if (!Array.isArray(fm.timeEntries)) fm.timeEntries = [];

    fm.timeEntries.push({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: mins,
      description: "Work session",
    });

    fm.dateModified = new Date().toISOString(); // <- refresh kicker
  });

  new Notice(`Logged ${mins} min`);
};
