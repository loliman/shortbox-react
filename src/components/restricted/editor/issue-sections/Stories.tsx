import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddContainsButton from "./AddContainsButton";
import Contains from "./Contains";
import StoryFields from "./StoryFields";
import { storyDefault } from "./defaults";
import type { ContainsProps } from "./types";

function Stories(props: ContainsProps) {
  return (
    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Geschichten
        </Typography>
        <AddContainsButton type="stories" defaultItem={storyDefault} {...props} />
      </Box>

      <Contains {...props} type="stories" fields={<StoryFields />} />
    </Stack>
  );
}

export default Stories;
