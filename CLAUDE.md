# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint 9 flat config (eslint.config.js)
```

There is no test runner or test suite configured. Node >= 22.22 is required, because `react-router` 8 needs it; `.nvmrc` pins Node 24, and Netlify builds with it.

ESLint stays on 9.x: `eslint-plugin-react` doesn't support ESLint 10 yet. `eslint-plugin-react-hooks` 7 includes the React Compiler rules, such as `react-hooks/set-state-in-effect` and `react-hooks/immutability`. Prefer lazy `useState` initializers and refs over working around them.

## Data source

The Marvel developer API (`gateway.marvel.com`) was retired in late 2025: it answers every request with HTTP 500, and `developer.marvel.com` redirects to marvel.com. Don't try to bring it back. The app uses the open [SuperHero API](https://github.com/akabab/superhero-api) dataset instead. It is one `all.json`, pinned to tag `0.3.0` and served by jsDelivr, with no API key and CORS enabled. It holds 563 characters, of which the app keeps the 269 whose publisher is `"Marvel Comics"`. It has powerstats, biography, appearance, work, connections and images (`xs`/`sm`/`md`/`lg`), but no comics, series or stories. Unknown values come as `'-'`, `''` or `null`.

## Architecture

A React 19 + Vite 8 (SWC) single-page app, plain JS/JSX with no TypeScript. Routing uses `react-router` 8; import from `'react-router'`, since `react-router-dom` is no longer used. It is deployed on Netlify, where `public/_redirects` handles SPA fallback routing.

- **Entry:** `src/main.jsx` wraps `AppRoutes` in `BrowserRouter`. `src/routes/AppRoutes.jsx` mounts `AudioProvider` → `BackgroundProvider` → the routes:
  - `/` → `app/Home.jsx`: fake login that stores a name in `localStorage['user']`.
  - `/wiki` → `app/Wiki.jsx`: search, cards-per-page and pagination, all client-side. Their state lives in the URL (`?q=&page=&per=`; default values are omitted), so Back from a character page restores the results.
  - `/wiki/:slug` → `app/WikiDetails.jsx`: the character whose dataset `slug` matches (e.g. `620-spider-man`), shown in Powerstats/Biography/Appearance/Connections tabs.
- **"Auth":** `routes/ProtectedRoute.jsx` wraps both `/wiki` routes and redirects to `/` when `localStorage['user']` is missing.
- **Data layer:** `src/hooks/useCharacters.js`. `loadCharacters()` downloads the dataset once per page load (a module-level promise; a failure is not cached), keeps the Marvel characters, sorts them by name and precomputes normalized search fields. `useCharacters()` returns `{ characters, loading, error, retry }`, and both pages use it.
- **Search:** `src/utils/search.js`. `normalize()` lowercases, strips accents and drops non-alphanumerics, so "spiderman" matches "Spider-Man". `searchCharacters()` ranks name-prefix matches first, then name-contains, then real name/alias matches. `Wiki` filters on every keystroke through `useDeferredValue`.
- **Contexts:**
  - `BackgroundContext` (`backgroundImage`, `setBackgroundImage`, `clearBackground`) holds the hovered character's image, which `Layout` renders as the page background.
  - `AudioContext` (`isAudioPlaying`, `startAudio`, `stopAudio`; the functions are stable via `useCallback`) plays `assets/audio/intro.m4a` with a 20 s fade-out. `Wiki` starts it on mount and stops it on unmount. `WikiDetails` starts it too, so navigating between them in one commit keeps it playing.
- **Styling:** plain CSS per page/component in `src/assets/styles/`, with BEM-style class names (`layout__header`, `character__card`).

## Style

Prettier (`.prettierrc`): single quotes, semicolons, 2-space indent, trailing commas, 80 columns. Prettier is not installed as a dependency.
