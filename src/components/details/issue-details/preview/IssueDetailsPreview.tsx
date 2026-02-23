import React from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export function IssueDetailsPreview() {
  const coverWidth = {
    xs: "100%",
    md: "clamp(320px, 36vw, 480px)",
  };

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) auto",
            },
            gridTemplateRows: { xs: "auto", md: "auto auto" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0, gridColumn: { md: "1 / 2" }, gridRow: { md: "1 / 2" } }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                columnGap: 2,
                rowGap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: "1 1 300px", width: "100%" }}>
                <Skeleton variant="rounded" width="100%" height={200} />
              </Box>

              <Box sx={{ minWidth: 0, flex: "0 1 220px" }}>
                <Skeleton variant="text" width={110} height={24} />
                <Box sx={{ mt: 0.75, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Skeleton variant="rounded" width={130} height={28} />
                  <Skeleton variant="rounded" width={115} height={28} />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: { xs: "center", md: "flex-end" },
              minWidth: 0,
              gridColumn: { md: "2 / 3" },
              gridRow: { md: "1 / span 2" },
            }}
          >
            <Box sx={{ width: coverWidth, maxWidth: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{
                  aspectRatio: "2 / 3",
                  minHeight: { xs: 648, sm: 756, md: 648, lg: 756 },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ minWidth: 0, gridColumn: { md: "1 / 2" }, gridRow: { md: "2 / 3" }, mt: 1 }}>
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={52} />
          </Box>
        </Box>
      </CardContent>
    </React.Fragment>
  );
}
