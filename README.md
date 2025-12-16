# Obsidian + QuickAdd: Log minutes into TaskNotes `timeEntries`

This repository contains a **QuickAdd User Script** for Obsidian that lets you very quickly log time against a TaskNotes task by entering a number of minutes.

The script appends a correctly‑shaped entry to the task note’s `timeEntries` frontmatter array, matching what **TaskNotes v4.x** already uses internally.a

---

## What this does

- Prompts for a number of minutes
- Calculates:
  - `endTime` = now
  - `startTime` = now minus minutes
- Appends a new item to `timeEntries`
- Updates `dateModified` to help TaskNotes refresh derived UI fields

---

## Expected TaskNotes schema

This script assumes your task notes use a schema like:

```yaml
timeEntries:
  - startTime: 2025-12-10T15:04:35.603+00:00
    endTime: 2025-12-10T16:19:00.000Z
    duration: 74
    description: Work session
```

If your notes already contain `timeEntries` created by TaskNotes, you are good to go.

---

## Requirements

- Obsidian (desktop)
- Community plugins enabled
- Plugins installed:
  - **QuickAdd**
  - **TaskNotes** (or compatible notes using the same `timeEntries` schema)

---

## Installation

### 1. Create the script file

Inside your vault, create the following path:

```
.obsidian/plugins/quickadd/scripts/add-time-entry.js
```

Create the `scripts` directory if it does not already exist.

---

### 2. Script contents

Paste the following into `add-time-entry.js`:

```js
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

  try {
    await app.commands.executeCommandById("editor:save-file");
  } catch (_) {}

  await app.fileManager.processFrontMatter(file, (fm) => {
    if (!Array.isArray(fm.timeEntries)) fm.timeEntries = [];

    fm.timeEntries.push({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: mins,
      description: "Work session",
    });

    fm.dateModified = new Date().toISOString();
  });

  new Notice(`Logged ${mins} min`);
};
```

---

## QuickAdd setup

### 1. Create a macro

1. Open **Settings → QuickAdd**
2. Go to **Manage Macros**
3. Create a new macro (suggested name: `Log Time (minutes)`)

---

### 2. Add the User Script step

1. Add a **User Script** step to the macro
2. Select `add-time-entry.js`
3. Remove any other steps (especially blank or missing Obsidian command steps)

---

### 3. Assign a hotkey (recommended)

1. Go to **Settings → Hotkeys**
2. Search for your macro name
3. Assign a hotkey

---

## Usage

1. Open the TaskNotes task note you want to log time against
2. Trigger the QuickAdd macro (or press the hotkey)
3. Enter a number of minutes
4. The entry is appended to `timeEntries`

---

## Debugging

### Developer console

Open the Obsidian developer console:

- macOS: `Cmd + Opt + I`
- Windows/Linux: `Ctrl + Shift + I`

Look for logs or errors related to QuickAdd or TaskNotes.

---

## Notes

- This intentionally avoids editing YAML as raw text — Obsidian handles serialization safely.
- TaskNotes derived displays (tracked time strings, badges, etc.) may require a brief refresh (close/reopen the note or switch panes).
- No PRs, no plugin forks, no upstream changes required.

---

## License

GPLv3
