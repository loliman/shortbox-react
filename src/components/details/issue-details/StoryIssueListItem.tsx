import React from "react";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
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
    <ListItem className="issueStoryIssueItem" divider={props.divider}>
      <div>
        <div className="headingContainer">
          <Typography className="issueStoryIssue">{issueTitle}</Typography>
          <Typography className="parentTitle">{props.subtitle || null}</Typography>
        </div>

        {props.parentLink ? (
          <CoverTooltip
            issue={props.parentLink.issue}
            us={Boolean(props.parentLink.coverUs)}
            number={props.parentLink.number}
          >
            <Typography
              className="parentTitle"
              component="button"
              type="button"
              sx={{
                border: 0,
                p: 0,
                background: "transparent",
                cursor: "pointer",
                font: "inherit",
                textAlign: "left",
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
              <span className="asLink">{getIssueLabel(props.parentLink.issue)}</span>
            </Typography>
          </CoverTooltip>
        ) : null}

        <Typography className="issueStoryIssue issueStoryIssuePublisher">{publisherTitle}</Typography>
      </div>

      <div>
        {props.showCollected && props.issue.collected && props.session ? (
          <img src="/collected_badge.png" height={25} alt="gesammelt" />
        ) : null}

        <CoverTooltip issue={props.issue} us={coverUs} number={props.number}>
          <IconButton
            className="detailsIcon issueStoryIssueButton"
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
      </div>
    </ListItem>
  );
}
