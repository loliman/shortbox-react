# shortbox-react

React-Frontend fuer Shortbox (Vite + TypeScript + Apollo Client + MUI).

## Tech Stack

- React 18
- Vite 7
- TypeScript 5
- Apollo Client
- MUI
- Vitest + Testing Library

## Architektur (kurz)

- `src/index.tsx`: App-Bootstrap, Apollo-Client, Auth-/CSRF-Linking
- `src/app/`: Routing, Session-Helfer, Theme, App-spezifische Hooks
- `src/components/`: UI, Detailseiten, Filter, Restricted-Flows (create/edit/copy)
- `src/graphql/`: getypte Dokumente und Query-/Mutation-Exports
- `src/mock/`: Mock-Daten und Apollo-Mock-Link
- `src/util/`: Utility-Funktionen

## Contract

Der GraphQL-Contract liegt extern in:

- `@loliman/shortbox-contract`

In diesem Repo gibt es kein lokales Contract-Codegen-Script mehr.

## Voraussetzungen

- Node.js `>=20 <26`
- npm `>=10 <12`
- Zugriff auf GitHub Packages fuer `@loliman` (siehe `.npmrc`)

## Installation

```bash
npm ci
```

## Lokale Entwicklung

```bash
npm run dev
```

Standard-URL: [http://localhost:5173](http://localhost:5173)

## Wichtige Skripte

- `npm run dev`: Entwicklungsserver
- `npm run start`: Alias fuer Vite dev
- `npm run typecheck`: TypeScript-Pruefung
- `npm run lint`: ESLint
- `npm run format`: Prettier schreiben
- `npm run format:check`: Prettier check
- `npm run test`: Vitest watch mode
- `npm run test:ci`: Vitest einmalig
- `npm run test:coverage`: Vitest mit Coverage
- `npm run build`: Produktionsbuild
- `npm run preview`: Build lokal preview
- `npm run qa`: Check-Artefakte + Typecheck + Lint + Tests + Build

## Umgebungsvariablen

Typische lokale Werte (`.env`):

```env
PUBLIC_URL=https://shortbox.de
REACT_APP_API_URL=http://localhost:4000
VITE_API_URL=http://localhost:4000
```

Weitere relevante Frontend-Variablen:

- `VITE_API_CREDENTIALS` (`include|omit|same-origin`, default `include`)
- `VITE_CSRF_COOKIE_NAME` (default `sb_csrf`)
- `VITE_CSRF_HEADER_NAME` (default `x-csrf-token`)
- `VITE_CSRF_ENABLED` (default `true`)
- `VITE_MOCK_MODE` (`true` aktiviert Mock-Backend)
- `VITE_MOCK_DELAY_MS` (default `120`)

## CI

Workflow: `.github/workflows/ci.yml`

Pipeline-Schritte:

- Install
- Typecheck
- Format-Check
- Lint
- Coverage-Tests
- Build
- SonarCloud Scan

Das Build-Bundle wird als `shortbox-react-<version>.tar.gz` erzeugt.

## Releases

- Auto-Version-Bump nach Merge auf `main`: `.github/workflows/auto-release.yml`
- Label-gesteuert: `major`, `minor`, `patch` (Default ohne Label: `minor`)
- Tag-Release baut ein statisches Deploy-Bundle und haengt es als Asset an das GitHub Release:
  `.github/workflows/release.yml`
