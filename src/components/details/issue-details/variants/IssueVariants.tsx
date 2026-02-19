import React from "react";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import Box from "@mui/material/Box";
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
    <React.Fragment>
      <Typography component="p" sx={{ fontWeight: 600, mb: 1 }}>
        Erhältlich in {variants.length} Varianten
      </Typography>

      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          pb: 1,
        }}
      >
        <ImageList
          sx={{
            m: 0,
            gridAutoFlow: "column",
            gridTemplateRows: "1fr",
            gridTemplateColumns: "none !important",
            gridAutoColumns: { xs: "150px", sm: "170px", md: "190px" },
            width: "max-content",
            overflow: "visible",
            gap: 8,
          }}
        >
          {variants.map((variant, idx) => (
            <IssueVariantTile
              issue={props.issue}
              variant={variant}
              session={props.session}
              navigate={props.navigate}
              us={Boolean(props.us)}
              key={getVariantKey(variant, idx)}
            />
          ))}
        </ImageList>
      </Box>
    </React.Fragment>
  );
}
