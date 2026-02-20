import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import type { PreviewIssue } from "../../issue-preview/utils/issuePreviewUtils";
import { getIssueLabel } from "../../../util/issuePresentation";

type IssueCoverProps = {
  issue: PreviewIssue;
  us: boolean;
};

export function IssueCover(props: Readonly<IssueCoverProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { coverUrl, blurCover } = getIssueCoverSource(props.issue, props.us);
  const issueLabel = getIssueLabel(props.issue);

  return (
    <React.Fragment>
      <ButtonBase
        onClick={() => setIsOpen(true)}
        aria-label={`${issueLabel} Cover vergrößern`}
        sx={{
          width: "clamp(250px, 47.5vw, 740px)",
          maxWidth: "100%",
          aspectRatio: "2 / 3",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "grey.300",
          cursor: "zoom-in",
          display: "block",
        }}
      >
        <CardMedia
          component="img"
          image={coverUrl}
          alt={issueLabel}
          title={issueLabel}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            filter: blurCover ? "blur(2px)" : "none",
          }}
        />
      </ButtonBase>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="md">
        <Box
          component="img"
          src={coverUrl}
          alt={issueLabel}
          sx={{
            display: "block",
            maxWidth: "min(90vw, 960px)",
            maxHeight: "85vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            bgcolor: "grey.200",
          }}
        />
      </Dialog>
    </React.Fragment>
  );
}

function getIssueCoverSource(
  issue: PreviewIssue,
  _us: boolean
): { coverUrl: string; blurCover: boolean } {
  const directCover = issue.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  return { coverUrl: "/nocover.jpg", blurCover: false };
}
