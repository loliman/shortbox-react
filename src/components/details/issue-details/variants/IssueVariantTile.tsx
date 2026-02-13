import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { getIssueUrl } from "../../../../util/issuePresentation";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type VariantIssue = {
  format?: string | null;
  variant?: string | null;
  collected?: boolean | null;
  cover?: { url?: string | null } | null;
  covers?: Array<{ parent?: { issue?: { cover?: { url?: string | null } | null } | null } | null }> | null;
  stories?: unknown[] | null;
};

type IssueVariantTileProps = {
  issue: VariantIssue;
  variant: VariantIssue;
  us: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function IssueVariantTile(props: Readonly<IssueVariantTileProps>) {
  const { coverUrl, blurCover } = getVariantCoverSource(props.variant, props.us);
  const selected =
    props.issue.format === props.variant.format && props.issue.variant === props.variant.variant;
  const mainIssue = Boolean(props.session) && (props.variant.stories?.length || 0) > 0;

  return (
    <ImageListItem
      onClick={(e) => props.navigate?.(e, getIssueUrl(props.variant, props.us))}
      className={"tile " + (mainIssue ? "mainIssue" : "")}
    >
      <img
        src={coverUrl}
        className={blurCover ? "blurredImage" : ""}
        alt={(props.variant.variant || "") + " (" + (props.variant.format || "") + ")"}
      />

      <ImageListItemBar
        title={
          <div>
            <div className={selected ? "selectedVariant" : ""}>
              {(props.variant.format || "") +
                " (" +
                (props.variant.variant ? props.variant.variant + " Variant" : "Reguläre Ausgabe") +
                ")"}
            </div>
            {props.variant.collected && props.session ? (
              <img className="verifiedBadge" src="/collected_badge.png" alt="gesammelt" height="25" />
            ) : null}
          </div>
        }
        classes={{
          root: "titleBar",
          title: "title",
          titleWrap: "titleWrap",
        }}
      />
    </ImageListItem>
  );
}

function getVariantCoverSource(
  variant: VariantIssue,
  us: boolean
): { coverUrl: string; blurCover: boolean } {
  const directCover = variant.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  const parentCover = variant.covers?.[0]?.parent?.issue?.cover?.url?.trim();
  if (!us && parentCover) return { coverUrl: parentCover, blurCover: true };

  return { coverUrl: "/nocover_simple.jpg", blurCover: false };
}
