# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # Vite dev server (http://localhost:5173, not 3000 / `npm start` as the README says)
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint 9 flat config (eslint.config.js)
```

There is no test runner or test suite configured. Node >= 22.22 is required, because `react-router` 8 needs it; `.nvmrc` pins Node 24, and Netlify builds with it.

ESLint stays on 9.x: `eslint-plugin-react` doesn't support ESLint 10 yet. `eslint-plugin-react-hooks` 7 includes the React Compiler rules, such as `react-hooks/set-state-in-effect` and `react-hooks/immutability`. Prefer lazy `useState` initializers and refs over working around them.

## Environment

The Marvel API keys come from Vite env vars, read in `src/hooks/useFetch.jsx`:

```
VITE_MARVEL_PUBLIC_API_KEY=...
VITE_MARVEL_PRIVATE_API_KEY=...
```

Put them in a `.env` / `.env.local` file (both are gitignored). Every request is signed client-side with `md5(ts + privateKey + publicKey)`, so the private key ends up in the browser bundle. That is by design for this demo.

## Architecture

A React 19 + Vite 8 (SWC) single-page app, plain JS/JSX with no TypeScript. Routing uses `react-router` 8; import from `'react-router'`, since `react-router-dom` is no longer used. It is deployed on Netlify, where `public/_redirects` handles SPA fallback routing.

- **Entry:** `src/main.jsx` wraps `AppRoutes` in `BrowserRouter`. `src/routes/AppRoutes.jsx` mounts `AudioProvider` → `BackgroundProvider` → the routes:
  - `/` → `app/Home.jsx`: fake login that stores a name in `localStorage['user']`.
  - `/wiki` → `app/Wiki.jsx`: search, cards-per-page and pagination over the character list.
  - `/wiki/:name` → `app/WikiDetails.jsx`: looks up a character by exact **name** (not id), then loads its comics, series and stories.
- **"Auth":** `routes/ProtectedRoute.jsx` wraps both `/wiki` routes and redirects to `/` when `localStorage['user']` is missing. No user context exists.
- **Data layer:** everything lives in `src/hooks/useFetch.jsx`. `marvelGet(path, params)` signs a request to `https://gateway.marvel.com/v1/public` and returns the response's `data` object.
  - `useFetch(searchTerm, page, cardsPerPage)` (default export) returns `{ data, total, loading, error }`, where `total` is the API's total match count and drives pagination.
  - `fetchComics`, `fetchSeries` and `fetchStories` take a **character id** and call `/characters/{id}/{collection}` (one request each, up to 20 items). Don't go back to fetching each item's `resourceURI`: that means dozens of requests, and those URIs are `http://`, which a page served over HTTPS blocks.
  - Async effects use an `ignore` flag so that stale responses are dropped.
- **Contexts:**
  - `BackgroundContext` (`backgroundImage`, `setBackgroundImage`, `clearBackground`) holds the hovered character's image, which `Layout` renders as the page background.
  - `AudioContext` (`isAudioPlaying`, `startAudio`, `stopAudio`; the functions are stable via `useCallback`) plays `assets/audio/intro.m4a` with a 20 s fade-out. `Wiki` starts it on mount and stops it on unmount. `WikiDetails` starts it too, so navigating between them in one commit keeps it playing.
- **Styling:** plain CSS per page/component in `src/assets/styles/`, with BEM-style class names (`layout__header`, `character__card`).

## Style

Prettier (`.prettierrc`): single quotes, semicolons, 2-space indent, trailing commas, 80 columns. Prettier is not installed as a dependency.
