import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
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
      <CardMedia
        component="img"
        image={coverUrl}
        alt={issueLabel}
        title={issueLabel}
        onClick={() => setIsOpen((value) => !value)}
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: 1,
          cursor: "zoom-in",
          filter: blurCover ? "blur(2px)" : "none",
        }}
      />

      <Dialog open={isOpen} onClose={() => setIsOpen((value) => !value)} maxWidth="md">
        <img src={coverUrl} alt={issueLabel} />
      </Dialog>
    </React.Fragment>
  );
}

function getIssueCoverSource(issue: PreviewIssue, us: boolean): { coverUrl: string; blurCover: boolean } {
  const directCover = issue.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  const parentCover = issue.covers?.[0]?.parent?.issue?.cover?.url?.trim();
  if (!us && parentCover) return { coverUrl: parentCover, blurCover: true };

  return { coverUrl: "/nocover.jpg", blurCover: false };
}
