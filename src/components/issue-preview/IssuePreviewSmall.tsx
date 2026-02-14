import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { withContext } from "../generic";
import { getIssueLabel, getIssueUrl } from "../../util/issuePresentation";
import {
  getIssuePreviewBorderRadius,
  getIssuePreviewCover,
  getIssueVariantLabel,
  type PreviewIssue,
} from "./utils/issuePreviewUtils";

interface IssuePreviewSmallProps {
  issue: PreviewIssue;
  us?: boolean;
  idx?: number;
  isLast?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
}

function IssuePreviewSmall(props: Readonly<IssuePreviewSmallProps>) {
  const us = Boolean(props.us);
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl, blurCover } = getIssuePreviewCover(props.issue, us);
  const borderRadius = getIssuePreviewBorderRadius(props.idx, props.isLast);
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  return (
    <Box
      component="button"
      type="button"
      onClick={(e) => props.navigate?.(e, url)}
      aria-label={`Zu ${issueLabel}`}
      sx={{
        all: "unset",
        cursor: "pointer",
        display: "block",
        width: "100%",
        borderRadius,
        background: coverUrl ? `white url(${coverUrl}) no-repeat 100% 40%` : "white",
        backgroundSize: "35%",
      }}
    >
      <Box
        className={blurCover ? "blurred" : ""}
        sx={{
          width: "100%",
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 1) 65%, rgba(255, 255, 255, 0))",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box>
            <Typography variant="subtitle1">{issueLabel}</Typography>

            {props.issue.title ? (
              <Typography variant="subtitle2">{props.issue.title}</Typography>
            ) : null}
          </Box>

          {variant ? (
            <Typography className="issuePreviewTitleVariant" variant="caption">
              {variant}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export function IssuePreviewPlaceholderSmall(props: { idx?: number; isLast?: boolean }) {
  const widths = ["84%", "72%", "68%", "78%", "62%"] as const;
  const width = widths[(props.idx ?? 0) % widths.length];
  const borderRadius = getIssuePreviewBorderRadius(props.idx, props.isLast);

  return (
    <Box sx={{ borderRadius }}>
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={width} />
        <Skeleton variant="text" width={width} />
      </Box>
    </Box>
  );
}

export default withContext(IssuePreviewSmall);
