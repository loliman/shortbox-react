import React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { IssuePreviewPlaceholder } from "../issue-preview/IssuePreview";

export function HomeListingPlaceholder() {
  return (
    <React.Fragment>
      <CardHeader
        title={<Skeleton variant="text" width={220} height={34} />}
        subheader={<Skeleton variant="text" width={260} height={24} />}
      />

      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          <Skeleton variant="text" width="92%" />

          <Box>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="36%" />
          </Box>

          <Box>
            <Skeleton variant="text" width="58%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="88%" />
          </Box>

          <Skeleton variant="text" width={140} />

          <div>
            <IssuePreviewPlaceholder />
            <IssuePreviewPlaceholder />
            <IssuePreviewPlaceholder />
            <IssuePreviewPlaceholder />
            <IssuePreviewPlaceholder />
            <IssuePreviewPlaceholder />
          </div>
        </Stack>
      </CardContent>
    </React.Fragment>
  );
}
