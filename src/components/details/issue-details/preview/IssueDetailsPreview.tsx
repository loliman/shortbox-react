import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export function IssueDetailsPreview() {
  return (
    <React.Fragment>
      <CardHeader
        title={
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="48%" height={34} />
            <Skeleton variant="text" width="28%" height={24} />
          </Box>
        }
      />

      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Skeleton variant="rounded" width={110} height={24} />
            <Skeleton variant="rounded" width={96} height={24} />
            <Skeleton variant="rounded" width={132} height={24} />
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.1fr) minmax(160px, 20vw) minmax(240px, 33%)",
            },
            gridTemplateRows: { xs: "auto", md: "auto 1fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0, gridColumn: { md: "1 / 2" }, gridRow: { md: "1 / 2" } }}>
            <Skeleton variant="rounded" width="100%" height={250} />
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="88%" />
              <Skeleton variant="text" width="78%" />
            </Box>
          </Box>

          <Box sx={{ minWidth: 0, gridColumn: { md: "2 / 3" }, gridRow: { md: "1 / 2" }, pt: 0.5 }}>
            <Skeleton variant="text" width={95} height={24} />
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Skeleton variant="rounded" width={130} height={28} />
              <Skeleton variant="rounded" width={115} height={28} />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: { xs: "center", md: "flex-end" },
              minWidth: 0,
              gridColumn: { md: "3 / 4" },
              gridRow: { md: "1 / span 2" },
            }}
          >
            <Skeleton variant="rectangular" width="100%" sx={{ maxWidth: 360, aspectRatio: "2 / 3" }} />
            <Skeleton variant="text" width="100%" sx={{ maxWidth: 360, mt: 1 }} />
            <Skeleton variant="text" width="82%" sx={{ maxWidth: 360 }} />
          </Box>

          <Box sx={{ minWidth: 0, gridColumn: { md: "1 / 3" }, gridRow: { md: "2 / 3" }, mt: 1 }}>
            <Skeleton variant="text" width={140} height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} />
          </Box>
        </Box>
      </CardContent>
    </React.Fragment>
  );
}
