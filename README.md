# Formula Autocomplete

[![Build](https://github.com/ptitsynamv/formula-autocomplete/actions/workflows/ci.yml/badge.svg)](https://github.com/ptitsynamv/formula-autocomplete/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack%20Query-v5-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4.5-443E38)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-D30707?logo=codemirror&logoColor=white)
![Create React App](https://img.shields.io/badge/Create%20React%20App-5.0.1-09D3AC?logo=createreactapp&logoColor=white)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)

A formula input with context-aware autocomplete, similar to the formula bar in a spreadsheet. As you type a formula such as `revenue - cost * 2`, the editor suggests variable names loaded from a remote API, both at the start of the formula and after each operator.

Built with **React 18**, **TanStack React Query**, **Zustand** and **CodeMirror 6**.

## Features

- **Code-editor input.** The formula field is a CodeMirror 6 editor (via `@uiw/react-codemirror`), so you get cursor handling, undo/redo and keyboard navigation of suggestions.
- **Suggestions that follow the formula.** Suggestions open for the first word, or for a word that comes after an operator: `+ - * / ^ ( )`.
- **Suggestions from an API.** The list of names is fetched once with React Query, which handles caching and the loading and error states.
- **Zustand store.** The current formula is saved in a Zustand store that you can inspect with the Redux DevTools extension.

## Prerequisites

| Tool | Version |
| ---- | ------- |
| [Node.js](https://nodejs.org/) | 18 LTS or newer (tested on 24.22.1) |
| npm | Comes with Node (the lockfile is v3, which needs npm 7+) |

This project uses **Create React App** (`react-scripts` 5.0.1), which is no longer maintained. It works on current Node versions. If you hit an environment problem, switch to a known-good LTS with [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows):

```bash
nvm install 20
nvm use 20
```

## Getting started

```bash
# 1. Clone
git clone https://github.com/ptitsynamv/formula-autocomplete.git
cd formula-autocomplete

# 2. Install exact locked dependencies
npm ci

# 3. Start the dev server
npm start
```

The app opens at <http://localhost:3000> and reloads when you edit a file.

You need internet access: suggestions are fetched from a mock API at `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`. Each item needs at least `id` and `name`.

### Available scripts

| Command | What it does |
| ------- | ------------ |
| `npm start` | Runs the dev server on port 3000 with hot reload. ESLint warnings appear in the terminal and the browser. |
| `npm run build` | Makes an optimized production build in `build/`. |
| `npm test` | Runs Jest in interactive watch mode. Use `CI=true npm test` to run it once. |
| `npm run eject` | Copies the CRA config into the project. **One-way**; you can't undo it. |

To preview the production build:

```bash
npx serve -s build
```

## Project structure

```text
formula-autocomplete/
├── public/                         # Static assets and the index.html shell
├── src/
│   ├── components/
│   │   └── autocomplete-input/
│   │       ├── AutocompleteInput.js   # CodeMirror editor, completion source, Zustand store
│   │       └── autocompleteInput.css
│   ├── hooks/
│   │   └── http.hook.js            # useHttp: React Query useQuery that fetches suggestions
│   ├── service/
│   │   └── DataService.js          # useDataService: data-access layer over useHttp
│   ├── App.js                      # Root component, provides the QueryClient
│   └── index.js                    # Entry point, mounts <App /> in React.StrictMode
├── package.json
└── LICENSE
```

### How it works

```text
App ─► QueryClientProvider ─► AutocompleteInput ─► useDataService ─► useHttp ─► fetch(mock API)
                                     │
                                     ├─ CodeMirror + autocompletion({ override: [myCompletions] })
                                     └─ Zustand store (tags) ◄── editor onChange
```

`myCompletions` looks at the text before the cursor. It returns the fetched items as completion options, using each item's `name` as the label and the inserted text, but only when the cursor is on the first word or right after an operator.

## Known limitations

- `src/App.test.js` is still the default test that came with Create React App. It looks for a "learn react" link, so it fails until it's rewritten for this UI.
- The mock API URL is hardcoded in `src/hooks/http.hook.js` and isn't set through an environment variable.

## License

Released under the [MIT License](LICENSE). © 2024 Maria.
