# React Testkonzept und Implementierungsplan

## Zielbild

- Primärziel: SonarCloud `new_coverage >= 80%` auf Branch `upgrade`.
- Sekundärziel: Stabiler, schneller Unit-Test-Satz für Kernlogik (ohne flaky UI-Tests).
- Randbedingung: Coverage soll durch echte Tests steigen, nicht durch Ausschluss von produktivem Code.

## Ausgangslage (14. Februar 2026)

- Aktuelle Vitest-Coverage ist auf wenige Dateien begrenzt (`coverage.include`), dadurch lokal hohe Werte.
- Sonar bewertet den gesamten produktiven Quellcode und liegt daher deutlich niedriger.
- Es gibt bereits einen funktionierenden Vitest-Stack mit `jsdom` und `coverage-v8`.

## Testkonzept

### 1. Testpyramide

- Unit-Tests (ca. 70-80%): Utilities, Formatter, Query-/Filter-Helfer, Domain-Mapping.
- Integrationsnahe Komponententests (ca. 15-25%): zustandsbehaftete Komponenten mit Render- und Eventlogik.
- End-to-End (ca. 5%): nur wenige kritische User-Flows, optional in späterer Phase.

### 2. Priorisierung nach Risiko

- Hoch: URL-/Label-Generierung, Filter-Serialisierung, Formatierungslogik, Preview-Flag-Berechnung.
- Mittel: Detail-Komponenten mit komplexer Branch-Logik.
- Niedrig: rein visuelle Wrapper ohne eigene Geschäftslogik.

### 3. Qualitätsregeln für Tests

- Jeder Test deckt ein fachliches Verhalten, nicht interne Implementation Details.
- Für jede neue Branch- oder Fehlerfalllogik mindestens ein Test.
- Deterministische Tests (Zeit mocken, keine echte Netzwerkabhängigkeit).

### 4. Coverage-Strategie

- Coverage-Include wird schrittweise erweitert, parallel zum Testausbau.
- Threshold bleibt bei 80%, bezieht sich aber immer auf den aktuell freigeschalteten Modulumfang.
- So entsteht ein kontrollierter Rollout statt eines Big-Bang-Umstiegs.

## Implementierungsplan

### Phase 1: Utility- und Helper-Fundament

- Neue Tests für:
  - `src/util/listingQuery.ts`
  - `src/util/issuePresentation.ts`
  - `src/util/util.ts`
  - `src/components/filter/serialize.ts`
  - `src/components/details/issue-details/utils/externalLinks.ts`
  - `src/components/details/issue-details/utils/issueMetaFormatters.ts`
  - `src/components/details/issue-details/utils/storyIssueUtils.ts`
  - `src/components/issue-preview/utils/issuePreviewUtils.ts`
- Coverage-Include in `vite.config.mjs` um diese Module erweitern.

### Phase 2: Komplexe Detail-Logik

- Tests für `contains/*`-Hilfslogik und Filter-Abschnitte.
- Fokus auf Branch-heavy Pfade und Regressionen aus Sonar-Rules.

### Phase 3: Datenfluss und UI-Interaktion

- Integrationsnahe Tests für Query-/Mutation-nahe Komponenten mit Mocks.
- Fokus auf Fehler- und Edge-Handling.

### Phase 4: Sonar-Abnahme

- Re-Scan in SonarCloud.
- Ziel: alle Gates grün, ausgenommen Coverage nur falls ausdrücklich so gewünscht.
- Danach Coverage-Ziel auf Sonar aktiv nachziehen.

## Umsetzungsstand

- Phase 1: Welle 1 umgesetzt (Utility-/Helper-Tests + Coverage-Scope erweitert).
- Phase 2: Welle 1 umgesetzt (`contains/expanded`, `issueDetailsUtils`, `sanitizeHtml`, `issues`, zusätzliche Branch-Cases in `issue-sections/helpers`).
- Phase 2: Welle 2 umgesetzt (`filterFieldHelpers`, `contains/toChipList`).
- Phase 2: Welle 3 umgesetzt (user-zentrierte RTL-Komponententests für `TopBarFilterMenu`, `TopBarBreadcrumbs`, `FilterSwitch`, `FormActions`).
- Phase 3: Welle 1 umgesetzt (RTL-Tests für `TopBar` und `SearchBar` inkl. Debounce-/Navigation-/Error-Flow mit Apollo-Mocks).
- Messstand nach Welle 1 in Phase 3 (14. Februar 2026):
  - `npm run test:ci`: 24 Dateien, 97 Tests, alles grün.
  - `npm run test:coverage`: Statements `94.11%`, Branches `81.89%`, Functions `98.82%`, Lines `94.11%`.
