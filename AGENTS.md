# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Vite + React 19 + TypeScript SPA (the "Revenant Customs" motorcycle
showcase). There is no backend, database, or other service — the only thing to run is the
Vite dev server.

### Services / commands

| Task | Command | Notes |
| --- | --- | --- |
| Dev server | `npm run dev` | Serves on port **3000** (`vite --port=3000 --host=0.0.0.0`). This is the only service. |
| Lint / type-check | `npm run lint` | Runs `tsc --noEmit` (no ESLint configured). |
| Production build | `npm run build` | Outputs to `dist/` (gitignored). |
| Preview prod build | `npm run preview` | Serves the built `dist/` (Vite default port 4173). |

The dependency install (`npm install`) is handled by the startup update script, so you do not
need to run it manually unless dependencies changed.

### Non-obvious notes

- **HMR/file-watching is gated by `DISABLE_HMR`** (see `vite.config.ts`). When `DISABLE_HMR=true`,
  file watching is disabled to avoid flicker during agent edits, so the dev server will NOT
  hot-reload your changes — restart `npm run dev` (or unset the var) to pick up edits.
- **`GEMINI_API_KEY` is not required** to run or test the current UI. It is wired into the build
  via `vite.config.ts` and referenced in `.env.example`, but no source file under `src/` actually
  uses it. The app renders and the configurator works without any `.env.local`.
- **Full visual fidelity needs internet access**: background videos are hot-linked from Cloudinary
  (`res.cloudinary.com`) and fonts come from Google Fonts. The app still functions offline, but
  the hero video/fonts won't load.
- **Core flow to smoke-test**: scroll the homepage (or the About page) to the "Configure Your Build"
  button → opens the Bespoke Configurator modal → pick options → fill name + email → submit →
  "Commission Acknowledged" screen with a generated `RVT-...` commission ID.
