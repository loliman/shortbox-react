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
      <Contains {...props} type="stories" fields={<StoryFields />} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <AddContainsButton type="stories" defaultItem={storyDefault} {...props} />
      </Box>
    </Stack>
  );
}

export default Stories;
