import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingDots() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
      <CircularProgress size={20} />
    </Box>
  );
}
