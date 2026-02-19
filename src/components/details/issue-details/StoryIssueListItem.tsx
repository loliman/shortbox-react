import React from "react";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import CoverTooltip from "../../nav-bar/CoverTooltip";
import type { StoryIssue } from "./utils/storyIssueUtils";
import { getIssueLabel, getIssueUrl } from "../../../util/issuePresentation";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type ParentLink = {
  issue: StoryIssue;
  number?: string | number;
  prefix?: string;
  routeUs?: boolean;
  coverUs?: boolean;
};

type StoryIssueListItemProps = {
  issue: StoryIssue;
  number?: string | number;
  subtitle?: string | null;
  titleSuffix?: string;
  parentLink?: ParentLink | null;
  routeUs?: boolean;
  coverUs?: boolean;
  divider?: boolean;
  showCollected?: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function StoryIssueListItem(props: Readonly<StoryIssueListItemProps>) {
  const issueTitle = getIssueLabel(props.issue) + (props.titleSuffix || "");
  const publisherTitle = props.issue?.series?.publisher?.name || "";
  const routeUs = Boolean(props.routeUs);
  const coverUs = props.coverUs === undefined ? routeUs : props.coverUs;

  return (
    <ListItem
      divider={props.divider}
      sx={{ px: 0, py: 1.25, alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>{issueTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {props.subtitle || null}
          </Typography>
        </Box>

        {props.parentLink ? (
          <CoverTooltip
            issue={props.parentLink.issue}
            us={Boolean(props.parentLink.coverUs)}
            number={props.parentLink.number}
          >
            <Link
              component="button"
              type="button"
              underline="hover"
              color="text.secondary"
              sx={{
                p: 0,
                textAlign: "left",
                fontSize: "0.875rem",
                lineHeight: 1.43,
              }}
              onClick={(e) => {
                e.stopPropagation();
                props.navigate?.(
                  e,
                  getIssueUrl(props.parentLink?.issue, Boolean(props.parentLink?.routeUs)),
                  {
                    expand: props.parentLink?.number,
                    filter: null,
                  }
                );
              }}
            >
              {(props.parentLink.prefix || "Als") + " "}
              <Box
                component="span"
                sx={{ textDecoration: "underline", textUnderlineOffset: "2px", color: "inherit" }}
              >
                {getIssueLabel(props.parentLink.issue)}
              </Box>
            </Link>
          </CoverTooltip>
        ) : null}

        <Typography variant="body2" color="text.secondary">
          {publisherTitle}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
        {props.showCollected && props.issue.collected && props.session ? (
          <Box component="img" src="/collected_badge.png" sx={{ height: 25, width: "auto" }} alt="gesammelt" />
        ) : null}

        <CoverTooltip issue={props.issue} us={coverUs} number={props.number}>
          <IconButton
            onClick={(e) =>
              props.navigate?.(e, getIssueUrl(props.issue, routeUs), {
                expand: props.number,
                filter: null,
              })
            }
            aria-label="Details"
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </CoverTooltip>
      </Box>
    </ListItem>
  );
}
