import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import {
  generateLabel,
  generateUrl,
  HierarchyLevel,
  type HierarchyLevelType,
} from "../../util/hierarchy";
import type { SelectedRoot } from "../../types/domain";

type BreadcrumbProps = {
  level?: HierarchyLevelType;
  us?: boolean;
  selected?: SelectedRoot;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
};

type BreadcrumbMode = "compact" | "expanded";

type BreadcrumbToken =
  | { kind: "link"; key: string; to: string; label: string; icon?: "back" }
  | { kind: "current"; key: string; label: string }
  | { kind: "separator"; key: string };

const EMPTY_SELECTED: SelectedRoot = { us: false };

export function buildBreadcrumbTokens(
  props: Pick<BreadcrumbProps, "level" | "us" | "selected">,
  mode: BreadcrumbMode
): BreadcrumbToken[] {
  const us = Boolean(props.us);
  const selected = props.selected || { ...EMPTY_SELECTED, us };
  const level = props.level ?? HierarchyLevel.ROOT;

  if (level === HierarchyLevel.ROOT) return [];

  if (mode === "compact") {
    if (level === HierarchyLevel.PUBLISHER) {
      return [
        { kind: "link", key: "back-root", to: us ? "/us" : "/de", label: "Zurück", icon: "back" },
        { kind: "current", key: "publisher", label: generateLabel(selected) },
      ];
    }

    if (level === HierarchyLevel.SERIES && selected.series?.publisher) {
      return [
        {
          kind: "link",
          key: "back-publisher",
          to: generateUrl({ publisher: selected.series.publisher }, us),
          label: "Zurück",
          icon: "back",
        },
        { kind: "current", key: "series", label: generateLabel(selected) },
      ];
    }

    if (level === HierarchyLevel.ISSUE && selected.issue?.series?.publisher) {
      return [
        {
          kind: "link",
          key: "back-series",
          to: generateUrl({ series: selected.issue.series }, us),
          label: "Zurück",
          icon: "back",
        },
        { kind: "current", key: "issue", label: "#" + selected.issue.number },
      ];
    }

    return [];
  }

  if (level === HierarchyLevel.PUBLISHER) {
    return [{ kind: "current", key: "publisher", label: generateLabel(selected) }];
  }

  if (level === HierarchyLevel.SERIES && selected.series) {
    return [
      {
        kind: "link",
        key: "publisher",
        to: generateUrl({ publisher: selected.series.publisher }, us),
        label: generateLabel({ publisher: selected.series.publisher }),
      },
      { kind: "separator", key: "sep-series" },
      { kind: "current", key: "series", label: generateLabel(selected) },
    ];
  }

  if (level === HierarchyLevel.ISSUE && selected.issue) {
    return [
      {
        kind: "link",
        key: "publisher",
        to: generateUrl({ publisher: selected.issue.series.publisher }, us),
        label: generateLabel({ publisher: selected.issue.series.publisher }),
      },
      { kind: "separator", key: "sep-publisher" },
      {
        kind: "link",
        key: "series",
        to: generateUrl({ series: selected.issue.series }, us),
        label: generateLabel({ series: selected.issue.series }),
      },
      { kind: "separator", key: "sep-issue" },
      { kind: "current", key: "issue", label: "#" + selected.issue.number },
    ];
  }

  return [];
}

export function BreadcrumbCompact(props: BreadcrumbProps) {
  return <BreadcrumbNav {...props} mode="compact" />;
}

export function BreadcrumbExpanded(props: BreadcrumbProps) {
  return <BreadcrumbNav {...props} mode="expanded" />;
}

function BreadcrumbNav(props: BreadcrumbProps & { mode: BreadcrumbMode }) {
  const tokens = buildBreadcrumbTokens(props, props.mode);
  if (tokens.length === 0) return null;

  return (
    <Box component="nav" aria-label="Breadcrumb" sx={{ minWidth: 0 }}>
      <Box
        component="ol"
        sx={{
          m: 0,
          p: 0,
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          gap: 0.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {tokens.map((token) => (
          <Box
            component="li"
            key={token.key}
            sx={{ display: "inline-flex", alignItems: "center", minWidth: 0 }}
          >
            {token.kind === "separator" ? <KeyboardArrowRightIcon fontSize="small" /> : null}
            {token.kind === "current" ? <span>{token.label}</span> : null}
            {token.kind === "link" ? (
              <Link
                component="button"
                type="button"
                underline="hover"
                color="inherit"
                sx={{
                  p: 0,
                  border: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  minWidth: 0,
                  textAlign: "left",
                }}
                onClick={(e) => {
                  props.navigate?.(e, token.to);
                }}
              >
                {token.icon === "back" ? <KeyboardArrowLeftIcon fontSize="small" /> : token.label}
              </Link>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
