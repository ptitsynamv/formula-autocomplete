# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A small Create React App (react-scripts 5, React 18, plain JavaScript — no TypeScript) demo of a formula input with autocomplete, built on CodeMirror 6 (`@uiw/react-codemirror`), TanStack React Query v5, and Zustand.

This is a **React** project. The global Angular rules (OnPush, `slg-` prefix, NgRx, `$localize`, `npm run lint`, etc.) do not apply here.

## Commands

- `npm start` — dev server at http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — Jest in watch mode (CRA). Single run / single file: `CI=true npm test -- src/App.test.js`, or filter by name with `-t "<test name>"`.
- No separate lint script: ESLint (`react-app`, `react-app/jest`) runs through react-scripts during `start`/`build`. Formatting is Prettier on save (see `.vscode/settings.json`).

`src/App.test.js` is the unmodified CRA template ("renders learn react link") and fails against the current UI.

## Architecture

Data flow: `App` → `QueryClientProvider` → `AutocompleteInput` → `useDataService` → `useHttp` → `fetch`.

- [src/hooks/http.hook.js](src/hooks/http.hook.js) — `useHttp` wraps `useQuery` (key `['repoData']`) and fetches the suggestion list from a hardcoded mockapi.io endpoint. Each item is expected to have at least `id` and `name`.
- [src/service/DataService.js](src/service/DataService.js) — `useDataService`, a thin pass-through over `useHttp`; the intended seam for adding API methods/transforms.
- [src/components/autocomplete-input/AutocompleteInput.js](src/components/autocomplete-input/AutocompleteInput.js) — everything else:
  - `myCompletions(context, data)` is the CodeMirror completion source (wired via `autocompletion({ override: [...] })`). It offers suggestions only when the cursor is on the first word, or the current token is preceded by an operator (`+ - * / ^ ( )`). Each item's `name` becomes the completion `label`/`apply`.
  - A Zustand store (`tags`, `addTag`, `removeTag`, with `devtools`) receives the editor value on every `onChange`.
  - `View` renders the CodeMirror editor once data has loaded; loading/error states are simple `<p>` placeholders.

Known quirks worth knowing before editing:
- The Zustand store is created with `create(...)` **inside** the component body, so a new store is made on every render. Move it to module scope (or its own file) if state needs to persist.
- `addTag` replaces `tags` with `[newTag]` (the full editor string) rather than appending.
- `@codemirror/autocomplete` and `@codemirror/language` are imported directly but are not listed in `package.json`; they resolve as transitive deps of `@uiw/react-codemirror`.
