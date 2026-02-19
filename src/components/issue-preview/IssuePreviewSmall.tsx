import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { withContext } from "../generic";
import { getIssueLabel, getIssueUrl } from "../../util/issuePresentation";
import {
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
  const { coverUrl } = getIssuePreviewCover(props.issue, us);
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);
  const cardBackground = coverUrl
    ? `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 10%, rgba(255, 255, 255, 0.16) 100%), url(${coverUrl})`
    : "none";

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "background.paper",
        backgroundImage: cardBackground,
        backgroundRepeat: coverUrl ? "no-repeat, no-repeat" : "no-repeat",
        backgroundPosition: coverUrl ? "0 0, 100% 50%" : "0 0",
        backgroundSize: coverUrl ? "100% 100%, cover" : "auto",
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={(e) => props.navigate?.(e, url)} aria-label={`Zu ${issueLabel}`}>
        <CardContent sx={{ py: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" noWrap>
              {issueLabel}
            </Typography>

            {props.issue.title ? (
              <Typography variant="body2" color="text.secondary" noWrap>
                {props.issue.title}
              </Typography>
            ) : null}

            {variant ? (
              <Typography variant="caption" color="text.secondary" noWrap>
                {variant}
              </Typography>
            ) : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function IssuePreviewPlaceholderSmall(props: { idx?: number; isLast?: boolean }) {
  const widths = ["84%", "72%", "68%", "78%", "62%"] as const;
  const width = widths[(props.idx ?? 0) % widths.length];

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1.25, "&:last-child": { pb: 1.25 } }}>
        <Skeleton variant="text" width={width} />
        <Skeleton variant="text" width={width} />
      </CardContent>
    </Card>
  );
}

export default withContext(IssuePreviewSmall);
