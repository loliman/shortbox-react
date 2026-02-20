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
  us?: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function IssueVariants(props: Readonly<IssueVariantsProps>) {
  const variants = (props.issue.variants || []).filter((variant): variant is VariantIssue =>
    Boolean(variant)
  );
  if (variants.length <= 1) return null;

  return (
    <Accordion
      disableGutters
      elevation={1}
      defaultExpanded={false}
      slotProps={{
        transition: {
          collapsedSize: "20px",
        },
      }}
      sx={{
        backgroundColor: "transparent",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1.5,
        overflow: "hidden",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 24 }} />}
        aria-label="Varianten anzeigen"
        sx={{
          minHeight: 48,
          px: 1.5,
          py: 0,
          backgroundColor: (theme) => theme.palette.background.paper,
          "& .MuiAccordionSummary-content": { my: 0, alignItems: "center" },
          "& .MuiAccordionSummary-expandIconWrapper": {
            alignSelf: "center",
            mr: 0.25,
          },
        }}
      >
        <Typography component="p" sx={{ fontWeight: 300 }}>
          Erhältlich in {variants.length} Varianten
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 1.25, pb: 1.25, pt: 0.5 }}>
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            pb: 1,
          }}
        >
          <Stack
            component="ul"
            direction="row"
            spacing={0.35}
            sx={{
              m: 0,
              p: 0,
              listStyle: "none",
              width: "max-content",
            }}
          >
            {variants.map((variant, idx) => (
              <Box
                component="li"
                key={getVariantKey(variant, idx)}
                sx={{
                  p: 0,
                  m: 0,
                  width: { xs: "330px", sm: "375px", md: "430px" },
                  height: { xs: "132px", sm: "144px", md: "156px" },
                  flex: "0 0 auto",
                }}
              >
                <IssueVariantTile
                  issue={props.issue}
                  variant={variant}
                  session={props.session}
                  navigate={props.navigate}
                  us={Boolean(props.us)}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
