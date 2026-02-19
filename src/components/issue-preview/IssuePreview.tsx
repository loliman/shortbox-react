import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
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
  const smallChip =
    Boolean(props.isPhone) || (Boolean(props.isTablet) && Boolean(props.drawerOpen));
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl, blurCover } = getIssuePreviewCover(props.issue, us);
  const flags = getIssuePreviewFlags(props.issue, us, hasSession);
  const issueStories = props.issue.stories || [];
  const isSellable = Boolean(
    props.issue.collected &&
    flags.sellable > 0 &&
    flags.sellable === issueStories.length &&
    hasSession
  );
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  const mobileAlertLabel = <PriorityHighIcon sx={{ fontSize: 16 }} />;
  const cardBackground = coverUrl
    ? `linear-gradient(90deg, rgba(255, 255, 255, 0.96) 30%, rgba(255, 255, 255, 0.75) 58%, rgba(255, 255, 255, 0.12) 100%), url(${coverUrl})`
    : "none";

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        backgroundImage: cardBackground,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "100% 50%",
        backgroundSize: "75%",
      }}
    >
      <CardActionArea
        onClick={(e) => props.navigate?.(e, url)}
        aria-label={`Zu ${getIssueLabel(props.issue)}`}
      >
        <Box
          sx={{
            backdropFilter: blurCover ? "blur(2px)" : "none",
          }}
        >
          <CardContent sx={{ pb: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Box>
                <Typography variant="subtitle1">{issueLabel}</Typography>

                {props.issue.title ? (
                  <Typography variant="subtitle2">{props.issue.title}</Typography>
                ) : null}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {props.issue.verified ? (
                  <Box
                    component="img"
                    src="/verified_badge.png"
                    alt="verifiziert"
                    sx={{ height: 24, width: "auto" }}
                  />
                ) : null}
                {flags.collected ? (
                  <Box
                    component="img"
                    src="/collected_badge.png"
                    alt="gesammelt"
                    sx={{ height: 24, width: "auto" }}
                  />
                ) : null}
              </Box>
            </Box>

            {variant ? <Typography variant="caption">{variant}</Typography> : null}

            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {!us && flags.hasOnlyApp ? (
                <Chip
                  label={!smallChip ? "Einzige Veröffentlichung" : mobileAlertLabel}
                  color="secondary"
                />
              ) : null}

              {!us && flags.hasFirstApp ? (
                <Chip
                  label={!smallChip ? "Erstveröffentlichung" : "1."}
                  color="primary"
                />
              ) : null}

              {!us && flags.hasOtherOnlyTb ? (
                <Chip
                  variant="outlined"
                  label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
                  color="default"
                />
              ) : null}

              {!us && flags.hasExclusive ? (
                <Chip
                  label={!smallChip ? "Exklusiver Inhalt" : mobileAlertLabel}
                  color="secondary"
                />
              ) : null}

              {!us && flags.isPureReprintDe ? (
                <Chip
                  label={!smallChip ? "Reiner Nachdruck" : "ND"}
                  color="default"
                />
              ) : null}

              {flags.collectedMultipleTimes ? (
                <Chip
                  label={
                    !smallChip ? "Mehrfach " + (us ? "auf deutsch " : "") + "gesammelt" : "Mehrfach"
                  }
                  color="success"
                />
              ) : null}

              {isSellable ? (
                <Chip
                  label="Verkaufbar"
                  color="success"
                />
              ) : null}

              {!us && flags.hasNoStoriesDe ? (
                <Chip
                  label={!smallChip ? "Keine Geschichten zugeordnet" : "n/a"}
                  color="default"
                />
              ) : null}

              {us && flags.hasOnlyOnePrintUs ? (
                <Chip
                  label={!smallChip ? "Nur einfach auf deutsch veröffentlicht" : mobileAlertLabel}
                  color="secondary"
                />
              ) : null}

              {us && flags.hasOnlyTbUs ? (
                <Chip
                  variant="outlined"
                  label={!smallChip ? "Nur in Taschenbuch" : "TB"}
                  color="primary"
                />
              ) : null}

              {us && flags.notPublishedInDe ? (
                <Chip
                  label={!smallChip ? "Nicht auf deutsch erschienen" : "n/a"}
                  color="default"
                />
              ) : null}

              {us && flags.hasReprintOfUs ? (
                <Chip label={!smallChip ? "Nachdruck" : "ND"} color="default" />
              ) : null}

              {us && flags.hasReprintsUs ? (
                <Chip label={!smallChip ? "Nachgedruckt" : "ND"} color="default" />
              ) : null}
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export function IssuePreviewPlaceholder() {
  return (
    <Card>
      <CardContent>
        <Box>
          <Skeleton variant="text" width="72%" height={30} />
          <Skeleton variant="text" width="28%" />
          <Skeleton variant="text" width="34%" />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="30%" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default withContext(IssuePreview);
