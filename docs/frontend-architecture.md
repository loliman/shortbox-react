# Frontend Architecture Baseline

## Styling Strategy

1. Use MUI `sx` and `theme` as default for component-level styling.
2. Use CSS variables from `src/styles/tokens.css` for global design tokens.
3. Keep global styles in `src/styles/globals.css` minimal and put legacy global rules into `src/styles/legacy.css`.
4. For complex visual areas, use `*.module.scss` (scoped styles) instead of new global selectors.

## Formatting and Code Quality

1. Formatting is handled by Prettier.
2. Quality gates:
   - `npm run format:check`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:ci`

## Build Defaults

Vite build is configured for:

1. `esbuild` minification for JS and CSS.
2. Code-splitting with explicit vendor chunks.
3. Compressed-size reporting enabled.
