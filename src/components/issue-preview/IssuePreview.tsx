import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { withContext } from "../generic";
import { handleInAppLinkClick } from "../generic/linkUtils";
import { useResolvedImageUrl } from "../generic/useResolvedImageUrl";
import { getIssueLabel, getIssueUrl, getSeriesLabel } from "../../util/issuePresentation";
import { IssueReferenceInline } from "../generic/IssueNumberInline";
import {
  getIssuePreviewCover,
  getIssuePreviewFlags,
  getIssueVariantLabel,
  type PreviewIssue,
} from "./utils/issuePreviewUtils";

interface IssuePreviewProps {
  issue: PreviewIssue;
  us?: boolean;
  session?: unknown;
  isPhone?: boolean;
  isTablet?: boolean;
  drawerOpen?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
}

const NO_COVER_URL = `${import.meta.env.BASE_URL}nocover.png`;

function IssuePreview(props: Readonly<IssuePreviewProps>) {
  const us = Boolean(props.us);
  const hasSession = Boolean(props.session);
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl } = getIssuePreviewCover(props.issue, us);
  const candidateCoverUrl = coverUrl?.trim() ? coverUrl : NO_COVER_URL;
  const { resolvedUrl: effectiveCoverUrl, isLoading: isCoverLoading } = useResolvedImageUrl(
    candidateCoverUrl,
    NO_COVER_URL
  );
  const flags = getIssuePreviewFlags(props.issue, us, hasSession);
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  return (
    <Card
      sx={(theme) => ({
        backgroundColor: "background.paper",
        backgroundImage: isCoverLoading
          ? theme.palette.mode === "dark"
            ? "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), linear-gradient(110deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.04) 75%)"
            : "linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), linear-gradient(110deg, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.14) 50%, rgba(0, 0, 0, 0.04) 75%)"
          : theme.palette.mode === "dark"
            ? `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), linear-gradient(to right, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.58) 40%, rgba(0, 0, 0, 0.08) 100%), url(${effectiveCoverUrl})`
            : `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), linear-gradient(to right, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.62) 40%, rgba(255, 255, 255, 0) 100%), url(${effectiveCoverUrl})`,
        backgroundRepeat: isCoverLoading
          ? "no-repeat, no-repeat"
          : "no-repeat, no-repeat, no-repeat",
        backgroundPosition: isCoverLoading ? "0 0, 200% 0" : "0 0, 0 0, 100% 50%",
        backgroundSize: isCoverLoading ? "100% 100%, 220% 100%" : "100% 100%, 100% 100%, cover",
        animation: isCoverLoading ? "coverShimmer 1.4s ease-in-out infinite" : undefined,
        "@keyframes coverShimmer": {
          "0%": { backgroundPosition: "0 0, 220% 0" },
          "100%": { backgroundPosition: "0 0, -20% 0" },
        },
        overflow: "hidden",
      })}
    >
      <CardActionArea
        component="a"
        href={url}
        onClick={(e) => handleInAppLinkClick(e, url, props.navigate)}
        aria-label={`Zu ${getIssueLabel(props.issue)}`}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle1">
                <IssueReferenceInline
                  seriesLabel={getSeriesLabel(props.issue.series)}
                  number={props.issue.number}
                  legacy_number={props.issue.legacy_number}
                />
              </Typography>
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
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {props.issue.verified ? (
                <Chip size="small" label="Verifiziert" color="primary" />
              ) : null}
              {flags.collected ? <Chip size="small" label="Gesammelt" color="success" /> : null}
              {flags.collectedMultipleTimes ? (
                <Chip size="small" label="Mehrfach gesammelt" color="success" variant="outlined" />
              ) : null}
              {!us && flags.hasOnlyApp ? (
                <Chip size="small" label="Einzige Veröffentlichung" color="secondary" />
              ) : null}
              {!us && !flags.hasOnlyApp && flags.hasFirstApp ? (
                <Chip
                  size="small"
                  label="Erstveröffentlichung"
                  color="secondary"
                  variant="outlined"
                />
              ) : null}
              {!us && flags.hasExclusive ? (
                <Chip size="small" label="Exklusiver Inhalt" color="secondary" />
              ) : null}
              {!us && flags.hasOtherOnlyTb ? (
                <Chip size="small" label="Sonst nur in Taschenbuch" variant="outlined" />
              ) : null}
              {!us && flags.isPureReprintDe ? (
                <Chip size="small" label="Nachdruck" variant="outlined" />
              ) : null}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function IssuePreviewPlaceholder() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Box>
            <Skeleton variant="text" width="72%" height={30} />
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

export default withContext(IssuePreview);
