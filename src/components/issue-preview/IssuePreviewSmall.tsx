import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
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
    ? `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 6%, rgba(255, 255, 255, 0.08) 100%), url(${coverUrl})`
    : "none";

  return (
    <Card
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
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1">{issueLabel}</Typography>

            {props.issue.title ? (
              <Typography variant="body2" color="text.secondary">
                {props.issue.title}
              </Typography>
            ) : null}

            {variant ? (
              <Typography variant="caption" color="text.secondary">
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
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Box>
            <Skeleton variant="text" width={width} height={30} />
            <Skeleton variant="text" width="42%" />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="rounded" width={96} height={24} />
            <Skeleton variant="rounded" width={104} height={24} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default withContext(IssuePreviewSmall);
