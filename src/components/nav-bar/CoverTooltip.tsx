import Tooltip from "@mui/material/Tooltip";
import React from "react";

type CoverTooltipIssue = {
  cover?: { url?: string | null } | null;
  series?: { publisher?: { us?: boolean | null } | null } | null;
};

type CoverTooltipProps = {
  issue: CoverTooltipIssue;
  children: React.ReactElement;
  us?: boolean;
  number?: string | number;
};

function getCoverSource(
  issue: CoverTooltipIssue,
  _us?: boolean
): { coverUrl: string; blurCover: boolean } {
  const directCover = issue.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  return { coverUrl: "/nocover.jpg", blurCover: false };
}

function CoverTooltip(props: Readonly<CoverTooltipProps>) {
  const { coverUrl, blurCover } = getCoverSource(props.issue, props.us);

  return (
    <Tooltip
      PopperProps={{
        className: "tooltipCover",
      }}
      title={
        <img
          className={blurCover ? "blurredImage" : ""}
          src={coverUrl}
          width="65px"
          alt="Zur Ausgabe"
        />
      }
    >
      {props.children}
    </Tooltip>
  );
}

export default CoverTooltip;
