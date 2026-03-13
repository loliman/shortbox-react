import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { withContext } from "../generic";
import { handleInAppLinkClick } from "../generic/linkUtils";
import { useResolvedImageUrl } from "../generic/useResolvedImageUrl";
import { getIssueLabel, getIssueUrl } from "../../util/issuePresentation";
import {
  getIssuePreviewCover,
  getIssuePreviewFlags,
  getIssueVariantLabel,
  type PreviewIssue,
} from "./utils/issuePreviewUtils";

interface IssuePreviewSmallProps {
  issue: PreviewIssue;
  us?: boolean;
  session?: unknown;
  idx?: number;
  isLast?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
}

const NO_COVER_URL = `${import.meta.env.BASE_URL}nocover.png`;

function IssuePreviewSmall(props: Readonly<IssuePreviewSmallProps>) {
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
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(16, 16, 16, 0.96)" : "background.paper",
        overflow: "hidden",
        minHeight: 640,
      })}
    >
      <CardActionArea
        component="a"
        href={url}
        onClick={(e) => handleInAppLinkClick(e, url, props.navigate)}
        aria-label={`Zu ${issueLabel}`}
        sx={{ height: "100%", display: "flex", alignItems: "stretch" }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1, p: 0, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              px: 1.5,
              py: 1.25,
              minWidth: 0,
              overflow: "hidden",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(24, 24, 24, 0.84)"
                  : "rgba(228, 228, 228, 0.58)",
            })}
          >
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontSize: "clamp(0.72rem, 0.64rem + 0.35vw, 1rem)",
                  display: "block",
                  minWidth: 0,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {issueLabel}
              </Typography>

              {variant ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ fontSize: "clamp(0.58rem, 0.54rem + 0.18vw, 0.75rem)" }}
                >
                  {variant}
                </Typography>
              ) : null}
            </Stack>
          </Box>

          <Box
            sx={(theme) => ({
              flex: 1,
              minHeight: 460,
              backgroundColor:
                theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.04)",
              backgroundImage: isCoverLoading
                ? theme.palette.mode === "dark"
                  ? "linear-gradient(110deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.04) 75%)"
                  : "linear-gradient(110deg, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.14) 50%, rgba(0, 0, 0, 0.04) 75%)"
                : `url(${effectiveCoverUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: isCoverLoading ? "200% 0" : "center",
              backgroundSize: isCoverLoading ? "220% 100%" : "cover",
              animation: isCoverLoading ? "coverShimmer 1.4s ease-in-out infinite" : undefined,
              "@keyframes coverShimmer": {
                "0%": { backgroundPosition: "220% 0" },
                "100%": { backgroundPosition: "-20% 0" },
              },
            })}
          />

          <Box
            sx={(theme) => ({
              display: "flex",
              flexWrap: "nowrap",
              gap: 0.75,
              minHeight: 56,
              alignItems: "center",
              marginTop: "auto",
              px: 1.5,
              py: 1.25,
              overflow: "hidden",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(24, 24, 24, 0.84)"
                  : "rgba(228, 228, 228, 0.58)",
            })}
          >
            {props.issue.verified ? (
              <Chip size="small" label="Verifiziert" color="info" sx={SINGLE_LINE_CHIP_SX} />
            ) : null}
            {flags.collected ? (
              <Chip size="small" label="Gesammelt" color="success" sx={SINGLE_LINE_CHIP_SX} />
            ) : null}
            {flags.collectedMultipleTimes ? (
              <Chip
                size="small"
                label="Mehrfach gesammelt"
                color="success"
                variant="outlined"
                sx={SINGLE_LINE_CHIP_SX}
              />
            ) : null}
            {!us && flags.hasOnlyApp ? (
              <Chip
                size="small"
                label="Einzige Veröffentlichung"
                color="secondary"
                sx={SINGLE_LINE_CHIP_SX}
              />
            ) : null}
            {!us && !flags.hasOnlyApp && flags.hasFirstApp ? (
              <Chip
                size="small"
                label="Erstveröffentlichung"
                color="secondary"
                variant="outlined"
                sx={SINGLE_LINE_CHIP_SX}
              />
            ) : null}
            {!us && flags.hasExclusive ? (
              <Chip
                size="small"
                label="Exklusiver Inhalt"
                color="secondary"
                sx={SINGLE_LINE_CHIP_SX}
              />
            ) : null}
            {!us && flags.hasOtherOnlyTb ? (
              <Chip
                size="small"
                label="Sonst nur in Taschenbuch"
                variant="outlined"
                sx={SINGLE_LINE_CHIP_SX}
              />
            ) : null}
            {!us && flags.isPureReprintDe ? (
              <Chip size="small" label="Nachdruck" variant="outlined" sx={SINGLE_LINE_CHIP_SX} />
            ) : null}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function IssuePreviewPlaceholderSmall(props: { idx?: number; isLast?: boolean }) {
  const widths = ["84%", "72%", "68%", "78%", "62%"] as const;
  const width = widths[(props.idx ?? 0) % widths.length];

  return (
    <Card
      sx={(theme) => ({
        minHeight: 640,
        overflow: "hidden",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(16, 16, 16, 0.96)" : "background.paper",
      })}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 0 }}>
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Skeleton variant="text" width={width} height={30} />
          <Skeleton variant="text" width="42%" />
        </Box>
        <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: 460 }} />
        <Box
          sx={{ display: "flex", gap: 1, minHeight: 56, alignItems: "center", px: 1.5, py: 1.25 }}
        >
          <Skeleton variant="rounded" width={96} height={24} />
          <Skeleton variant="rounded" width={104} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}

const SINGLE_LINE_CHIP_SX = {
  minWidth: 0,
  maxWidth: "100%",
  flexShrink: 1,
  "& .MuiChip-label": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "clamp(0.54rem, 0.5rem + 0.15vw, 0.72rem)",
  },
} as const;

export default withContext(IssuePreviewSmall);
