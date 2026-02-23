import React from "react";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { getIssueUrl } from "../../../../util/issuePresentation";
import type { VariantIssue } from "./types";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type IssueVariantTileProps = {
  issue: VariantIssue;
  variant: VariantIssue;
  us: boolean;
  selected?: boolean;
  storyOwner?: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function IssueVariantTile(props: Readonly<IssueVariantTileProps>) {
  const { coverUrl, blurCover } = getVariantCoverSource(props.variant, props.us);
  const fallbackUrl = "/nocover_simple.png";
  const [displayUrl, setDisplayUrl] = React.useState(coverUrl);
  const isFallbackCover = displayUrl === fallbackUrl;
  const selected =
    props.selected ??
    (props.issue.format === props.variant.format && props.issue.variant === props.variant.variant);
  const mainIssue = Boolean(props.session) && Boolean(props.storyOwner);
  const variantLabel =
    (props.variant.format || "") +
    " (" +
    (props.variant.variant ? props.variant.variant + " Variant" : "Reguläre Ausgabe") +
    ")";

  React.useEffect(() => {
    setDisplayUrl(coverUrl);
  }, [coverUrl]);

  return (
    <Box
      sx={{
        borderRadius: (theme) => `${Number(theme.shape.borderRadius) || 12}px`,
        overflow: "hidden",
        position: "relative",
        height: "100%",
        transition: "box-shadow 180ms ease, border-color 180ms ease",
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.common.white}`
            : `1px solid ${theme.palette.divider}`,
        boxShadow: 1,
      }}
    >
      {mainIssue ? (
        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            zIndex: 2,
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
          title="Story-Quelle"
          aria-label="Story-Quelle"
        >
          <BookmarkBorderIcon sx={{ fontSize: 22 }} />
        </Box>
      ) : null}

      <ButtonBase
        onClick={(e) => props.navigate?.(e, getIssueUrl(props.variant, props.us))}
        aria-label={`Zu ${variantLabel}`}
        sx={{ width: "100%", height: "100%", display: "block", textAlign: "left" }}
      >
        <Box
          component="img"
          src={displayUrl}
          alt={variantLabel}
          onError={() => {
            setDisplayUrl((prev) => (prev === fallbackUrl ? prev : fallbackUrl));
          }}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: isFallbackCover ? "center 77%" : "center",
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
                  fontWeight: selected ? 500 : 300,
                  color: selected ? "common.white" : "inherit",
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
    </Box>
  );
}

function getVariantCoverSource(
  variant: VariantIssue,
  _us: boolean
): { coverUrl: string; blurCover: boolean } {
  const directCover = variant.cover?.url?.trim();
  if (directCover) return { coverUrl: directCover, blurCover: false };

  return { coverUrl: "/nocover_simple.png", blurCover: false };
}
