import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { getIssueUrl } from "../../../../util/issuePresentation";
import type { VariantIssue } from "./types";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

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
  const variantLabel =
    (props.variant.format || "") +
    " (" +
    (props.variant.variant ? props.variant.variant + " Variant" : "Reguläre Ausgabe") +
    ")";

  return (
    <ImageListItem
      sx={{
        borderRadius: 1.5,
        overflow: "hidden",
        height: "100%",
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
        boxShadow: mainIssue ? "0 8px 20px rgba(15, 23, 42, 0.08)" : "none",
      }}
    >
      <ButtonBase
        onClick={(e) => props.navigate?.(e, getIssueUrl(props.variant, props.us))}
        aria-label={`Zu ${variantLabel}`}
        sx={{ width: "100%", height: "100%", display: "block", textAlign: "left" }}
      >
        <Box
          component="img"
          src={coverUrl}
          alt={variantLabel}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: blurCover ? "blur(2px)" : "none",
          }}
        />

        <ImageListItemBar
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  fontWeight: selected ? 700 : 500,
                  color: selected ? "primary.light" : "inherit",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {variantLabel}
              </Box>
              {props.variant.collected && props.session ? (
                <Box
                  component="img"
                  src="/collected_badge.png"
                  alt="gesammelt"
                  sx={{ height: 20, width: "auto", flexShrink: 0 }}
                />
              ) : null}
            </Box>
          }
          sx={{
            background:
              "linear-gradient(to top, rgba(11, 23, 45, 0.88), rgba(11, 23, 45, 0.4) 65%, transparent)",
            "& .MuiImageListItemBar-titleWrap": {
              px: 1,
              py: 0.5,
            },
          }}
        />
      </ButtonBase>
    </ImageListItem>
  );
}

function getVariantCoverSource(
  variant: VariantIssue,
  _us: boolean
): { coverUrl: string; blurCover: boolean } {
  const directCover = variant.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  return { coverUrl: "/nocover_simple.jpg", blurCover: false };
}
