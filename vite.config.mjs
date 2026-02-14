import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    {
      name: "treat-js-as-jsx",
      async transform(code, id) {
        if (!/src\/.*\.js$/.test(id)) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  envPrefix: ["VITE_", "REACT_APP_"],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, "/");

          if (normalized.includes("/src/graphql/typed-documents.generated.ts")) {
            return "graphql-documents";
          }
          if (
            normalized.includes("/src/graphql/queriesTyped.ts") ||
            normalized.includes("/src/graphql/mutationsTyped.ts")
          ) {
            return "graphql-runtime";
          }

          if (!normalized.includes("node_modules")) return;

          if (
            normalized.includes("/node_modules/react/") ||
            normalized.includes("/node_modules/react-dom/") ||
            normalized.includes("/node_modules/scheduler/")
          ) {
            return "vendor-react";
          }
          if (
            normalized.includes("/node_modules/@mui/") ||
            normalized.includes("/node_modules/@emotion/")
          ) {
            return "vendor-mui";
          }

          if (
            normalized.includes("/node_modules/@apollo/") ||
            normalized.includes("/node_modules/graphql") ||
            normalized.includes("/node_modules/graphql-tag")
          ) {
            return "vendor-apollo";
          }
          if (
            normalized.includes("/node_modules/lodash") ||
            normalized.includes("/node_modules/query-string") ||
            normalized.includes("/node_modules/dateformat")
          ) {
            return "vendor-utils";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "lcov", "json-summary"],
      include: [
        "src/util/hierarchy.ts",
        "src/util/listingQuery.ts",
        "src/util/issuePresentation.ts",
        "src/util/filterFieldHelpers.ts",
        "src/util/issues.ts",
        "src/util/sanitizeHtml.ts",
        "src/util/util.ts",
        "src/util/yupSchema.ts",
        "src/components/filter/serialize.ts",
        "src/components/filter/FilterSwitch.tsx",
        "src/components/filter/FormActions.tsx",
        "src/components/details/issue-details/contains/expanded.ts",
        "src/components/details/issue-details/contains/toChipList.tsx",
        "src/components/details/issue-details/utils/externalLinks.ts",
        "src/components/details/issue-details/utils/issueDetailsUtils.ts",
        "src/components/details/issue-details/utils/issueMetaFormatters.ts",
        "src/components/details/issue-details/utils/storyIssueUtils.ts",
        "src/components/issue-preview/utils/issuePreviewUtils.ts",
        "src/components/top-bar/TopBarFilterMenu.tsx",
        "src/components/top-bar/TopBarBreadcrumbs.tsx",
        "src/components/restricted/editor/IssueEditorSections.tsx",
        "src/components/restricted/editor/issue-sections/helpers.ts",
        "src/test/mocks/domainMocks.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
