import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import AddContainsButton from "./AddContainsButton";
import Contains from "./Contains";
import StoryFields from "./StoryFields";
import { storyDefault } from "./defaults";
import type { ContainsProps } from "./types";

function Stories(props: ContainsProps) {
  return (
    <Stack spacing={2}>
      <Box>
        <CardHeader sx={{ px: 0, pt: 0 }} title="Geschichten" />
        <AddContainsButton type="stories" defaultItem={storyDefault} {...props} />
      </Box>

      <Contains {...props} type="stories" fields={<StoryFields />} />
    </Stack>
  );
}

export default Stories;
