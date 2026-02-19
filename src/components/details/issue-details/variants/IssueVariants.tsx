import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
        <Stack
          component="ul"
          direction="row"
          spacing={1}
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
                width: { xs: "220px", sm: "250px", md: "285px" },
                height: { xs: "88px", sm: "96px", md: "104px" },
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
    </React.Fragment>
  );
}
