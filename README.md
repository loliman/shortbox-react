# shortbox-react

React-Frontend fuer Shortbox (Vite, TypeScript, Apollo Client, MUI).

## Ueberblick

- Rolle: Browser-Frontend fuer Shortbox
- Stack: React 18, Vite 7, TypeScript 5, Apollo Client, MUI
- Contract-Quelle: `@loliman/shortbox-contract`

## Voraussetzungen

- Node.js `>=20 <26`
- npm `>=10 <12`
- npm-Auth fuer GitHub Packages (`@loliman`)

## Installation

```bash
npm ci
```

## Lokale Entwicklung

```bash
npm run dev
```

Standard-URL: `http://localhost:5173`

## Wichtige Skripte

- `npm run dev`: Entwicklungsserver
- `npm run start`: Alias fuer `dev`
- `npm run typecheck`: TypeScript-Pruefung ohne Emit
- `npm run format`: Prettier write
- `npm run format:check`: Prettier check
- `npm run lint`: ESLint auf `src/`
- `npm run test:ci`: Vitest einmalig
- `npm run test:coverage`: Vitest mit Coverage
- `npm run build`: Produktionsbuild
- `npm run preview`: lokales Preview des Builds
- `npm run qa`: Artifact-Check + Typecheck + Lint + Tests + Build

## Projektstruktur

- `src/index.tsx`: App-Bootstrap, Apollo-Setup, Auth-/CSRF-Linking
- `src/app/`: Routing, Theme, Session- und App-Utilities
- `src/components/`: UI-Komponenten und Feature-Screens
- `src/graphql/`: getypte Dokumente und Query-/Mutation-Exporte
- `src/mock/`: Mock-Daten und Mock-Link
- `src/util/`: Utility-Funktionen

## Umgebungsvariablen

Typische lokale Werte in `.env`:

```env
PUBLIC_URL=https://shortbox.de
REACT_APP_API_URL=http://localhost:4000
VITE_API_URL=http://localhost:4000
```

Weitere relevante Variablen:

- `VITE_API_CREDENTIALS` (`include|omit|same-origin`, default `include`)
- `VITE_CSRF_COOKIE_NAME` (default `sb_csrf`)
- `VITE_CSRF_HEADER_NAME` (default `x-csrf-token`)
- `VITE_CSRF_ENABLED` (default `true`)
- `VITE_MOCK_MODE` (`true` aktiviert Mock-Backend)
- `VITE_MOCK_DELAY_MS` (default `120`)

## CI und Releases

CI-Workflow:

- Datei: `.github/workflows/ci.yml`
- Trigger: Push + Pull Request auf `main`
- Ergebnis: Build-Artifact `shortbox-react-<version>.tar.gz` + Coverage-Artifact

Auto-Release:

- Datei: `.github/workflows/auto-release.yml`
- Trigger: Merge/Push auf `main`
- Verhalten: Label-basiertes Version-Bump (`major`, `minor`, `patch`, Default `minor`) + Tag

Release:

- Datei: `.github/workflows/release.yml`
- Trigger: Tag `v*.*.*`
- Verhalten: Build + Release-Bundle als Asset im GitHub Release

## Hinweise

- Der Contract liegt extern; es gibt hier kein lokales Contract-Codegen-Script.
- Build-Artefakte (`dist/`, `release/`) sind nicht fuer Source-Control gedacht.
