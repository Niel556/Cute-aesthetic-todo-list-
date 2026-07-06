# Coquette ♡

A pastel girly to-do list desktop app built with Electron + React.

![coquette](assets/icon.ico)

## Features

- **Today** — check off tasks, track progress with a ring, log your mood and daily notes, get a daily affirmation with floating sparkles
- **Tasks** — create, edit, delete tasks with color swatches and priority tags (💫 low / ⭐ medium / 🌟 high)
- **Stats** — view current and longest streaks, completion rate, a 28-day heatmap, and a 30-day bar chart

## Stack

- Electron 31
- React 18 + Vite
- Recharts (charts)
- electron-builder (NSIS installer)
- localStorage persistence

## Getting Started

```bash
npm install
npm run dev              # Vite dev server (port 5173)
npm run electron:dev     # Full Electron + Vite dev
npm run electron:build   # Build NSIS installer
```

The installer will be in `release/Coquette Setup.exe`.
