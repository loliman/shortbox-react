import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CoverTooltip from "../../../nav-bar/CoverTooltip";
import { generateLabel, generateUrl } from "../../../../util/hierarchy";
import { romanize } from "../../../../util/util";
import type { SelectedRoot } from "../../../../types/domain";
import { IssueReferenceInline } from "../../../generic/IssueNumberInline";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type ContainsIssueLike = {
  number?: string | number;
  legacy_number?: string | null;
  format?: string | null;
  variant?: string | null;
  stories?: Array<unknown> | null;
  series?: {
    title?: string;
    volume?: number;
    publisher?: { name?: string; us?: boolean };
  };
  issue?: {
    number?: string | number;
    series?: {
      title?: string;
      volume?: number;
      publisher?: { name?: string; us?: boolean };
    };
  };
};

type ContainsParentLike = {
  title?: string | null;
  collectedmultipletimes?: boolean;
  collected?: boolean;
  reprintOf?: { issue?: ContainsIssueLike; number?: string | number } | null;
  issue?: ContainsIssueLike;
  number?: string | number;
};

type ContainsItemLike = {
  number?: string | number;
  title?: string | null;
  part?: string | null;
  addinfo?: string | null;
  url?: string | null;
  exclusive?: boolean;
  firstapp?: boolean;
  onlyapp?: boolean;
  onlytb?: boolean;
  otheronlytb?: boolean;
  onlyoneprint?: boolean;
  collectedmultipletimes?: boolean;
  collected?: boolean;
  parent?: ContainsParentLike | null;
  issue?: ContainsIssueLike;
};

type ContainsTitleDetailedProps = {
  item: ContainsItemLike;
  us?: boolean;
  simple?: boolean;
  isCover?: boolean;
  session?: unknown;
  compactLayout?: boolean;
  isPhone?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  drawerOpen?: boolean;
  isPhonePortrait?: boolean;
  navigate?: NavigateFn;
};

export function ContainsTitleDetailed(props: Readonly<ContainsTitleDetailedProps>) {
  const item = props.item;
  const issue = resolveIssueForDetails(item);
  const issueSelection = issue ? toIssueSelection(issue) : null;
  const storyExpandNumber = String(item.parent?.number ?? item.number ?? "").trim();
  const storyNumberBadge = getStoryNumberBadge(item);

  const stackActions =
    props.compactLayout ??
    Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const exclusive = Boolean(item.exclusive && !props.us);
  const variant = !props.us && issue?.variant ? " " + issue.variant : "";
  const itemTitle = normalizeDisplayStoryTitle(item.title);
  const parentTitle =
    !itemTitle && item.parent?.title ? normalizeDisplayStoryTitle(item.parent.title) : undefined;
  const addinfoText = buildAddinfoText(item);
  const reprintSelection = item.parent?.reprintOf?.issue
    ? toIssueSelection(item.parent.reprintOf.issue)
    : null;
  const hasIssueReference = Boolean(issue?.series);
  const titleSuffix = itemTitle ? (hasIssueReference ? " - " + itemTitle : itemTitle) : "";
  const actionChips = buildDetailedActionChips({
    item,
    isCover: props.isCover,
    exclusive,
    hasSession: Boolean(props.session),
  });
  const detailButton =
    !exclusive && issue && issueSelection ? (
      <CoverTooltip issue={issue} us={props.us}>
        <IconButton
          component="span"
          onClick={(e) => {
            e.stopPropagation();
            props.navigate?.(e, generateUrl(issueSelection, !props.us), {
              filter: null,
              expand: storyExpandNumber || undefined,
            });
          }}
          aria-label="Details"
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </CoverTooltip>
    ) : null;

  return (
    <Box
      sx={
        stackActions
          ? {
              width: "100%",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              alignItems: "start",
              columnGap: 1,
            }
          : {
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }
      }
    >
      <Box sx={{ minWidth: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            <IssueReferenceInline
              seriesLabel={
                hasIssueReference
                  ? generateLabel({ series: issue?.series as any } as any)
                  : undefined
              }
              number={hasIssueReference ? issue?.number : undefined}
              legacy_number={issue?.legacy_number}
            />
            {storyNumberBadge ? (
              <Box component="span" sx={{ color: "text.primary", fontWeight: "inherit" }}>
                {storyNumberBadge}
              </Box>
            ) : null}
            {titleSuffix ? (
              <Box component="span" sx={{ fontWeight: hasIssueReference ? 400 : 600 }}>
                {titleSuffix}
              </Box>
            ) : null}
          </Typography>
          {parentTitle ? (
            <Typography variant="body2" color="text.secondary">
              {parentTitle}
            </Typography>
          ) : null}
          {variant ? (
            <Typography variant="body2" color="text.secondary">
              {variant} Variant
            </Typography>
          ) : null}
        </Box>

        {item.parent?.reprintOf?.issue ? (
          <CoverTooltip
            issue={item.parent.reprintOf.issue}
            us={props.us}
            number={item.parent.reprintOf.number}
          >
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="hover"
              color="text.secondary"
              sx={{
                p: 0,
                textAlign: "left",
                lineHeight: 1.43,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!reprintSelection) return;
                props.navigate?.(e, generateUrl(reprintSelection, true), {
                  expand: item.parent?.reprintOf?.number,
                  filter: null,
                });
              }}
            >
              Original erschienen als{" "}
              <Box
                component="span"
                sx={{ textDecoration: "underline", textUnderlineOffset: "2px", color: "inherit" }}
              >
                {reprintSelection ? generateLabel(reprintSelection) : ""}
              </Box>
            </Link>
          </CoverTooltip>
        ) : null}

        <Typography variant="body2" color="text.secondary">
          {addinfoText !== "" ? addinfoText : null}
        </Typography>

        {stackActions && actionChips.length > 0 ? (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              alignItems: "center",
            }}
          >
            {actionChips}
          </Box>
        ) : null}
      </Box>

      {stackActions ? (
        <Box sx={{ justifySelf: "end", alignSelf: "center" }}>{detailButton}</Box>
      ) : (
        <Box
          sx={{
            ml: "auto",
            alignSelf: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {actionChips}
          {detailButton}
        </Box>
      )}
    </Box>
  );
}

function buildAddinfoText(item: ContainsItemLike): string {
  let addinfoText = "";
  if (item.part && item.part.indexOf("/x") === -1) {
    addinfoText += "Teil " + item.part.replace("/", " von ");
  }
  if (addinfoText !== "" && item.addinfo) {
    addinfoText += ", ";
  }
  if (item.addinfo) {
    addinfoText += item.addinfo;
  }
  return addinfoText;
}

function resolveIssueForDetails(item: ContainsItemLike): ContainsIssueLike | undefined {
  const baseIssue = item.parent?.issue ? item.parent.issue : item;
  if (baseIssue && baseIssue.issue) {
    return {
      ...baseIssue,
      number: baseIssue.issue.number,
      legacy_number: (baseIssue.issue as { legacy_number?: string | null }).legacy_number,
      series: baseIssue.issue.series,
    };
  }
  return baseIssue;
}

function toIssueSelection(issue: ContainsIssueLike): SelectedRoot {
  return { issue: issue as SelectedRoot["issue"] };
}

function buildDetailedActionChips({
  item,
  isCover,
  exclusive,
  hasSession,
}: {
  item: ContainsItemLike;
  isCover?: boolean;
  exclusive: boolean;
  hasSession: boolean;
}): React.ReactElement[] {
  const chips: React.ReactElement[] = [];

  if (!isCover && item.url && item.number === 0) {
    chips.push(<Chip key="cover" label="Cover" color="default" />);
  }

  if (!isCover && item.onlyapp && item.parent) {
    chips.push(<Chip key="onlyapp" label="Einzige Veröffentlichung" color="secondary" />);
  }

  if (!isCover && !item.onlyapp && item.firstapp && item.parent) {
    chips.push(<Chip key="firstapp" label="Erstveröffentlichung" color="primary" />);
  }

  if (!isCover && item.otheronlytb && item.parent) {
    chips.push(
      <Chip key="otheronlytb" variant="outlined" label="Sonst nur in Taschenbuch" color="default" />
    );
  }

  if (exclusive) {
    chips.push(<Chip key="exclusive" label="Exklusiv" color="secondary" />);
  }

  if (item.parent?.collectedmultipletimes && hasSession) {
    chips.push(<Chip key="collectedmultiple" color="success" label="Mehrfach gesammelt" />);
  }

  if (!item.parent?.collectedmultipletimes && item.parent?.collected && hasSession) {
    chips.push(<Chip key="collected" color="success" label="Gesammelt" />);
  }

  return chips;
}

function normalizeDisplayStoryTitle(value: string | null | undefined): string {
  const normalized = String(value || "").trim();
  return normalized === "Untitled" ? "" : normalized;
}

function getStoryNumberBadge(item: ContainsItemLike): string {
  const storyNumber = Number(item.parent?.number);
  const storyCount = Array.isArray(item.parent?.issue?.stories)
    ? item.parent.issue.stories.length
    : 0;

  if (!Number.isFinite(storyNumber) || storyNumber <= 0 || storyCount <= 1) return "";
  return ` [${romanize(storyNumber)}]`;
}
