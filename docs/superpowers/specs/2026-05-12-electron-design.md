# Electron Desktop App — Design Spec

**Date:** 2026-05-12  
**Project:** BehavioralObservationApp  
**Approach:** Option A — Minimal Electron wrapper

---

## Goal

Add Electron so the app can be distributed as a packaged Windows `.exe` installer. All existing functionality (localStorage persistence, Supabase sync, CSV/Word/PDF exports, timers, counters, narrative, ABC data, voice dictation) is preserved unchanged.

---

## Architecture

The React+Vite web app is untouched. Electron wraps it:

```
BehavioralObservationApp/
├── electron/
│   ├── main.js          # Electron main process — creates BrowserWindow
│   └── preload.js       # Minimal preload (contextIsolation, no Node in renderer)
├── electron-builder.yml # Packaging config → Windows NSIS installer
├── src/                 # Existing React app (no changes)
├── dist/                # Vite output (renderer files for Electron)
└── dist-electron/       # electron-builder output (installer)
```

---

## New Files

### `electron/main.js`
- Creates a `BrowserWindow` (1280×900, resizable)
- Security: `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true`
- Dev: loads `http://localhost:5173` (Vite dev server)
- Production: loads `dist/index.html` via `app.loadFile`
- Handles `ready-to-show` (shows window once renderer is ready, avoids flash)
- Handles `window-all-closed` / `activate` lifecycle events

### `electron/preload.js`
- Empty for now — satisfies Electron's security model
- Preserves the ability to add IPC/native features later without restructuring

### `electron-builder.yml`
- App ID: `com.abaspot.behavioral-observation`
- Product name: `Behavioral Observation`
- Target: Windows NSIS installer (`.exe`)
- Output: `dist-electron/`
- Files: `dist/**` (Vite build output) + `electron/**` + `package.json`

---

## `package.json` Changes

Four scripts added; all existing scripts unchanged:

| Script | Command |
|---|---|
| `electron:dev` | `concurrently "vite" "electron ."` |
| `electron:build` | `BUILD_TARGET=electron vite build && electron-builder` |
| `build:web` | `vite build` (alias for existing web build) |

New dev dependencies: `electron`, `electron-builder`, `concurrently`

---

## Vite Config Change

`vite.config.js`: set `base: './'` so all asset URLs are relative — required for `loadFile` to resolve CSS/JS from `dist/index.html`.

Also wrap the `VitePWA` plugin in a conditional:

```js
...(process.env.BUILD_TARGET !== 'electron' ? [VitePWA({ ... })] : [])
```

- Web build (`build:web`): PWA fully intact
- Electron build (`electron:build`): PWA plugin skipped, no service worker errors

---

## What Is Not Changed

- All React components, hooks, and logic
- All exports (CSV, Word/docx, PDF, JSON)
- localStorage persistence and Supabase sync
- Voice dictation (Web Speech API works in Electron's Chromium)
- PWA for the web version

---

## Environment Variables

Baked in at build time via Vite's `import.meta.env`. Before running `electron:build`, set:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_PASSWORD=...
```

Same process as the web build. Credentials are embedded in the built JS.

---

## Out of Scope

- Auto-updater (electron-updater)
- Native menus / tray icon
- IPC between main and renderer
- macOS / Linux builds
- Code signing / notarization
