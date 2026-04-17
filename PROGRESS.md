# Behavioral Observation App — Progress

Status as of 2026-04-17. Branch: `claude/check-connectivity-UsMXW` (open as PR #11).

## Completed

### Connectivity & resilience
- [x] Online / offline detection (`useConnectivity` hook, status dot in bottom bar)
- [x] Submit button gated when Supabase is unreachable, with inline "server unreachable" banner
- [x] Autosave — every keystroke persists to `localStorage` (works fully offline)
- [x] Student roster is local-first — adding a student always saves locally; Supabase sync is best-effort, so the app is never blocked by the table being missing or the network dropping

### PWA (installable + offline app shell)
- [x] `vite-plugin-pwa` + Workbox integration
- [x] Manifest, theme color, 192/512/maskable icons
- [x] Service worker registration on load
- [x] App installs via "Add to Home Screen" on iOS / Android / desktop Chrome

### Student roster
- [x] `useStudentRoster` hook with localStorage cache + Supabase sync
- [x] `<StudentPicker>` dropdown with "Add new student" and "Manage students" modals
- [x] `ObservationHeader` uses the picker; selecting pre-fills Student Name, Student ID, School
- [x] `supabase/students-table.sql` migration included (run it in Supabase SQL Editor for cross-device sync)

### Voice dictation
- [x] `useSpeechRecognition` hook wrapping the Web Speech API (with graceful no-op when unsupported)
- [x] `<VoiceDictateButton>` — hold-to-talk on mobile, tap-toggle on desktop, live interim transcript
- [x] Wired into the narrative input, observation note, and all three ABC fields

### ABC quick-log
- [x] Eight one-tap antecedent preset chips: Demand placed, Transition, Peer denied, Change in routine, Waiting, Sensory input, Attention withdrawn, Item removed
- [x] Preset tap creates a new ABC entry with the antecedent pre-filled and the current time stamped

### Timers
- [x] **Mutually exclusive:** starting Crisis auto-stops On Task and Off Task (and vice versa); totals and counts commit correctly during the handoff
- [x] Only one timer is ever "running" at a time

### Reports — file-based fallback
- [x] Observer: new **Save File** button writes a full-fidelity `.json` report (email / AirDrop / USB to admin when Supabase is offline)
- [x] Admin: **Upload report file** control parses + validates the envelope and submits through the same code path as a live submit — appears identically in the reports list, with Word/PDF/CSV exports
- [x] File validation rejects non-JSON, missing `kind`, missing `data`, or missing `header`

### Mobile UX pass
- [x] Bottom bar: 2x2 grid of primary actions on mobile, single row on desktop
- [x] Bottom bar respects iOS safe area (`env(safe-area-inset-bottom)`) and hides when the keyboard is open
- [x] 44px minimum tap targets across all buttons and checkboxes
- [x] Mobile-only collapsible sections on the Classroom Environment tab (Visit Notes, Activity Notes, Data Collection Status, Supports, BIP)
- [x] iOS zoom prevention via 16px minimum input font size
- [x] Admin modal is a bottom sheet on mobile, centered card on desktop
- [x] Reports panel cards stack metadata + actions on mobile
- [x] Native `<input type="time">` in ABC entries

### iPad / landscape layout
- [x] Main wrapper widens to `max-w-5xl` on `md+`
- [x] Observation header uses a 4-column grid on `lg+`
- [x] All fixed-bar containers match the widened max width

### Exports
- [x] CSV, Word (.docx), PDF — already in place; each button now respects tap-target minimums
- [x] JSON report envelope (new) for round-trip to admin

---

## Before going live

These two steps need to happen once to make everything work end-to-end in production:

1. **Run the students-table migration**
   Supabase dashboard → SQL Editor → paste `supabase/students-table.sql` → Run. Without this, the student roster silently falls back to localStorage-only (roster not shared across observers/devices).

2. **Verify environment variables on Vercel**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`

Then merge PR #11 to deploy to production.

---

## Future development

### High value / next up
- **Offline submit queue** — when Submit is tapped while offline, queue the report and auto-send when connectivity returns. Today the observer has to manually re-tap Submit, or use the Save File workaround.
- **Branded PWA icons** — current icons are a placeholder blue circle with a white dot. Replace with actual branding.
- **Per-student session history** — on picking a student, optionally show a collapsed list of prior observations for context. (Scope decision was to skip this for MVP.)

### Clinical features considered but descoped
- **IOA (inter-observer agreement)** — would require multi-observer sessions, which the single-session architecture doesn't currently support.
- **Per-student custom behavior list** — today the counter panel is the same set of behaviors for every student.
- **Trend graphs / longitudinal dashboards** — requires server-side aggregation on top of the existing `observations` rows.

### Nice-to-haves
- **Real-time multi-observer sync** — two observers on the same session simultaneously.
- **Email report / send PDF directly to recipient** — today the admin pulls reports; no push workflow.
- **AI-assisted report drafting** (Claude API) — summarize ABC / narrative entries into a draft write-up.
- **Bulk / multi-file upload** on the admin side.
- **De-dup on upload** — currently uploading the same file twice creates two rows (IDs differ). Harmless but noisy.
- **Signed or encrypted JSON report format** — today the file is plaintext JSON.
- **Code-splitting / lazy loading** — bundle is ~2.6 MB uncompressed (~1.2 MB gzip). `docx` and `pdfmake` are the heaviest deps; lazy-loading them at export time would shrink first paint.

### Operational
- **Automated tests** — no test suite yet. Timer auto-stop and upload validation are prime candidates for unit tests.
- **Protect `main` branch on GitHub** — require PR reviews before merge.
- **Storybook or visual regression** — for the bottom bar's mobile/desktop layouts.
