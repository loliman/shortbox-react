import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { withContext } from "../generic";
import { getIssueLabel, getIssueUrl } from "../../util/issuePresentation";
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

function IssuePreview(props: Readonly<IssuePreviewProps>) {
  const us = Boolean(props.us);
  const hasSession = Boolean(props.session);
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl } = getIssuePreviewCover(props.issue, us);
  const flags = getIssuePreviewFlags(props.issue, us, hasSession);
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        backgroundImage: coverUrl
          ? (theme) =>
              `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(
                theme.palette.background.paper,
                1
              )} 6%, ${alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.18 : 0.08)} 100%), url(${coverUrl})`
          : "none",
        backgroundRepeat: coverUrl ? "no-repeat, no-repeat" : "no-repeat",
        backgroundPosition: coverUrl ? "0 0, 100% 50%" : "0 0",
        backgroundSize: coverUrl ? "100% 100%, cover" : "auto",
        overflow: "hidden",
      }}
    >
      <CardActionArea
        onClick={(e) => props.navigate?.(e, url)}
        aria-label={`Zu ${getIssueLabel(props.issue)}`}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Box>
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
                <Chip size="small" label="Erstveröffentlichung" color="secondary" variant="outlined" />
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
