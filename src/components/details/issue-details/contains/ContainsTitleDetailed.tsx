import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CoverTooltip from "../../../nav-bar/CoverTooltip";
import { generateItemTitle } from "../../../../util/issues";
import { generateLabel, generateUrl } from "../../../../util/hierarchy";
import type { SelectedRoot } from "../../../../types/domain";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type ContainsIssueLike = {
  number?: string | number;
  format?: string | null;
  variant?: string | null;
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
  isPhone?: boolean;
  isTablet?: boolean;
  drawerOpen?: boolean;
  isPhonePortrait?: boolean;
  navigate?: NavigateFn;
};

export function ContainsTitleDetailed(props: Readonly<ContainsTitleDetailedProps>) {
  const item = props.item;
  const issue = resolveIssueForDetails(item);
  const issueSelection = issue ? toIssueSelection(issue) : null;

  const smallChip =
    Boolean(props.isPhone) || (Boolean(props.isTablet) && Boolean(props.drawerOpen));
  const exclusive = Boolean(item.exclusive && !props.us);
  const variant = !props.us && issue?.variant ? " " + issue.variant : "";
  const parentTitle = !item.title && item.parent?.title ? item.parent.title : undefined;
  const addinfoText = buildAddinfoText(item);
  const reprintSelection = item.parent?.reprintOf?.issue
    ? toIssueSelection(item.parent.reprintOf.issue)
    : null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {generateItemTitle(item.issue ? item.issue : item, Boolean(props.us))}
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
      </Box>

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
        {!props.isCover && item.url && item.number === 0 ? (
          !smallChip ? (
            <Chip label="Cover" color="default" />
          ) : (
            <Chip label="C" color="default" />
          )
        ) : null}

        {!props.isCover && item.onlyapp && item.parent ? (
          !smallChip ? (
            <Chip label="Einzige Veröffentlichung" color="secondary" />
          ) : (
            <Chip label="1x" color="secondary" />
          )
        ) : null}

        {!props.isCover && !item.onlyapp && item.firstapp && item.parent ? (
          <Chip label={!smallChip ? "Erstveröffentlichung" : "1."} color="primary" />
        ) : null}

        {!props.isCover && item.otheronlytb && item.parent ? (
          <Chip
            variant="outlined"
            label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
            color="default"
          />
        ) : null}

        {exclusive ? (
          !smallChip ? (
            <Chip label="Exklusiv" color="secondary" />
          ) : (
            <Chip label="Exkl." color="secondary" />
          )
        ) : null}

        {item.parent?.collectedmultipletimes && props.session ? (
          !smallChip ? (
            <Chip color="success" label="Mehrfach gesammelt" />
          ) : (
            <Chip color="success" label="Mehrfach" />
          )
        ) : null}

        {!item.parent?.collectedmultipletimes && item.parent?.collected && props.session ? (
          <Chip color="success" label="Gesammelt" />
        ) : null}

        {!exclusive && issue && issueSelection ? (
          <CoverTooltip issue={issue} us={props.us}>
            <IconButton
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                props.navigate?.(e, generateUrl(issueSelection, !props.us), { filter: null });
              }}
              aria-label="Details"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </CoverTooltip>
        ) : null}
      </Box>
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
      series: baseIssue.issue.series,
    };
  }
  return baseIssue;
}

function toIssueSelection(issue: ContainsIssueLike): SelectedRoot {
  return { issue: issue as SelectedRoot["issue"] };
}
