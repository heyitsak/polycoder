# PolyCoder — Zero → Grandmaster

A solo coding-learning webapp for a polytechnic CSE student. 7 tracks (C, C++, Java, Python, JavaScript, SQL, DSA) with 0→Grandmaster ranks, a semester map, and full gamification — no login required.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## How it works

- **Tracks & levels** — content is plain TS data in `src/content/`:
  - `index.ts` — track registry, ranks, semester map (`SEMESTERS`, editable)
  - `factory.ts` — `level()`, `traceLevel()`, `fixLevel()` builders + per-language theory
  - `tracks/*.ts` — the actual levels per track
  - `snippets/*.ts` — per-language starter/solution templates (keyed by archetype)
  - `refs.ts` — JS reference solvers used for DSA expected outputs
- **Grading** — `src/lib/grader.ts`: C/C++/Java/Python/JS run on the Wandbox API (free, no key); SQL runs in-browser via sql.js (offline). `errors.ts` translates common compiler errors into hints. The public Piston API (emkc) is whitelist-only since Feb 2026 — if you self-host a Piston instance, set `VITE_RUNNER=piston` and `VITE_PISTON_URL` to use it instead.
- **Progress** — localStorage (`polycoder:v1` + per-level code autosave `pc_code:<track>:<level>`): XP, gems, streaks, heatmap, achievements, certificates, review-day reminders, per-level notes.
- **Level types** — `code` (write & run), `trace` (choose output), `fixbug` (find the bugs), `boss` (time-limited). Placement tests let experienced students skip early levels.

## Adding a level

1. In `src/content/tracks/<track>.ts`, call `level({ ... })` with id, topic, theory, starterCode, modelSolution, sampleTests, hiddenTests (Piston runs tests via stdin, compare stdout trimmed).
2. Reuse an archetype from `src/content/refs.ts` for expected outputs.
3. `npm run build` to typecheck.

## Notes

- Requires internet for Wandbox (C/C++/Java/Python/JS/DSA levels). SQL works offline.
- Content is validated by `scripts/sqlcheck.mts` (SQL track) and `scripts/codecheck.mts` (every code track's solution run live vs expected outputs).
