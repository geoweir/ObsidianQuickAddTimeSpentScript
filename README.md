# Obsidian + QuickAdd: Log minutes into TaskNotes `timeEntries`

This repo contains a small **QuickAdd User Script** that prompts you for a number of minutes and appends a new **TaskNotes** time entry into the current note’s frontmatter (`timeEntries`).

It’s designed for **TaskNotes v4.x** notes that store entries like:

```yaml
timeEntries:
  - startTime: 2025-12-10T15:04:35.603+00:00
    description: Work session
    endTime: 2025-12-10T16:19:00.000Z
    duration: 74
