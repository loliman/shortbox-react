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
  const smallChip = Boolean(props.isPhone) || (Boolean(props.isTablet) && Boolean(props.drawerOpen));
  const variant = getIssueVariantLabel(props.issue);
  const { coverUrl, blurCover } = getIssuePreviewCover(props.issue, us);
  const flags = getIssuePreviewFlags(props.issue, us, hasSession);
  const issueStories = props.issue.stories || [];
  const isSellable = Boolean(
    props.issue.collected && flags.sellable > 0 && flags.sellable === issueStories.length && hasSession
  );
  const url = getIssueUrl(props.issue, us);
  const issueLabel = getIssueLabel(props.issue);

  const mobileAlertLabel = <PriorityHighIcon className="mobileChip" />;

  return (
    <Card
      sx={{
        background: coverUrl ? `white url(${coverUrl}) no-repeat 100% 50%` : "white",
        backgroundSize: "75%",
      }}
    >
      <CardActionArea
        onClick={(e) => props.navigate?.(e, url)}
        aria-label={`Zu ${getIssueLabel(props.issue)}`}
      >
        <Box
          className={blurCover ? "blurred" : ""}
          sx={{
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0))",
          }}
        >
          <CardContent sx={{ pb: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Box>
                <Typography variant="subtitle1">
                  {issueLabel}
                </Typography>

                {props.issue.title ? <Typography variant="subtitle2">{props.issue.title}</Typography> : null}
              </Box>

              <Box>
                {props.issue.verified ? <img src="/verified_badge.png" alt="verifiziert" height="25" /> : null}
                {flags.collected ? <img src="/collected_badge.png" alt="gesammelt" height="25" /> : null}
              </Box>
            </Box>

            {variant ? <Typography variant="caption">{variant}</Typography> : null}

            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {!us && flags.hasOnlyApp ? (
                <Chip className="chip" label={!smallChip ? "Einzige Veröffentlichung" : mobileAlertLabel} color="secondary" />
              ) : null}

              {!us && flags.hasFirstApp ? (
                <Chip className="chip" label={!smallChip ? "Erstveröffentlichung" : "1."} color="primary" />
              ) : null}

              {!us && flags.hasOtherOnlyTb ? (
                <Chip className="tbchip chip" label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"} color="default" />
              ) : null}

              {!us && flags.hasExclusive ? (
                <Chip className="chip" label={!smallChip ? "Exklusiver Inhalt" : mobileAlertLabel} color="secondary" />
              ) : null}

              {!us && flags.isPureReprintDe ? (
                <Chip className="chip" label={!smallChip ? "Reiner Nachdruck" : "ND"} color="default" />
              ) : null}

              {flags.collectedMultipleTimes ? (
                <Chip
                  className="chip"
                  label={!smallChip ? "Mehrfach " + (us ? "auf deutsch " : "") + "gesammelt" : "Mehrfach"}
                  sx={{ bgcolor: "#4eaf51", color: "common.white" }}
                />
              ) : null}

              {isSellable ? (
                <Chip className="chip" label="Verkaufbar" sx={{ bgcolor: "#4eaf51", color: "common.white" }} />
              ) : null}

              {!us && flags.hasNoStoriesDe ? (
                <Chip className="chip" label={!smallChip ? "Keine Geschichten zugeordnet" : "n/a"} color="default" />
              ) : null}

              {us && flags.hasOnlyOnePrintUs ? (
                <Chip className="chip" label={!smallChip ? "Nur einfach auf deutsch veröffentlicht" : mobileAlertLabel} color="secondary" />
              ) : null}

              {us && flags.hasOnlyTbUs ? (
                <Chip className="chip" label={!smallChip ? "Nur in Taschenbuch" : "TB"} color="primary" />
              ) : null}

              {us && flags.notPublishedInDe ? (
                <Chip className="chip" label={!smallChip ? "Nicht auf deutsch erschienen" : "n/a"} color="default" />
              ) : null}

              {us && flags.hasReprintOfUs ? (
                <Chip className="chip" label={!smallChip ? "Nachdruck" : "ND"} color="default" />
              ) : null}

              {us && flags.hasReprintsUs ? (
                <Chip className="chip" label={!smallChip ? "Nachgedruckt" : "ND"} color="default" />
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
