import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getVariantKey } from "../utils/issueDetailsUtils";
import { IssueVariantTile } from "./IssueVariantTile";
import type { VariantIssue } from "./types";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type IssueVariantsProps = {
  issue: VariantIssue;
  storyOwnerKey?: string;
  activeFormat?: string;
  activeVariant?: string;
  us?: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function IssueVariants(props: Readonly<IssueVariantsProps>) {
  const variants = (props.issue.variants || []).filter((variant): variant is VariantIssue =>
    Boolean(variant)
  );
  if (variants.length <= 1) return null;
  const activeKey = getIssueKey({
    format: props.activeFormat ?? props.issue.format,
    variant: props.activeVariant ?? props.issue.variant,
  });
  const activeVariant = variants.find((variant) => getIssueKey(variant) === activeKey) || variants[0];
  const activeCoverUrl = getVariantCoverUrl(activeVariant);

  return (
    <Accordion
      disableGutters
      elevation={1}
      defaultExpanded={false}
      slotProps={{
        transition: {
          collapsedSize: "0px",
        },
      }}
      sx={{
        position: "relative",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(9,11,15,0.6)" : "rgba(255,255,255,0.52)",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1.5,
        overflow: "hidden",
        "&::after": activeCoverUrl
          ? {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${activeCoverUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "grayscale(0.55)",
              opacity: 0.1,
              transform: "scale(1.03)",
              zIndex: 0,
            }
          : undefined,
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 24 }} />}
        aria-label="Varianten anzeigen"
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: 48,
          px: 1.5,
          py: 0,
          backgroundColor: "transparent",
          "& .MuiAccordionSummary-content": { my: 0, alignItems: "center" },
          "& .MuiAccordionSummary-expandIconWrapper": {
            alignSelf: "center",
            mr: 0.25,
          },
        }}
      >
        <Typography component="p" variant="body2" sx={{ fontWeight: 700 }}>
          Erhältlich in {variants.length} Varianten
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          position: "relative",
          zIndex: 1,
          px: 1.25,
          pb: 1.25,
          pt: 0.5,
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            pb: 1,
            position: "relative",
          }}
        >
          <Stack
            component="ul"
            direction="row"
            spacing={0}
            sx={{
              alignItems: "center",
              m: 0,
              p: 0,
              listStyle: "none",
              width: "max-content",
            }}
          >
            {variants.map((variant, idx) => {
              const selected = getIssueKey(variant) === activeKey;
              const storyOwner = getIssueKey(variant) === (props.storyOwnerKey || "");

              return (
                <Box
                  component="li"
                  key={getVariantKey(variant, idx)}
                  sx={{
                    p: 0,
                    m: 0,
                    width: selected
                      ? { xs: "332px", sm: "378px", md: "432px" }
                      : { xs: "302px", sm: "344px", md: "392px" },
                    height: selected
                      ? { xs: "132.8px", sm: "145.1px", md: "156.9px" }
                      : { xs: "120.8px", sm: "132.1px", md: "142.2px" },
                    flex: "0 0 auto",
                    ml: idx === 0 ? 0 : "-1px",
                    transition: "width 180ms ease, height 180ms ease",
                  }}
                >
                  <IssueVariantTile
                    issue={props.issue}
                    variant={variant}
                    edge={
                      variants.length === 1
                        ? "single"
                        : idx === 0
                          ? "start"
                          : idx === variants.length - 1
                            ? "end"
                            : "middle"
                    }
                    selected={selected}
                    storyOwner={storyOwner}
                    session={props.session}
                    navigate={props.navigate}
                    us={Boolean(props.us)}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function getIssueKey(issue: VariantIssue): string {
  return [String(issue.format || "").trim(), String(issue.variant || "").trim()].join("|");
}

function getVariantCoverUrl(variant?: VariantIssue | null): string {
  const direct = variant?.cover?.url?.trim();
  return direct && direct !== "" ? direct : "";
}
