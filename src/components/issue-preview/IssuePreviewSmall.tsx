import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { withContext } from "../generic";
import { handleInAppLinkClick } from "../generic/linkUtils";
import { useResolvedImageUrl } from "../generic/useResolvedImageUrl";
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

const NO_COVER_URL = `${import.meta.env.BASE_URL}nocover.png`;

function IssuePreviewSmall(props: Readonly<IssuePreviewSmallProps>) {
  const us = Boolean(props.us);
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl } = getIssuePreviewCover(props.issue, us);
  const candidateCoverUrl = coverUrl?.trim() ? coverUrl : NO_COVER_URL;
  const effectiveCoverUrl = useResolvedImageUrl(candidateCoverUrl, NO_COVER_URL);
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  return (
    <Card
      sx={(theme) => ({
        backgroundColor: "background.paper",
        backgroundImage:
          theme.palette.mode === "dark"
            ? `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), linear-gradient(to right, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.58) 40%, rgba(0, 0, 0, 0.08) 100%), url(${effectiveCoverUrl})`
            : `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), linear-gradient(to right, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.62) 40%, rgba(255, 255, 255, 0) 100%), url(${effectiveCoverUrl})`,
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        backgroundPosition: "0 0, 0 0, 100% 50%",
        backgroundSize: "100% 100%, 100% 100%, cover",
        overflow: "hidden",
      })}
    >
      <CardActionArea
        component="a"
        href={url}
        onClick={(e) => handleInAppLinkClick(e, url, props.navigate)}
        aria-label={`Zu ${issueLabel}`}
      >
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
