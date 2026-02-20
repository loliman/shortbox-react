import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { IssuePreviewPlaceholder } from "../issue-preview/IssuePreview";

export function HomeListingPlaceholder() {
  return (
    <Stack spacing={2.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box>
        <Skeleton variant="text" width={240} height={34} />
        <Skeleton variant="text" width={300} />
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Skeleton variant="rounded" width={240} height={40} />
        <Skeleton variant="rounded" width={132} height={40} />
      </Box>

      <Stack spacing={1.5}>
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
        <IssuePreviewPlaceholder />
      </Stack>
    </Stack>
  );
}
